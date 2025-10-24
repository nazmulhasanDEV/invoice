import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Clock, TrendingUp, Calendar, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeasonalAlertData {
  type: "upcoming" | "active" | "ending";
  season: string;
  daysUntil?: number;
  daysRemaining?: number;
  festivalName?: string;
  festivalDate?: string;
  recommendation: string;
  priceIncrease?: number;
}

const mockAlerts: SeasonalAlertData[] = [
  {
    type: "upcoming",
    season: "festival",
    festivalName: "Christmas",
    festivalDate: "Dec 25",
    daysUntil: 15,
    recommendation: "Stock up on festive items now. Prices typically increase 20-30% closer to the holiday.",
    priceIncrease: 25,
  },
  {
    type: "active",
    season: "winter",
    daysRemaining: 45,
    recommendation: "Winter produce at peak availability. Best time to purchase seasonal vegetables.",
  },
  {
    type: "upcoming",
    season: "festival",
    festivalName: "New Year",
    festivalDate: "Jan 1",
    daysUntil: 22,
    recommendation: "Party supplies and ingredients for New Year celebrations typically see higher demand.",
    priceIncrease: 15,
  },
];

export default function SeasonalAlert() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-chart-3" />
        <h3 className="text-lg font-semibold">Seasonal Alerts & Recommendations</h3>
      </div>

      <div className="space-y-3">
        {mockAlerts.map((alert, index) => (
          <Alert 
            key={index}
            className={cn(
              "border-l-4",
              alert.type === "upcoming" && "border-l-chart-3 bg-chart-3/5",
              alert.type === "active" && "border-l-chart-4 bg-chart-4/5",
              alert.type === "ending" && "border-l-destructive bg-destructive/5"
            )}
            data-testid={`alert-${index}`}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0",
                alert.type === "upcoming" && "bg-chart-3/20",
                alert.type === "active" && "bg-chart-4/20",
                alert.type === "ending" && "bg-destructive/20"
              )}>
                {alert.season === "festival" ? (
                  <PartyPopper className={cn(
                    "w-5 h-5",
                    alert.type === "upcoming" && "text-chart-3",
                    alert.type === "active" && "text-chart-4"
                  )} />
                ) : (
                  <Calendar className={cn(
                    "w-5 h-5",
                    alert.type === "upcoming" && "text-chart-3",
                    alert.type === "active" && "text-chart-4",
                    alert.type === "ending" && "text-destructive"
                  )} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {alert.type === "upcoming" && (
                    <Badge className="bg-chart-3 text-background">
                      <Clock className="w-3 h-3 mr-1" />
                      {alert.daysUntil} days until {alert.festivalName || alert.season}
                    </Badge>
                  )}
                  {alert.type === "active" && (
                    <Badge className="bg-chart-4 text-background">
                      Active Season
                    </Badge>
                  )}
                  {alert.festivalName && (
                    <span className="font-semibold">{alert.festivalName} ({alert.festivalDate})</span>
                  )}
                </div>

                <AlertDescription className="text-sm text-foreground mb-3">
                  {alert.recommendation}
                </AlertDescription>

                {alert.priceIncrease && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="w-3.5 h-3.5 text-chart-4" />
                    <span>Expected price increase: <span className="font-semibold text-chart-4">+{alert.priceIncrease}%</span></span>
                  </div>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </div>

      <Card className="p-4 bg-gradient-to-r from-chart-1/10 to-chart-2/10 border-chart-1/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">Enable Smart Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Get alerts 2 weeks before seasonal peaks and festival dates to optimize your purchasing decisions.
            </p>
          </div>
          <Button variant="default" data-testid="button-enable-notifications">
            Enable
          </Button>
        </div>
      </Card>
    </div>
  );
}
