import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Lightbulb, Thermometer, ShieldCheck, Speaker } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function SmartHomePage() {
  return (
    <>
      <PageHeader
        title="My Smart Home"
        description="Control your home's smart devices from anywhere."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Lightbulb className="h-6 w-6 text-yellow-400" />
                    <CardTitle className="text-lg">Living Room Lights</CardTitle>
                </div>
                <Switch defaultChecked />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Brightness</label>
                    <Slider defaultValue={[75]} max={100} step={1} />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Thermometer className="h-6 w-6 text-red-500" />
                    <CardTitle className="text-lg">Air Conditioner</CardTitle>
                </div>
                <Switch />
            </CardHeader>
            <CardContent>
                 <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Temperature</label>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon">-</Button>
                        <span className="text-2xl font-bold">24°C</span>
                        <Button variant="outline" size="icon">+</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-green-500" />
                    <CardTitle className="text-lg">Main Door Lock</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <Button className="w-full" variant="secondary">Lock / Unlock</Button>
            </CardContent>
        </Card>
        
         <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <Speaker className="h-6 w-6 text-blue-500" />
                    <CardTitle className="text-lg">Smart Speaker</CardTitle>
                </div>
                <Switch defaultChecked />
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Volume</label>
                    <Slider defaultValue={[40]} max={100} step={1} />
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
