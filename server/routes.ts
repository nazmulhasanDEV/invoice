import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { 
  updateProfileSchema, 
  ROLES, 
  ROLE_PERMISSIONS,
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

// Auth middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// Permission check helper
function hasPermission(userRole: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
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
      const { name } = req.body;
      const team = await storage.createTeam(name, user.id);
      res.json(team);
    } catch (error: any) {
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

  app.get("/api/teams/:teamId", requireAuth, async (req, res) => {
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

  app.get("/api/teams/:teamId/members", requireAuth, async (req, res) => {
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

  app.post("/api/teams/:teamId/invite", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { email, role } = req.body;
      
      const invitation = await storage.createInvitation(
        req.params.teamId,
        email,
        role || ROLES.MEMBER,
        user.id
      );
      
      res.json(invitation);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/teams/:teamId/invitations", requireAuth, async (req, res) => {
    try {
      const invitations = await storage.getPendingInvitations(req.params.teamId);
      res.json(invitations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/invitations/:invitationId", requireAuth, async (req, res) => {
    try {
      await storage.deleteInvitation(req.params.invitationId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/team-members/:memberId/role", requireAuth, async (req, res) => {
    try {
      const { role } = req.body;
      const updated = await storage.updateTeamMemberRole(req.params.memberId, role);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/team-members/:memberId", requireAuth, async (req, res) => {
    try {
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
        return res.status(500).json({ message: "Stripe not configured" });
      }

      const user = req.user as User;
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
        await storage.updateUserStripeCustomer(user.id, customerId);
      }

      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
      });

      res.json({ clientSecret: setupIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/payment-methods", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: "Stripe not configured" });
      }

      const user = req.user as User;
      const { paymentMethodId } = req.body;

      if (!user.stripeCustomerId) {
        return res.status(400).json({ message: "No Stripe customer ID" });
      }

      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
      });

      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

      const saved = await storage.addPaymentMethod(user.id, {
        stripePaymentMethodId: paymentMethodId,
        type: paymentMethod.type,
        last4: paymentMethod.card?.last4 || "",
        brand: paymentMethod.card?.brand || null,
        expiryMonth: paymentMethod.card?.exp_month || null,
        expiryYear: paymentMethod.card?.exp_year || null,
        isDefault: false,
      });

      res.json(saved);
    } catch (error: any) {
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
