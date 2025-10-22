import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Settings as SettingsIcon, Users, CreditCard, Bell, Shield, Plus, Trash2, Mail } from "lucide-react";
import { ROLES, type User as UserType, type TeamMember, type PaymentMethod, type BillingHistory } from "@shared/schema";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" data-testid="heading-settings">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5" data-testid="tabs-settings">
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="team" data-testid="tab-team">
              <Users className="w-4 h-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="billing" data-testid="tab-billing">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" data-testid="tab-security">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <TeamSettings />
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <BillingSettings />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const { toast } = useToast();
  const { data: user, isLoading } = useQuery<UserType>({
    queryKey: ["/api/profile"],
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { fullName?: string; email?: string }) => {
      return await apiRequest("PATCH", "/api/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (isLoading) {
    return <div data-testid="loading-profile">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your account profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={user?.username || ""}
              disabled
              data-testid="input-username"
            />
            <p className="text-sm text-muted-foreground">Username cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName || user?.fullName || ""}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              data-testid="input-full-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email || user?.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              data-testid="input-email"
            />
          </div>

          <Button 
            type="submit" 
            disabled={updateProfileMutation.isPending}
            data-testid="button-save-profile"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date | null;
}

interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: string;
  expiresAt: Date;
  createdAt: Date | null;
}

function TeamSettings() {
  const { toast } = useToast();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>(ROLES.MEMBER);

  const { data: teams, isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
  });

  const selectedTeamId = teams?.[0]?.id;

  const { data: members, isLoading: membersLoading } = useQuery<Array<TeamMember & { user?: UserType }>>({
    queryKey: ["/api/teams", selectedTeamId, "members"],
    enabled: !!selectedTeamId,
  });

  const { data: invitations } = useQuery<TeamInvitation[]>({
    queryKey: ["/api/teams", selectedTeamId, "invitations"],
    enabled: !!selectedTeamId,
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      return await apiRequest("POST", `/api/teams/${selectedTeamId}/invite`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", selectedTeamId, "invitations"] });
      setIsInviteDialogOpen(false);
      setInviteEmail("");
      toast({
        title: "Invitation Sent",
        description: "Team invitation has been sent successfully",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: string }) => {
      return await apiRequest("PATCH", `/api/team-members/${memberId}/role`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", selectedTeamId, "members"] });
      toast({
        title: "Role Updated",
        description: "Team member role has been updated",
      });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      return await apiRequest("DELETE", `/api/team-members/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams", selectedTeamId, "members"] });
      toast({
        title: "Member Removed",
        description: "Team member has been removed",
      });
    },
  });

  if (teamsLoading) {
    return <div data-testid="loading-team">Loading team...</div>;
  }

  if (!teams || teams.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">No team found. Create your first team to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team members and their roles</CardDescription>
          </div>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-invite-member">
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>Send an invitation to join your team</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    data-testid="input-invite-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger data-testid="select-invite-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ROLES.VIEWER}>Viewer</SelectItem>
                      <SelectItem value={ROLES.MEMBER}>Member</SelectItem>
                      <SelectItem value={ROLES.MANAGER}>Manager</SelectItem>
                      <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  onClick={() => inviteMutation.mutate({ email: inviteEmail, role: inviteRole })}
                  disabled={inviteMutation.isPending || !inviteEmail}
                  data-testid="button-send-invite"
                >
                  {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member.id} data-testid={`row-member-${member.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {member.user?.username?.slice(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <span data-testid={`text-member-name-${member.id}`}>{member.user?.username}</span>
                    </div>
                  </TableCell>
                  <TableCell data-testid={`text-member-email-${member.id}`}>
                    {member.user?.email || "-"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={member.role}
                      onValueChange={(role) => updateRoleMutation.mutate({ memberId: member.id, role })}
                      disabled={member.role === ROLES.OWNER}
                    >
                      <SelectTrigger className="w-32" data-testid={`select-member-role-${member.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ROLES.VIEWER}>Viewer</SelectItem>
                        <SelectItem value={ROLES.MEMBER}>Member</SelectItem>
                        <SelectItem value={ROLES.MANAGER}>Manager</SelectItem>
                        <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                        <SelectItem value={ROLES.OWNER}>Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell data-testid={`text-member-joined-${member.id}`}>
                    {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    {member.role !== ROLES.OWNER && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMemberMutation.mutate(member.id)}
                        data-testid={`button-remove-member-${member.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {invitations && invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invitations.map((inv: any) => (
                <div key={inv.id} className="flex items-center justify-between p-3 border rounded-md" data-testid={`invitation-${inv.id}`}>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium" data-testid={`text-invitation-email-${inv.id}`}>{inv.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Role: <Badge variant="secondary">{inv.role}</Badge>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Expires {new Date(inv.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BillingSettings() {
  const { toast } = useToast();
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const [setupIntentSecret, setSetupIntentSecret] = useState<string | null>(null);

  const { data: paymentMethods, isLoading: methodsLoading } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });

  const { data: billingHistory } = useQuery<BillingHistory[]>({
    queryKey: ["/api/billing-history"],
  });

  const setupIntentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/stripe/setup-intent");
      return response.json();
    },
    onSuccess: (data) => {
      setSetupIntentSecret(data.clientSecret);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize payment setup",
        variant: "destructive",
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (methodId: string) => {
      return await apiRequest("POST", `/api/payment-methods/${methodId}/default`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({
        title: "Default Payment Method Updated",
        description: "Your default payment method has been updated",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (methodId: string) => {
      return await apiRequest("DELETE", `/api/payment-methods/${methodId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
      toast({
        title: "Payment Method Removed",
        description: "Payment method has been removed",
      });
    },
  });

  const handleAddCard = () => {
    setupIntentMutation.mutate();
    setIsAddCardDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </div>
          <Dialog open={isAddCardDialogOpen} onOpenChange={setIsAddCardDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddCard} data-testid="button-add-card">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>Add a new credit or debit card</DialogDescription>
              </DialogHeader>
              {setupIntentSecret && stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret: setupIntentSecret }}>
                  <AddCardForm onSuccess={() => {
                    setIsAddCardDialogOpen(false);
                    setSetupIntentSecret(null);
                  }} />
                </Elements>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Initializing...
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {methodsLoading ? (
            <div data-testid="loading-payment-methods">Loading payment methods...</div>
          ) : paymentMethods && paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-md"
                  data-testid={`card-payment-method-${method.id}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8" />
                    <div>
                      <p className="font-medium" data-testid={`text-card-brand-${method.id}`}>
                        {method.brand?.toUpperCase() || method.type} •••• {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                    {method.isDefault && (
                      <Badge data-testid={`badge-default-${method.id}`}>Default</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultMutation.mutate(method.id)}
                        data-testid={`button-set-default-${method.id}`}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMutation.mutate(method.id)}
                      data-testid={`button-remove-card-${method.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8" data-testid="text-no-payment-methods">
              No payment methods added yet
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          {billingHistory && billingHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingHistory.map((record) => (
                  <TableRow key={record.id} data-testid={`row-billing-${record.id}`}>
                    <TableCell data-testid={`text-billing-date-${record.id}`}>
                      {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell data-testid={`text-billing-amount-${record.id}`}>
                      ${(record.amount / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.status === "paid" ? "default" : "secondary"} data-testid={`badge-billing-status-${record.id}`}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {record.invoiceUrl && (
                        <a
                          href={record.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                          data-testid={`link-invoice-${record.id}`}
                        >
                          View Invoice
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8" data-testid="text-no-billing-history">
              No billing history yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AddCardForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    if (setupIntent?.payment_method) {
      try {
        await apiRequest("POST", "/api/payment-methods", {
          paymentMethodId: setupIntent.payment_method,
        });

        queryClient.invalidateQueries({ queryKey: ["/api/payment-methods"] });
        toast({
          title: "Success",
          description: "Payment method added successfully",
        });
        onSuccess();
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || isProcessing} className="w-full" data-testid="button-confirm-add-card">
        {isProcessing ? "Processing..." : "Add Card"}
      </Button>
    </form>
  );
}

interface NotificationPrefs {
  emailNotifications?: boolean;
  invoiceAlerts?: boolean;
  seasonalAlerts?: boolean;
  teamUpdates?: boolean;
  billingAlerts?: boolean;
}

interface SecurityPrefs {
  twoFactorEnabled?: boolean;
  recoveryEmail?: string | null;
  sessionTimeout?: number;
}

function NotificationSettings() {
  const { toast } = useToast();

  const { data: preferences, isLoading } = useQuery<NotificationPrefs>({
    queryKey: ["/api/notification-preferences"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", "/api/notification-preferences", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notification-preferences"] });
      toast({
        title: "Preferences Updated",
        description: "Notification preferences have been updated",
      });
    },
  });

  const toggleSetting = (key: string, value: boolean) => {
    updateMutation.mutate({ [key]: value });
  };

  if (isLoading) {
    return <div data-testid="loading-notifications">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-muted-foreground">Receive general email notifications</p>
          </div>
          <Switch
            checked={preferences?.emailNotifications ?? true}
            onCheckedChange={(checked) => toggleSetting("emailNotifications", checked)}
            data-testid="switch-email-notifications"
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Invoice Alerts</p>
            <p className="text-sm text-muted-foreground">Get notified about new invoices</p>
          </div>
          <Switch
            checked={preferences?.invoiceAlerts ?? true}
            onCheckedChange={(checked) => toggleSetting("invoiceAlerts", checked)}
            data-testid="switch-invoice-alerts"
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Seasonal Alerts</p>
            <p className="text-sm text-muted-foreground">Alerts for seasonal and festival items</p>
          </div>
          <Switch
            checked={preferences?.seasonalAlerts ?? true}
            onCheckedChange={(checked) => toggleSetting("seasonalAlerts", checked)}
            data-testid="switch-seasonal-alerts"
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Team Updates</p>
            <p className="text-sm text-muted-foreground">Notifications about team changes</p>
          </div>
          <Switch
            checked={preferences?.teamUpdates ?? true}
            onCheckedChange={(checked) => toggleSetting("teamUpdates", checked)}
            data-testid="switch-team-updates"
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Billing Alerts</p>
            <p className="text-sm text-muted-foreground">Payment and billing notifications</p>
          </div>
          <Switch
            checked={preferences?.billingAlerts ?? true}
            onCheckedChange={(checked) => toggleSetting("billingAlerts", checked)}
            data-testid="switch-billing-alerts"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SecuritySettings() {
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<SecurityPrefs>({
    queryKey: ["/api/security-settings"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PATCH", "/api/security-settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security-settings"] });
      toast({
        title: "Settings Updated",
        description: "Security settings have been updated",
      });
    },
  });

  if (isLoading) {
    return <div data-testid="loading-security">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={settings?.twoFactorEnabled ?? false}
              onCheckedChange={(checked) => updateMutation.mutate({ twoFactorEnabled: checked })}
              data-testid="switch-2fa"
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="recovery-email">Recovery Email</Label>
            <div className="flex gap-2">
              <Input
                id="recovery-email"
                type="email"
                placeholder="recovery@example.com"
                defaultValue={settings?.recoveryEmail || ""}
                data-testid="input-recovery-email"
              />
              <Button
                onClick={(e) => {
                  const input = document.getElementById("recovery-email") as HTMLInputElement;
                  updateMutation.mutate({ recoveryEmail: input.value });
                }}
                data-testid="button-save-recovery-email"
              >
                Save
              </Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Select
              value={String(settings?.sessionTimeout || 30)}
              onValueChange={(value) => updateMutation.mutate({ sessionTimeout: parseInt(value) })}
            >
              <SelectTrigger id="session-timeout" data-testid="select-session-timeout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
