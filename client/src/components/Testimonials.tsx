import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Shield, Zap, TrendingUp } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Finance Manager",
    company: "TechCorp Inc.",
    quote: "InvoiceAI has transformed how we handle expense tracking. The AI extraction is incredibly accurate, saving us 10+ hours per week.",
    initials: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Small Business Owner",
    company: "Chen's Restaurant",
    quote: "As a restaurant owner, tracking ingredient costs was a nightmare. Now I can see price trends instantly and negotiate better deals with suppliers.",
    initials: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Procurement Director",
    company: "Global Retail Group",
    quote: "The seasonal insights feature helped us identify purchasing patterns we never knew existed. We've reduced costs by 18% in six months.",
    initials: "ER",
  },
];

const trustBadges = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption",
  },
  {
    icon: Zap,
    title: "AI-Powered",
    description: "99% accuracy rate",
  },
  {
    icon: TrendingUp,
    title: "Proven Results",
    description: "10x faster processing",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{badge.title}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
              </div>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have streamlined their invoice management
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-testimonial-${index}`}>
              <CardContent className="pt-6">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-chart-1 to-chart-2 text-white">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Counter */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent mb-2">
              10,000+
            </div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent mb-2">
              500K+
            </div>
            <div className="text-sm text-muted-foreground">Invoices Processed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent mb-2">
              $2M+
            </div>
            <div className="text-sm text-muted-foreground">Savings Generated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent mb-2">
              98%
            </div>
            <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}
