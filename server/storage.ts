import type { 
  User, 
  InsertUser,
  Team,
  TeamMember,
  TeamInvitation,
  PaymentMethod,
  BillingHistory,
  NotificationPreferences,
  SecuritySettings,
  UpdateProfile,
} from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserProfile(userId: string, profile: UpdateProfile): Promise<User | undefined>;
  updateUserStripeCustomer(userId: string, customerId: string): Promise<User | undefined>;
  updateUserStripeSubscription(userId: string, subscriptionId: string): Promise<User | undefined>;
  
  // Team methods
  createTeam(name: string, ownerId: string): Promise<Team>;
  getTeam(teamId: string): Promise<Team | undefined>;
  getTeamsByUser(userId: string): Promise<Team[]>;
  updateTeam(teamId: string, name: string): Promise<Team | undefined>;
  deleteTeam(teamId: string): Promise<boolean>;
  
  // Team member methods
  addTeamMember(teamId: string, userId: string, role: string): Promise<TeamMember>;
  getTeamMember(memberId: string): Promise<TeamMember | undefined>;
  getTeamMembers(teamId: string): Promise<TeamMember[]>;
  updateTeamMemberRole(memberId: string, role: string): Promise<TeamMember | undefined>;
  removeTeamMember(memberId: string): Promise<boolean>;
  getUserTeamRole(userId: string, teamId: string): Promise<string | undefined>;
  
  // Invitation methods
  createInvitation(teamId: string, email: string, role: string, invitedBy: string): Promise<TeamInvitation>;
  getInvitation(token: string): Promise<TeamInvitation | undefined>;
  getPendingInvitations(teamId: string): Promise<TeamInvitation[]>;
  deleteInvitation(id: string): Promise<boolean>;
  
  // Payment method methods
  addPaymentMethod(userId: string, method: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>): Promise<PaymentMethod>;
  getPaymentMethods(userId: string): Promise<PaymentMethod[]>;
  setDefaultPaymentMethod(userId: string, methodId: string): Promise<boolean>;
  removePaymentMethod(methodId: string): Promise<boolean>;
  
  // Billing history methods
  addBillingRecord(userId: string, record: Omit<BillingHistory, 'id' | 'userId' | 'createdAt'>): Promise<BillingHistory>;
  getBillingHistory(userId: string): Promise<BillingHistory[]>;
  
  // Notification preferences methods
  getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined>;
  updateNotificationPreferences(userId: string, prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences>;
  
  // Security settings methods
  getSecuritySettings(userId: string): Promise<SecuritySettings | undefined>;
  updateSecuritySettings(userId: string, settings: Partial<SecuritySettings>): Promise<SecuritySettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private teams: Map<string, Team>;
  private teamMembers: Map<string, TeamMember>;
  private teamInvitations: Map<string, TeamInvitation>;
  private paymentMethods: Map<string, PaymentMethod>;
  private billingHistory: Map<string, BillingHistory>;
  private notificationPreferences: Map<string, NotificationPreferences>;
  private securitySettings: Map<string, SecuritySettings>;

  constructor() {
    this.users = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.teamInvitations = new Map();
    this.paymentMethods = new Map();
    this.billingHistory = new Map();
    this.notificationPreferences = new Map();
    this.securitySettings = new Map();
    
    // Seed demo data if in demo mode or development
    if (process.env.AUTH_STRATEGY === "demo" || process.env.NODE_ENV === "development") {
      this.seedDemoData();
    }
  }
  
  private seedDemoData() {
    // Create demo user
    const demoUser: User = {
      id: "demo-user-001",
      username: "demo_user",
      email: "demo@example.com",
      fullName: "Demo User",
      avatarUrl: null,
      bio: "Exploring the platform",
      jobTitle: "Product Manager",
      company: "Demo Corp",
      phone: "+1 (555) 123-4567",
      timezone: "America/New_York",
      language: "en",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date("2024-01-01"),
      lastLogin: new Date(),
    };
    this.users.set(demoUser.id, demoUser);
    
    // Create demo team
    const demoTeam: Team = {
      id: "demo-team-001",
      name: "Demo Team",
      ownerId: demoUser.id,
      createdAt: new Date("2024-01-01"),
    };
    this.teams.set(demoTeam.id, demoTeam);
    
    // Add demo user as team owner
    const demoMember: TeamMember = {
      id: "demo-member-001",
      teamId: demoTeam.id,
      userId: demoUser.id,
      role: "OWNER",
      joinedAt: new Date("2024-01-01"),
    };
    this.teamMembers.set(demoMember.id, demoMember);
    
    // Add additional demo team members
    const additionalMembers = [
      { id: "demo-member-002", name: "Jane Smith", email: "jane@example.com", role: "ADMIN" },
      { id: "demo-member-003", name: "Bob Johnson", email: "bob@example.com", role: "MEMBER" },
      { id: "demo-member-004", name: "Alice Williams", email: "alice@example.com", role: "VIEWER" },
    ];
    
    additionalMembers.forEach((member, idx) => {
      const userId = `demo-user-00${idx + 2}`;
      const user: User = {
        id: userId,
        username: member.email.split('@')[0],
        email: member.email,
        fullName: member.name,
        avatarUrl: null,
        bio: null,
        jobTitle: null,
        company: null,
        phone: null,
        timezone: null,
        language: null,
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        createdAt: new Date("2024-01-15"),
        lastLogin: new Date(),
      };
      this.users.set(userId, user);
      
      const teamMember: TeamMember = {
        id: member.id,
        teamId: demoTeam.id,
        userId: userId,
        role: member.role,
        joinedAt: new Date("2024-01-15"),
      };
      this.teamMembers.set(teamMember.id, teamMember);
    });
    
    // Add demo invitations
    const demoInvitation: TeamInvitation = {
      id: "demo-invitation-001",
      teamId: demoTeam.id,
      email: "pending@example.com",
      role: "MEMBER",
      token: "demo-token-001",
      invitedBy: demoUser.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };
    this.teamInvitations.set(demoInvitation.id, demoInvitation);
    
    // Add demo notification preferences
    const demoNotifPrefs: NotificationPreferences = {
      userId: demoUser.id,
      emailNotifications: true,
      invoiceAlerts: true,
      seasonalAlerts: true,
      teamNotifications: true,
      billingAlerts: true,
      productUpdates: false,
      pushNotifications: true,
      smsNotifications: false,
      securityAlerts: true,
      digestFrequency: "daily",
    };
    this.notificationPreferences.set(demoUser.id, demoNotifPrefs);
    
    // Add demo security settings
    const demoSecSettings: SecuritySettings = {
      userId: demoUser.id,
      twoFactorEnabled: false,
      recoveryEmail: "recovery@example.com",
      sessionTimeout: 30,
    };
    this.securitySettings.set(demoUser.id, demoSecSettings);
    
    // Add demo payment method
    const demoPaymentMethod: PaymentMethod = {
      id: "demo-payment-001",
      userId: demoUser.id,
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      createdAt: new Date("2024-01-01"),
    };
    this.paymentMethods.set(demoPaymentMethod.id, demoPaymentMethod);
    
    // Add demo billing history
    const billingRecords = [
      { id: "bill-001", amount: 2999, description: "Pro Plan - Monthly", date: new Date("2024-10-01"), status: "paid" as const },
      { id: "bill-002", amount: 2999, description: "Pro Plan - Monthly", date: new Date("2024-09-01"), status: "paid" as const },
      { id: "bill-003", amount: 2999, description: "Pro Plan - Monthly", date: new Date("2024-08-01"), status: "paid" as const },
    ];
    
    billingRecords.forEach((record) => {
      const billingRecord: BillingHistory = {
        id: record.id,
        userId: demoUser.id,
        amount: record.amount,
        currency: "usd",
        description: record.description,
        status: record.status,
        invoiceUrl: `https://invoices.example.com/${record.id}`,
        createdAt: record.date,
      };
      this.billingHistory.set(record.id, billingRecord);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email || null,
      fullName: insertUser.fullName || null,
      avatarUrl: null,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date(),
      lastLogin: null,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserProfile(userId: string, profile: UpdateProfile): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updated = { ...user, ...profile };
    this.users.set(userId, updated);
    return updated;
  }

  async updateUserStripeCustomer(userId: string, customerId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updated = { ...user, stripeCustomerId: customerId };
    this.users.set(userId, updated);
    return updated;
  }

  async updateUserStripeSubscription(userId: string, subscriptionId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updated = { ...user, stripeSubscriptionId: subscriptionId };
    this.users.set(userId, updated);
    return updated;
  }

  // Team methods
  async createTeam(name: string, ownerId: string): Promise<Team> {
    const id = randomUUID();
    const team: Team = {
      id,
      name,
      ownerId,
      createdAt: new Date(),
    };
    this.teams.set(id, team);
    
    await this.addTeamMember(id, ownerId, 'owner');
    return team;
  }

  async getTeam(teamId: string): Promise<Team | undefined> {
    return this.teams.get(teamId);
  }

  async getTeamsByUser(userId: string): Promise<Team[]> {
    const memberRecords = Array.from(this.teamMembers.values()).filter(
      (member) => member.userId === userId
    );
    return memberRecords
      .map((member) => this.teams.get(member.teamId))
      .filter((team): team is Team => team !== undefined);
  }

  async updateTeam(teamId: string, name: string): Promise<Team | undefined> {
    const team = this.teams.get(teamId);
    if (!team) return undefined;
    
    const updated = { ...team, name };
    this.teams.set(teamId, updated);
    return updated;
  }

  async deleteTeam(teamId: string): Promise<boolean> {
    return this.teams.delete(teamId);
  }

  // Team member methods
  async addTeamMember(teamId: string, userId: string, role: string): Promise<TeamMember> {
    const id = randomUUID();
    const member: TeamMember = {
      id,
      teamId,
      userId,
      role,
      status: 'active',
      joinedAt: new Date(),
    };
    this.teamMembers.set(id, member);
    return member;
  }

  async getTeamMember(memberId: string): Promise<TeamMember | undefined> {
    return this.teamMembers.get(memberId);
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values()).filter(
      (member) => member.teamId === teamId
    );
  }

  async updateTeamMemberRole(memberId: string, role: string): Promise<TeamMember | undefined> {
    const member = this.teamMembers.get(memberId);
    if (!member) return undefined;
    
    const updated = { ...member, role };
    this.teamMembers.set(memberId, updated);
    return updated;
  }

  async removeTeamMember(memberId: string): Promise<boolean> {
    return this.teamMembers.delete(memberId);
  }

  async getUserTeamRole(userId: string, teamId: string): Promise<string | undefined> {
    const member = Array.from(this.teamMembers.values()).find(
      (m) => m.userId === userId && m.teamId === teamId
    );
    return member?.role;
  }

  // Invitation methods
  async createInvitation(teamId: string, email: string, role: string, invitedBy: string): Promise<TeamInvitation> {
    const id = randomUUID();
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    
    const invitation: TeamInvitation = {
      id,
      teamId,
      email,
      role,
      token,
      invitedBy,
      expiresAt,
      createdAt: new Date(),
    };
    this.teamInvitations.set(id, invitation);
    return invitation;
  }

  async getInvitation(token: string): Promise<TeamInvitation | undefined> {
    return Array.from(this.teamInvitations.values()).find(
      (inv) => inv.token === token
    );
  }

  async getPendingInvitations(teamId: string): Promise<TeamInvitation[]> {
    return Array.from(this.teamInvitations.values()).filter(
      (inv) => inv.teamId === teamId && inv.expiresAt > new Date()
    );
  }

  async deleteInvitation(id: string): Promise<boolean> {
    return this.teamInvitations.delete(id);
  }

  // Payment method methods
  async addPaymentMethod(userId: string, method: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt'>): Promise<PaymentMethod> {
    const id = randomUUID();
    const paymentMethod: PaymentMethod = {
      id,
      userId,
      ...method,
      createdAt: new Date(),
    };
    this.paymentMethods.set(id, paymentMethod);
    return paymentMethod;
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values()).filter(
      (method) => method.userId === userId
    );
  }

  async setDefaultPaymentMethod(userId: string, methodId: string): Promise<boolean> {
    const methods = await this.getPaymentMethods(userId);
    
    for (const method of methods) {
      const updated = { ...method, isDefault: method.id === methodId };
      this.paymentMethods.set(method.id, updated);
    }
    
    return true;
  }

  async removePaymentMethod(methodId: string): Promise<boolean> {
    return this.paymentMethods.delete(methodId);
  }

  // Billing history methods
  async addBillingRecord(userId: string, record: Omit<BillingHistory, 'id' | 'userId' | 'createdAt'>): Promise<BillingHistory> {
    const id = randomUUID();
    const billing: BillingHistory = {
      id,
      userId,
      ...record,
      createdAt: new Date(),
    };
    this.billingHistory.set(id, billing);
    return billing;
  }

  async getBillingHistory(userId: string): Promise<BillingHistory[]> {
    return Array.from(this.billingHistory.values())
      .filter((record) => record.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  // Notification preferences methods
  async getNotificationPreferences(userId: string): Promise<NotificationPreferences | undefined> {
    return Array.from(this.notificationPreferences.values()).find(
      (pref) => pref.userId === userId
    );
  }

  async updateNotificationPreferences(userId: string, prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    let existing = await this.getNotificationPreferences(userId);
    
    if (!existing) {
      const id = randomUUID();
      existing = {
        id,
        userId,
        emailNotifications: true,
        invoiceAlerts: true,
        seasonalAlerts: true,
        teamUpdates: true,
        billingAlerts: true,
      };
    }
    
    const updated = { ...existing, ...prefs };
    this.notificationPreferences.set(updated.id, updated);
    return updated;
  }

  // Security settings methods
  async getSecuritySettings(userId: string): Promise<SecuritySettings | undefined> {
    return Array.from(this.securitySettings.values()).find(
      (settings) => settings.userId === userId
    );
  }

  async updateSecuritySettings(userId: string, settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    let existing = await this.getSecuritySettings(userId);
    
    if (!existing) {
      const id = randomUUID();
      existing = {
        id,
        userId,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        recoveryEmail: null,
        sessionTimeout: 30,
      };
    }
    
    const updated = { ...existing, ...settings };
    this.securitySettings.set(updated.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
