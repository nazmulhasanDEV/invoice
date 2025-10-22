import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { z } from "zod";
import { 
  updateProfileSchema, 
  ROLES, 
  ROLE_PERMISSIONS,
  PERMISSIONS,
  type User 
} from "@shared/schema";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: User;
      isAuthenticated(): boolean;
    }
  }
}

// Initialize Stripe (will be null if secrets not set)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover",
  });
}

// Validation schemas
const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
});

const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum([ROLES.VIEWER, ROLES.MEMBER, ROLES.MANAGER, ROLES.ADMIN] as const),
});

const updateRoleSchema = z.object({
  role: z.enum([ROLES.VIEWER, ROLES.MEMBER, ROLES.MANAGER, ROLES.ADMIN, ROLES.OWNER] as const),
});

const addPaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, "Payment method ID is required"),
});

// Demo mode user - consistent across all requests
const DEMO_USER: User = {
  id: "demo-user-001",
  username: "demo_user",
  email: "demo@example.com",
  fullName: "Demo User",
  bio: "Exploring the platform",
  jobTitle: "Product Manager",
  company: "Demo Corp",
  phone: "+1 (555) 123-4567",
  timezone: "America/New_York",
  language: "en",
  createdAt: new Date("2024-01-01"),
};

// Auth middleware with demo mode support
function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Check if demo mode is enabled (default to demo mode for now)
  const isDemoMode = process.env.AUTH_STRATEGY === "demo" || process.env.NODE_ENV === "development";
  
  if (isDemoMode) {
    // Inject demo user and mock authentication
    req.user = DEMO_USER;
    req.isAuthenticated = () => true;
    return next();
  }
  
  // Standard authentication check
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// Permission check helper
function hasPermission(userRole: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}

// Team membership verification middleware
async function verifyTeamMembership(req: Request, res: Response, next: NextFunction) {
  const user = req.user as User;
  const teamId = req.params.teamId;
  
  if (!teamId) {
    return res.status(400).json({ message: "Team ID is required" });
  }
  
  const userRole = await storage.getUserTeamRole(user.id, teamId);
  if (!userRole) {
    return res.status(403).json({ message: "You are not a member of this team" });
  }
  
  (req as any).userTeamRole = userRole;
  next();
}

// Permission check middleware factory
function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).userTeamRole;
    if (!userRole || !hasPermission(userRole, permission)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Profile Settings
  app.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/profile", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const validated = updateProfileSchema.parse(req.body);
      const updated = await storage.updateUserProfile(user.id, validated);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Team Management
  app.post("/api/teams", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const validated = createTeamSchema.parse(req.body);
      const team = await storage.createTeam(validated.name, user.id);
      res.json(team);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/teams", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const teams = await storage.getTeamsByUser(user.id);
      res.json(teams);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/teams/:teamId", requireAuth, verifyTeamMembership, async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/teams/:teamId/members", requireAuth, verifyTeamMembership, async (req, res) => {
    try {
      const members = await storage.getTeamMembers(req.params.teamId);
      const membersWithUsers = await Promise.all(
        members.map(async (member) => {
          const user = await storage.getUser(member.userId);
          return { ...member, user };
        })
      );
      res.json(membersWithUsers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/teams/:teamId/invite", requireAuth, verifyTeamMembership, requirePermission(PERMISSIONS.MANAGE_TEAM), async (req, res) => {
    try {
      const user = req.user as User;
      const validated = inviteTeamMemberSchema.parse(req.body);
      
      const invitation = await storage.createInvitation(
        req.params.teamId,
        validated.email,
        validated.role,
        user.id
      );
      
      res.json(invitation);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/teams/:teamId/invitations", requireAuth, verifyTeamMembership, requirePermission(PERMISSIONS.MANAGE_TEAM), async (req, res) => {
    try {
      const invitations = await storage.getPendingInvitations(req.params.teamId);
      res.json(invitations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/invitations/:invitationId", requireAuth, async (req, res) => {
    try {
      const invitation = await storage.getInvitation(req.params.invitationId);
      if (!invitation) {
        return res.status(404).json({ message: "Invitation not found" });
      }
      
      const userRole = await storage.getUserTeamRole((req.user as User).id, invitation.teamId);
      if (!userRole || !hasPermission(userRole, PERMISSIONS.MANAGE_TEAM)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      
      await storage.deleteInvitation(req.params.invitationId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/team-members/:memberId/role", requireAuth, async (req, res) => {
    try {
      const validated = updateRoleSchema.parse(req.body);
      const targetMember = await storage.getTeamMember(req.params.memberId);
      
      if (!targetMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      const user = req.user as User;
      const userRole = await storage.getUserTeamRole(user.id, targetMember.teamId);
      if (!userRole || !hasPermission(userRole, PERMISSIONS.MANAGE_TEAM)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      
      if (targetMember.role === ROLES.OWNER) {
        return res.status(403).json({ message: "Cannot change owner role" });
      }
      
      if (validated.role === ROLES.OWNER) {
        if (userRole !== ROLES.OWNER) {
          return res.status(403).json({ message: "Only the team owner can assign the owner role" });
        }
        
        const team = await storage.getTeam(targetMember.teamId);
        if (team && team.ownerId !== user.id) {
          return res.status(403).json({ message: "Only the team owner can assign the owner role" });
        }
      }
      
      const updated = await storage.updateTeamMemberRole(req.params.memberId, validated.role);
      res.json(updated);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/team-members/:memberId", requireAuth, async (req, res) => {
    try {
      const targetMember = await storage.getTeamMember(req.params.memberId);
      
      if (!targetMember) {
        return res.status(404).json({ message: "Team member not found" });
      }
      
      const userRole = await storage.getUserTeamRole((req.user as User).id, targetMember.teamId);
      if (!userRole || !hasPermission(userRole, PERMISSIONS.MANAGE_TEAM)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      
      if (targetMember.role === ROLES.OWNER) {
        return res.status(403).json({ message: "Cannot remove team owner" });
      }
      
      await storage.removeTeamMember(req.params.memberId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stripe Payment Methods
  app.post("/api/stripe/setup-intent", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing is not configured. Please contact support." });
      }

      let user = req.user as User;
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        try {
          const customer = await stripe.customers.create({
            email: user.email || undefined,
            metadata: { userId: user.id },
          });
          customerId = customer.id;
          const updated = await storage.updateUserStripeCustomer(user.id, customerId);
          if (updated) {
            user = updated;
          }
        } catch (stripeError: any) {
          return res.status(500).json({ message: `Failed to create Stripe customer: ${stripeError.message}` });
        }
      }

      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
      });

      if (!setupIntent.client_secret) {
        return res.status(500).json({ message: "Failed to create setup intent" });
      }

      res.json({ clientSecret: setupIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/payment-methods", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing is not configured" });
      }

      const validated = addPaymentMethodSchema.parse(req.body);
      let user = req.user as User;

      if (!user.stripeCustomerId) {
        try {
          const customer = await stripe.customers.create({
            email: user.email || undefined,
            metadata: { userId: user.id },
          });
          const updated = await storage.updateUserStripeCustomer(user.id, customer.id);
          if (updated) {
            user = updated;
          }
        } catch (stripeError: any) {
          return res.status(500).json({ message: `Failed to create Stripe customer: ${stripeError.message}` });
        }
      }

      try {
        await stripe.paymentMethods.attach(validated.paymentMethodId, {
          customer: user.stripeCustomerId!,
        });
      } catch (stripeError: any) {
        return res.status(400).json({ message: `Failed to attach payment method: ${stripeError.message}` });
      }

      const paymentMethod = await stripe.paymentMethods.retrieve(validated.paymentMethodId);

      const saved = await storage.addPaymentMethod(user.id, {
        stripePaymentMethodId: validated.paymentMethodId,
        type: paymentMethod.type,
        last4: paymentMethod.card?.last4 || "",
        brand: paymentMethod.card?.brand || null,
        expiryMonth: paymentMethod.card?.exp_month || null,
        expiryYear: paymentMethod.card?.exp_year || null,
        isDefault: false,
      });

      res.json(saved);
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/payment-methods", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const methods = await storage.getPaymentMethods(user.id);
      res.json(methods);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/payment-methods/:methodId/default", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      await storage.setDefaultPaymentMethod(user.id, req.params.methodId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/payment-methods/:methodId", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe not configured" });
      }

      const methods = await storage.getPaymentMethods((req.user as User).id);
      const method = methods.find(m => m.id === req.params.methodId);
      
      if (method) {
        await stripe.paymentMethods.detach(method.stripePaymentMethodId);
        await storage.removePaymentMethod(req.params.methodId);
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Billing History
  app.get("/api/billing-history", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const history = await storage.getBillingHistory(user.id);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Notification Preferences
  app.get("/api/notification-preferences", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const prefs = await storage.getNotificationPreferences(user.id);
      res.json(prefs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/notification-preferences", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const updated = await storage.updateNotificationPreferences(user.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Security Settings
  app.get("/api/security-settings", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const settings = await storage.getSecuritySettings(user.id);
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/security-settings", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const updated = await storage.updateSecuritySettings(user.id, req.body);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
