import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { User, Settings as SettingsIcon, Users, CreditCard, Bell, Shield, Plus, Trash2, Mail, Phone, Briefcase, Building, Globe, Clock, Download, Key, Monitor, AlertTriangle, CheckCircle2, XCircle, Edit, MoreVertical, UserPlus, Activity, TrendingUp, BarChart3, FileText, Copy, Send, Calendar } from "lucide-react";
import { ROLES, type User as UserType, type TeamMember, type PaymentMethod, type BillingHistory } from "@shared/schema";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar activeItem="Settings" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div>
                <h2 className="text-xl font-semibold">Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
              </div>
            </div>
            <ThemeToggle />
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="p-8 max-w-6xl mx-auto">
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
          </main>
        </div>
      </div>
    </SidebarProvider>
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
    bio: "",
    jobTitle: "",
    company: "",
    phone: "",
    timezone: "",
    language: "",
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
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

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" data-testid="button-change-avatar">
                <User className="w-4 h-4 mr-2" />
                Change Avatar
              </Button>
              <p className="text-sm text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 2MB</p>
            </div>
          </div>

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="John Doe"
                  value={formData.fullName || user?.fullName || ""}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  data-testid="input-full-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-9"
                    value={formData.email || user?.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="pl-9"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="jobTitle"
                    placeholder="Financial Manager"
                    className="pl-9"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    data-testid="input-job-title"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Acme Inc."
                    className="pl-9"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    data-testid="input-company"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                  <SelectTrigger id="timezone" data-testid="select-timezone">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <SelectValue placeholder="Select timezone" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
                  <SelectTrigger id="language" data-testid="select-language">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <SelectValue placeholder="Select language" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a bit about yourself..."
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                data-testid="textarea-bio"
              />
              <p className="text-sm text-muted-foreground">Brief description for your profile</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" data-testid="button-delete-account">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
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
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<(TeamMember & { user?: UserType }) | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>(ROLES.MEMBER);
  const [teamName, setTeamName] = useState("");

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

  const updateTeamMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      return await apiRequest("PATCH", `/api/teams/${selectedTeamId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/teams"] });
      toast({
        title: "Team Updated",
        description: "Team information has been updated",
      });
    },
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
      setIsEditMemberDialogOpen(false);
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

  const copyInviteLink = (email: string) => {
    navigator.clipboard.writeText(`https://app.example.com/invite/${email}`);
    toast({
      title: "Link Copied",
      description: "Invitation link copied to clipboard",
    });
  };

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

  const rolePermissions = {
    [ROLES.OWNER]: ["Full access", "Manage team", "Billing", "Delete team"],
    [ROLES.ADMIN]: ["Upload invoices", "Manage categories", "Manage team members", "View analytics"],
    [ROLES.MEMBER]: ["Upload invoices", "View analytics", "Manage categories"],
    [ROLES.VIEWER]: ["View analytics", "View invoices"],
  };

  const activityLog = [
    { id: 1, user: "John Doe", action: "added a new invoice", time: "2 hours ago", icon: FileText },
    { id: 2, user: "Jane Smith", action: "updated team settings", time: "5 hours ago", icon: Settings },
    { id: 3, user: "Bob Johnson", action: "invited alice@example.com", time: "1 day ago", icon: UserPlus },
    { id: 4, user: "Sarah Williams", action: "changed role for Mike Brown", time: "2 days ago", icon: Edit },
    { id: 5, user: "John Doe", action: "uploaded 5 invoices", time: "3 days ago", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{members?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{invitations?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Pending Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">847</p>
                <p className="text-sm text-muted-foreground">Invoices Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Information</CardTitle>
          <CardDescription>Manage your team details and settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-xl">
                {teams[0]?.name?.substring(0, 2).toUpperCase() || 'T'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <div className="flex gap-2">
                <Input
                  id="team-name"
                  placeholder="Team name"
                  defaultValue={teams[0]?.name}
                  onChange={(e) => setTeamName(e.target.value)}
                  data-testid="input-team-name"
                />
                <Button
                  onClick={() => updateTeamMutation.mutate({ name: teamName })}
                  disabled={!teamName || updateTeamMutation.isPending}
                  data-testid="button-update-team"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Team ID</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input value={selectedTeamId || ''} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" onClick={() => {
                  navigator.clipboard.writeText(selectedTeamId || '');
                  toast({ title: "Copied", description: "Team ID copied to clipboard" });
                }}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>Created</Label>
              <Input 
                value={teams[0]?.createdAt ? new Date(teams[0].createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} 
                readOnly 
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>Understanding team member roles and their capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(rolePermissions).map(([role, permissions]) => (
              <div key={role} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={role === ROLES.OWNER ? "default" : "secondary"}>
                    {role}
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {permissions.map((permission, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>{permission}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team members and their roles</CardDescription>
          </div>
          <Button data-testid="button-invite-member" onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </CardHeader>
        <CardContent>
          {membersLoading ? (
            <div data-testid="loading-members">Loading members...</div>
          ) : members && members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} data-testid={`row-member-${member.id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {member.user?.username?.substring(0, 2).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium" data-testid={`text-member-name-${member.id}`}>
                            {member.user?.fullName || member.user?.username || 'Unknown'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.user?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.role === ROLES.OWNER ? "default" : "secondary"} data-testid={`badge-role-${member.id}`}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell data-testid={`text-joined-${member.id}`}>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {member.role !== ROLES.OWNER && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-member-menu-${member.id}`}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedMember(member);
                              setIsEditMemberDialogOpen(true);
                            }}>
                              <Edit className="w-4 h-4 mr-2" />
                              Change Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast({
                                title: "Member Details",
                                description: `${member.user?.email} - ${member.role}`,
                              });
                            }}>
                              <User className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => removeMemberMutation.mutate(member.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">No team members yet</p>
          )}
        </CardContent>
      </Card>

      {invitations && invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Invitations</CardTitle>
            <CardDescription>Invitations waiting to be accepted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border rounded-md"
                  data-testid={`invitation-${invitation.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{invitation.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {invitation.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Sent {invitation.createdAt ? new Date(invitation.createdAt).toLocaleDateString() : 'recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyInviteLink(invitation.email)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Invitation Resent",
                          description: `Invitation sent again to ${invitation.email}`,
                        });
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Resend
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Invitation Cancelled",
                          description: "Invitation has been cancelled",
                        });
                      }}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team Activity</CardTitle>
          <CardDescription>Recent actions performed by team members</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {activityLog.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                  <div className="p-2 bg-muted rounded-lg">
                    <activity.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>
                      {' '}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Activity className="w-4 h-4 mr-2" />
            View Full Activity Log
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Preferences</CardTitle>
          <CardDescription>Configure team-wide settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-categorize Invoices</p>
              <p className="text-sm text-muted-foreground">Automatically categorize uploaded invoices using AI</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Require Approval</p>
              <p className="text-sm text-muted-foreground">Members need admin approval for uploads</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Export Reports</p>
              <p className="text-sm text-muted-foreground">Allow members to export team reports</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
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
                  <SelectItem value={ROLES.VIEWER}>Viewer - Read-only access</SelectItem>
                  <SelectItem value={ROLES.MEMBER}>Member - Upload & manage invoices</SelectItem>
                  <SelectItem value={ROLES.ADMIN}>Admin - Full management access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => inviteMutation.mutate({ email: inviteEmail, role: inviteRole })}
              disabled={!inviteEmail || inviteMutation.isPending}
              data-testid="button-send-invite"
            >
              {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Member Role</DialogTitle>
            <DialogDescription>
              Update role for {selectedMember?.user?.fullName || selectedMember?.user?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-role">Select New Role</Label>
              <Select 
                defaultValue={selectedMember?.role}
                onValueChange={(value) => {
                  if (selectedMember) {
                    updateRoleMutation.mutate({ memberId: selectedMember.id, role: value });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ROLES.VIEWER}>Viewer - Read-only access</SelectItem>
                  <SelectItem value={ROLES.MEMBER}>Member - Upload & manage invoices</SelectItem>
                  <SelectItem value={ROLES.ADMIN}>Admin - Full management access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface NotificationPrefs {
  emailNotifications?: boolean;
  invoiceAlerts?: boolean;
  seasonalAlerts?: boolean;
  teamUpdates?: boolean;
  billingAlerts?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  productUpdates?: boolean;
  securityAlerts?: boolean;
  digestFrequency?: string;
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
      return response as { clientSecret?: string };
    },
    onSuccess: (data: { clientSecret?: string }) => {
      if (data.clientSecret) {
        setSetupIntentSecret(data.clientSecret);
      }
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
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Manage your subscription and billing preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 border rounded-md">
            <div>
              <h3 className="text-2xl font-bold">Professional Plan</h3>
              <p className="text-muted-foreground mt-1">Unlimited invoices and team members</p>
              <div className="flex items-center gap-4 mt-4">
                <Badge className="bg-green-600">Active</Badge>
                <span className="text-sm text-muted-foreground">Renews on Jan 1, 2026</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">$29</p>
              <p className="text-muted-foreground">per month</p>
              <Button variant="outline" className="mt-4">
                Change Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage & Limits</CardTitle>
          <CardDescription>Track your current usage against plan limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Invoices Processed</span>
              <span className="text-sm text-muted-foreground">247 / Unlimited</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/4"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Team Members</span>
              <span className="text-sm text-muted-foreground">5 / Unlimited</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/5"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Storage Used</span>
              <span className="text-sm text-muted-foreground">2.4 GB / 100 GB</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[2.4%]"></div>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <CardTitle>Billing Address</CardTitle>
          <CardDescription>Update your billing information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" placeholder="123 Main St" data-testid="input-address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="New York" data-testid="input-city" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input id="state" placeholder="NY" data-testid="input-state" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP / Postal Code</Label>
              <Input id="zip" placeholder="10001" data-testid="input-zip" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select>
                <SelectTrigger id="country" data-testid="select-country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vat">VAT Number (Optional)</Label>
              <Input id="vat" placeholder="EU123456789" data-testid="input-vat" />
            </div>
          </div>
          <Button className="mt-4" data-testid="button-save-billing-address">
            Save Billing Address
          </Button>
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>Configure which emails you want to receive</CardDescription>
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
              <p className="text-sm text-muted-foreground">Get notified about new invoices and uploads</p>
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
              <p className="text-sm text-muted-foreground">Notifications about team changes and activities</p>
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
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Product Updates</p>
              <p className="text-sm text-muted-foreground">News about new features and improvements</p>
            </div>
            <Switch
              checked={preferences?.productUpdates ?? false}
              onCheckedChange={(checked) => toggleSetting("productUpdates", checked)}
              data-testid="switch-product-updates"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>Manage browser and mobile push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Enable browser push notifications</p>
            </div>
            <Switch
              checked={preferences?.pushNotifications ?? false}
              onCheckedChange={(checked) => toggleSetting("pushNotifications", checked)}
              data-testid="switch-push-notifications"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Security Alerts</p>
              <p className="text-sm text-muted-foreground">Important security and account notifications</p>
            </div>
            <Switch
              checked={preferences?.securityAlerts ?? true}
              onCheckedChange={(checked) => toggleSetting("securityAlerts", checked)}
              data-testid="switch-security-alerts"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications</CardTitle>
          <CardDescription>Receive text message notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">SMS Notifications</p>
              <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
            </div>
            <Switch
              checked={preferences?.smsNotifications ?? false}
              onCheckedChange={(checked) => toggleSetting("smsNotifications", checked)}
              data-testid="switch-sms-notifications"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Schedule</CardTitle>
          <CardDescription>Control when and how often you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="digest-frequency">Email Digest Frequency</Label>
            <Select
              value={preferences?.digestFrequency || "immediate"}
              onValueChange={(value) => updateMutation.mutate({ digestFrequency: value })}
            >
              <SelectTrigger id="digest-frequency" data-testid="select-digest-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SecurityPrefs {
  twoFactorEnabled?: boolean;
  recoveryEmail?: string | null;
  sessionTimeout?: number;
}

interface LoginSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

function SecuritySettings() {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: settings, isLoading } = useQuery<SecurityPrefs>({
    queryKey: ["/api/security-settings"],
  });

  const mockSessions: LoginSession[] = [
    { id: "1", device: "Chrome on MacOS", location: "New York, US", lastActive: "Active now", current: true },
    { id: "2", device: "Safari on iPhone", location: "New York, US", lastActive: "2 hours ago", current: false },
    { id: "3", device: "Firefox on Windows", location: "Los Angeles, US", lastActive: "Yesterday", current: false },
  ];

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

  const changePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully",
    });
    setNewPassword("");
    setConfirmPassword("");
  };

  if (isLoading) {
    return <div data-testid="loading-security">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              data-testid="input-new-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              data-testid="input-confirm-password"
            />
          </div>
          <Button onClick={changePassword} data-testid="button-change-password">
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
            </div>
            <Switch
              checked={settings?.twoFactorEnabled ?? false}
              onCheckedChange={(checked) => updateMutation.mutate({ twoFactorEnabled: checked })}
              data-testid="switch-2fa"
            />
          </div>
          {settings?.twoFactorEnabled && (
            <div className="p-4 bg-muted rounded-md">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">2FA is enabled</p>
                  <p className="text-sm text-muted-foreground mt-1">Your account is protected with two-factor authentication</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recovery Options</CardTitle>
          <CardDescription>Set up account recovery options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout</Label>
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

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage devices where you're currently signed in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-md"
                data-testid={`session-${session.id}`}
              >
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.location} • {session.lastActive}
                    </p>
                  </div>
                  {session.current && <Badge variant="outline">Current</Badge>}
                </div>
                {!session.current && (
                  <Button variant="ghost" size="sm" data-testid={`button-revoke-${session.id}`}>
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" data-testid="button-revoke-all">
            Revoke All Other Sessions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage API keys for integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Production API Key</p>
                  <p className="text-sm text-muted-foreground font-mono">sk_live_••••••••••••1234</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" data-testid="button-create-api-key">
            <Plus className="w-4 h-4 mr-2" />
            Create New API Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Download your data or delete your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" data-testid="button-export-data">
            <Download className="w-4 h-4 mr-2" />
            Export All Data
          </Button>
          <p className="text-sm text-muted-foreground">
            Download a copy of all your data including invoices, categories, and team information
          </p>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" data-testid="button-delete-account-security">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Delete Account Permanently
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account, all team data, invoices, and remove all associated information from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                  Yes, Delete My Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
