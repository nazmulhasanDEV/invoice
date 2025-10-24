import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  icon: React.ElementType;
  features: string[];
  recommended?: boolean;
  cta: string;
}

const plans: PricingPlan[] = [
  {
    name: "Starter",
    description: "Perfect for individuals and freelancers",
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Sparkles,
    features: [
      "Up to 50 invoices per month",
      "AI-powered data extraction",
      "Basic categorization",
      "7-day data retention",
      "Email support",
      "Export to CSV",
    ],
    cta: "Start Free",
  },
  {
    name: "Professional",
    description: "For growing businesses and teams",
    monthlyPrice: 29,
    annualPrice: 290,
    icon: Zap,
    recommended: true,
    features: [
      "Unlimited invoices",
      "Advanced AI extraction",
      "Custom categories & aliases",
      "Unlimited data retention",
      "Priority support",
      "Team collaboration (up to 5 members)",
      "Price trend analysis",
      "Seasonal insights",
      "Export to Excel & PDF",
      "API access",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    monthlyPrice: 99,
    annualPrice: 990,
    icon: Building2,
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Advanced analytics & reporting",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom AI model training",
      "Advanced security features",
      "SSO/SAML authentication",
      "Priority phone support",
    ],
    cta: "Contact Sales",
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const calculateSavings = (monthlyPrice: number, annualPrice: number) => {
    if (monthlyPrice === 0) return 0;
    const monthlyCost = monthlyPrice * 12;
    return Math.round(((monthlyCost - annualPrice) / monthlyCost) * 100);
  };

  return (
    <section className="py-24 bg-background relative overflow-hidden" id="pricing">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free, upgrade as you grow. All plans include our core AI-powered features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={!isAnnual ? "text-foreground font-medium" : "text-muted-foreground"}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              data-testid="switch-billing-toggle"
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? "text-foreground font-medium" : "text-muted-foreground"}>
              Annual
            </Label>
            {isAnnual && (
              <Badge variant="default" className="ml-2 bg-gradient-to-r from-chart-1 to-chart-2">
                Save up to 17%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const displayPrice = isAnnual ? (plan.annualPrice / 12).toFixed(0) : plan.monthlyPrice;
            const savings = calculateSavings(plan.monthlyPrice, plan.annualPrice);

            return (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.recommended
                    ? "border-2 border-primary shadow-xl scale-105"
                    : "border-border"
                }`}
                data-testid={`card-plan-${plan.name.toLowerCase()}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-chart-1 to-chart-2 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-8 pt-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-6">
                  {/* Price Display */}
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold">${displayPrice}</span>
                      <span className="text-muted-foreground">
                        {plan.monthlyPrice === 0 ? "free" : "/month"}
                      </span>
                    </div>
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-muted-foreground">
                        ${plan.annualPrice} billed annually ({savings}% off)
                      </p>
                    )}
                    {!isAnnual && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Billed monthly
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-chart-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6">
                  <Button
                    className={`w-full ${
                      plan.recommended
                        ? "bg-gradient-to-r from-chart-1 to-chart-2"
                        : ""
                    }`}
                    variant={plan.recommended ? "default" : "outline"}
                    data-testid={`button-cta-${plan.name.toLowerCase()}`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground">
            Need a custom plan?{" "}
            <a href="#contact" className="text-primary hover-elevate" data-testid="link-contact-sales">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
