import { Badge } from "@/components/ui/badge";
import { Snowflake, Sun, Leaf, CloudRain, PartyPopper, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export type SeasonType = "winter" | "spring" | "summer" | "fall" | "festival" | "year-round";

interface SeasonConfig {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
}

const seasonConfig: Record<SeasonType, SeasonConfig> = {
  winter: {
    icon: Snowflake,
    label: "Winter",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/30",
  },
  spring: {
    icon: Leaf,
    label: "Spring",
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-500/20 border-green-300 dark:border-green-500/30",
  },
  summer: {
    icon: Sun,
    label: "Summer",
    color: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-500/20 border-yellow-300 dark:border-yellow-500/30",
  },
  fall: {
    icon: CloudRain,
    label: "Fall",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-500/20 border-orange-300 dark:border-orange-500/30",
  },
  festival: {
    icon: PartyPopper,
    label: "Festival",
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/30",
  },
  "year-round": {
    icon: Calendar,
    label: "Year-round",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50 border-muted",
  },
};

interface SeasonalBadgeProps {
  season: SeasonType;
  festivalName?: string;
  size?: "sm" | "md" | "lg";
}

export default function SeasonalBadge({ season, festivalName, size = "md" }: SeasonalBadgeProps) {
  const config = seasonConfig[season];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <Badge 
      className={cn(
        config.bgColor,
        config.color,
        sizeClasses[size],
        "font-medium"
      )}
      data-testid={`badge-season-${season}`}
    >
      <Icon className={cn(
        "mr-1",
        size === "sm" ? "w-3 h-3" : size === "md" ? "w-3.5 h-3.5" : "w-4 h-4"
      )} />
      {season === "festival" && festivalName ? festivalName : config.label}
    </Badge>
  );
}
