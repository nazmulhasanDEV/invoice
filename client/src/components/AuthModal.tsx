import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, User, Building2, Zap, Shield, CheckCircle2, ArrowRight } from "lucide-react";
import { SiGoogle, SiGithub } from "react-icons/si";
import { useLocation } from "wouter";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"individual" | "company">("individual");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateLogin = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "Full name is required";
    if (!email) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (accountType === "company") {
      if (!companyName) newErrors.companyName = "Company name is required";
      if (!companySize) newErrors.companySize = "Please select company size";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin()) {
      console.log("Login:", { email, password });
      onOpenChange(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegister()) {
      console.log("Register:", { 
        accountType, 
        name, 
        email, 
        password,
        ...(accountType === "company" && { companyName, companySize })
      });
      onOpenChange(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    onOpenChange(false);
  };

  const handleDemoAccess = () => {
    setLocation("/dashboard");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-primary via-primary/90 to-accent p-6 sm:p-8 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-bold text-white">InvoiceAI</DialogTitle>
                <p className="text-white/80 text-sm">Intelligent Invoice Management</p>
              </div>
            </div>
            <DialogDescription className="text-white/90 text-base">
              Enterprise-grade invoice analytics powered by AI. Track spending, identify patterns, and optimize costs.
            </DialogDescription>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8">
            {/* Demo Mode Alert */}
            <Alert className="mb-6 bg-accent/10 border-accent/30">
            <Zap className="w-4 h-4 text-accent" />
            <AlertDescription className="text-sm">
              <span className="font-semibold">No login required!</span> Try our full-featured demo instantly—no credit card, no commitment.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleDemoAccess}
            className="w-full mb-6 bg-gradient-to-r from-primary to-accent h-12 text-base font-semibold"
            data-testid="button-demo-access"
          >
            <Zap className="w-5 h-5 mr-2" />
            Explore Demo Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">Or create an account</span>
            </div>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" data-testid="tab-login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Get Started
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("Google")}
                  data-testid="button-login-google"
                  className="h-11"
                >
                  <SiGoogle className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("GitHub")}
                  data-testid="button-login-github"
                  className="h-11"
                >
                  <SiGithub className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">Or with email</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email Address</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-login-email"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <button type="button" className="text-xs text-primary hover-elevate px-0">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-login-password"
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-accent h-11"
                  data-testid="button-login-submit"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Sign In Securely
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              {/* Social Registration Options */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("Google")}
                  data-testid="button-register-google"
                  className="h-11"
                >
                  <SiGoogle className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("GitHub")}
                  data-testid="button-register-github"
                  className="h-11"
                >
                  <SiGithub className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">Or with email</span>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-3">
                  <Label>Account Type</Label>
                  <RadioGroup 
                    value={accountType} 
                    onValueChange={(value) => setAccountType(value as "individual" | "company")}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div>
                      <RadioGroupItem
                        value="individual"
                        id="individual"
                        className="peer sr-only"
                        data-testid="radio-individual"
                      />
                      <Label
                        htmlFor="individual"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover-elevate peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <User className="mb-2 h-6 w-6" />
                        <span className="text-sm font-medium">Individual</span>
                        <span className="text-xs text-muted-foreground mt-1">Personal use</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="company"
                        id="company"
                        className="peer sr-only"
                        data-testid="radio-company"
                      />
                      <Label
                        htmlFor="company"
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover-elevate peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                      >
                        <Building2 className="mb-2 h-6 w-6" />
                        <span className="text-sm font-medium">Company</span>
                        <span className="text-xs text-muted-foreground mt-1">Team access</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {accountType === "company" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input
                        id="company-name"
                        type="text"
                        placeholder="Acme Corporation"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        data-testid="input-company-name"
                        className={errors.companyName ? "border-destructive" : ""}
                      />
                      {errors.companyName && <p className="text-sm text-destructive">{errors.companyName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-size">Company Size</Label>
                      <Select value={companySize} onValueChange={setCompanySize}>
                        <SelectTrigger id="company-size" data-testid="select-company-size" className={errors.companySize ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="500+">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.companySize && <p className="text-sm text-destructive">{errors.companySize}</p>}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="register-name">{accountType === "company" ? "Your Full Name" : "Full Name"}</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="input-register-name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">{accountType === "company" ? "Work Email" : "Email Address"}</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder={accountType === "company" ? "you@company.com" : "you@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-register-email"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-register-password"
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm">Confirm Password</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    data-testid="input-register-confirm"
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-accent h-11"
                  data-testid="button-register-submit"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Create Account
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </TabsContent>
          </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
