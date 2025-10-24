import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const mockData = [
  { date: "Jan", price: 2.2 },
  { date: "Feb", price: 2.5 },
  { date: "Mar", price: 2.8 },
  { date: "Apr", price: 2.4 },
  { date: "May", price: 2.6 },
  { date: "Jun", price: 2.9 },
  { date: "Jul", price: 2.7 },
  { date: "Aug", price: 2.5 },
  { date: "Sep", price: 2.3 },
  { date: "Oct", price: 2.6 },
  { date: "Nov", price: 2.8 },
  { date: "Dec", price: 3.0 },
];

interface PriceChartProps {
  title?: string;
  data?: typeof mockData;
}

export default function PriceChart({ title = "Price Fluctuation Over Time", data = mockData }: PriceChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(271, 91%, 65%)" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(187, 92%, 69%)"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
