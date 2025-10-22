import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Role and Permission Constants
export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  MANAGER: "manager",
  MEMBER: "member",
  VIEWER: "viewer",
} as const;

export const PERMISSIONS = {
  VIEW_INVOICES: "view_invoices",
  UPLOAD_INVOICES: "upload_invoices",
  MANAGE_CATEGORIES: "manage_categories",
  MANAGE_TEAM: "manage_team",
  BILLING_ACCESS: "billing_access",
  SETTINGS_ACCESS: "settings_access",
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.OWNER]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_INVOICES,
    PERMISSIONS.UPLOAD_INVOICES,
    PERMISSIONS.MANAGE_CATEGORIES,
  ],
  [ROLES.MEMBER]: [PERMISSIONS.VIEW_INVOICES, PERMISSIONS.UPLOAD_INVOICES],
  [ROLES.VIEWER]: [PERMISSIONS.VIEW_INVOICES],
};

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Users Table (Extended)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

// Teams Table
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Team Members Table
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull().references(() => teams.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default(ROLES.MEMBER),
  status: text("status").notNull().default("active"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Team Invitations Table
export const teamInvitations = pgTable("team_invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").notNull().references(() => teams.id),
  email: text("email").notNull(),
  role: text("role").notNull().default(ROLES.MEMBER),
  token: text("token").notNull().unique(),
  invitedBy: varchar("invited_by").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment Methods Table
export const paymentMethods = pgTable("payment_methods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripePaymentMethodId: text("stripe_payment_method_id").notNull(),
  type: text("type").notNull(),
  last4: text("last4").notNull(),
  brand: text("brand"),
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Billing History Table
export const billingHistory = pgTable("billing_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  stripeInvoiceId: text("stripe_invoice_id").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("usd"),
  status: text("status").notNull(),
  invoiceUrl: text("invoice_url"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notification Preferences Table
export const notificationPreferences = pgTable("notification_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  emailNotifications: boolean("email_notifications").default(true),
  invoiceAlerts: boolean("invoice_alerts").default(true),
  seasonalAlerts: boolean("seasonal_alerts").default(true),
  teamUpdates: boolean("team_updates").default(true),
  billingAlerts: boolean("billing_alerts").default(true),
});

// Security Settings Table
export const securitySettings = pgTable("security_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id).unique(),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  recoveryEmail: text("recovery_email"),
  sessionTimeout: integer("session_timeout").default(30),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertTeamInvitationSchema = createInsertSchema(teamInvitations).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
});

export const insertBillingHistorySchema = createInsertSchema(billingHistory).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences).omit({
  id: true,
});

export const insertSecuritySettingsSchema = createInsertSchema(securitySettings).omit({
  id: true,
});

// Update Profile Schema
export const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
});

// Export Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type TeamInvitation = typeof teamInvitations.$inferSelect;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type BillingHistory = typeof billingHistory.$inferSelect;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type SecuritySettings = typeof securitySettings.$inferSelect;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
