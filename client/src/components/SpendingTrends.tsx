import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockInvoices } from "@/lib/mockData";
import { useMemo } from "react";

export default function SpendingTrends() {
  const chartData = useMemo(() => {
    const monthlyData = new Map<string, number>();

    mockInvoices.forEach(invoice => {
      const date = new Date(invoice.invoiceDate);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + invoice.totalAmount);
    });

    return Array.from(monthlyData.entries())
      .map(([month, amount]) => ({
        month,
        amount: amount / 100,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Month-over-Month Cost Analysis</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Track your total food costs over time to identify spending trends
      </p>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
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
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Cost']}
            />
            <Bar dataKey="amount" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
