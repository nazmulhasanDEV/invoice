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
