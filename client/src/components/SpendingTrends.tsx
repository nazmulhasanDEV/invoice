import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jul", amount: 8500 },
  { month: "Aug", amount: 9200 },
  { month: "Sep", amount: 8800 },
  { month: "Oct", amount: 10500 },
  { month: "Nov", amount: 11200 },
  { month: "Dec", amount: 12458 },
];

export default function SpendingTrends() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Spending Trends</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(239, 84%, 67%)" />
                <stop offset="100%" stopColor="hsl(271, 91%, 65%)" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spent']}
            />
            <Bar dataKey="amount" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
