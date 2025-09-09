import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ResidentChatPage() {
  return (
    <>
      <PageHeader
        title="Resident Chat"
        description="Communicate directly with residents."
      />
      <Card className="h-[calc(100vh-10rem)] flex">
        <div className="w-1/3 border-r">
          <CardHeader>
            <Input placeholder="Search residents..." />
          </CardHeader>
          <ScrollArea className="h-full px-2">
            <div className="space-y-1">
                {['A-101 (Mr. Raj)', 'A-102 (Mrs. Devi)', 'B-202 (Ms. Priya)'].map(resident => (
                    <Button key={resident} variant="ghost" className="w-full justify-start gap-3 h-12">
                        <Avatar>
                            <AvatarFallback>{resident.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{resident}</span>
                    </Button>
                ))}
            </div>
          </ScrollArea>
        </div>
        <div className="w-2/3 flex flex-col">
            <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">A-101 (Mr. Raj)</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                            Online
                        </p>
                    </div>
                </div>
            </CardHeader>
             <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4 md:p-6">
                    <div className="space-y-6">
                        {/* Chat messages would go here */}
                         <div className="flex items-start gap-3 justify-end">
                            <div className="rounded-lg px-4 py-2 max-w-xs lg:max-w-md bg-primary text-primary-foreground">
                                <p className="text-sm">Hello, I have a question about the guest parking policy.</p>
                            </div>
                            <Avatar>
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <form className="flex w-full items-center space-x-2">
                    <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex-1"
                        autoComplete="off"
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </div>
      </Card>
    </>
  );
}
