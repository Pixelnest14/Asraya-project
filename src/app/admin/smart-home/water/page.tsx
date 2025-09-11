
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Droplets, AlertTriangle, AreaChart } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, CartesianGrid, XAxis, AreaChart as RechartsAreaChart } from "recharts";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Block A",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Block B",
    color: "hsl(var(--accent))",
  },
}

export default function SmartWaterPage() {
    return (
        <>
            <PageHeader
                title="Smart Water Meter"
                description="Track water usage and monitor the system for leaks."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Consumption (Today)</CardTitle>
                        <Droplets className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,500 L</div>
                        <p className="text-xs text-muted-foreground">+5% from yesterday</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">Normal</div>
                        <p className="text-xs text-muted-foreground">No leaks detected</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
                        <AreaChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">350,000 L</div>
                        <p className="text-xs text-muted-foreground">Average for this year</p>
                    </CardContent>
                </Card>
            </div>
             <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Water Consumption Trends</CardTitle>
                        <CardDescription>Monthly usage across different blocks.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                             <RechartsAreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                                >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <Area
                                    dataKey="mobile"
                                    type="natural"
                                    fill="var(--color-mobile)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-mobile)"
                                    stackId="a"
                                />
                                <Area
                                    dataKey="desktop"
                                    type="natural"
                                    fill="var(--color-desktop)"
                                    fillOpacity={0.4}
                                    stroke="var(--color-desktop)"
                                    stackId="a"
                                />
                            </RechartsAreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
