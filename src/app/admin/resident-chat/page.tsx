
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFirebase } from "@/components/firebase-provider";
import { collection, doc, onSnapshot, query, addDoc, Timestamp, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";

type Resident = {
  id: string;
  name: string;
  flat: string;
};

type Message = {
  id: string;
  text: string;
  senderId: string; // 'admin' or resident's user ID
  timestamp: Timestamp;
};

const residents: Resident[] = [
  { id: "user-a-101", name: "Mr. Raj", flat: "A-101" },
  { id: "user-a-102", name: "Mrs. Devi", flat: "A-102" },
  { id: "user-b-202", name: "Ms. Priya", flat: "B-202" },
];

export default function ResidentChatPage() {
  const { db } = useFirebase();
  const [selectedResident, setSelectedResident] = useState<Resident>(residents[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db || !selectedResident) return;

    setIsLoading(true);
    const chatId = `chat_${selectedResident.id}`;
    const messagesCollection = collection(db, "chats", chatId, "messages");
    const q = query(messagesCollection, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, selectedResident]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !db || !selectedResident) return;
    
    const chatId = `chat_${selectedResident.id}`;
    const messagesCollection = collection(db, "chats", chatId, "messages");
    
    try {
      await addDoc(messagesCollection, {
        text: newMessage,
        senderId: "admin",
        timestamp: Timestamp.now(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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
                {residents.map(resident => (
                    <Button 
                        key={resident.id} 
                        variant={selectedResident.id === resident.id ? "secondary" : "ghost"}
                        className="w-full justify-start gap-3 h-12"
                        onClick={() => setSelectedResident(resident)}
                    >
                        <Avatar>
                            <AvatarFallback>{resident.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{`${resident.flat} (${resident.name})`}</span>
                    </Button>
                ))}
            </div>
          </ScrollArea>
        </div>
        <div className="w-2/3 flex flex-col">
            <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback>{selectedResident.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{`${selectedResident.flat} (${selectedResident.name})`}</p>
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
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin" /></div>
                        ) : (
                            messages.map(msg => (
                                <div key={msg.id} className={cn("flex items-start gap-3", msg.senderId === 'admin' ? "justify-end" : "")}>
                                    {msg.senderId !== 'admin' && (
                                        <Avatar>
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("rounded-lg px-4 py-2 max-w-xs lg:max-w-md", msg.senderId === 'admin' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                     {msg.senderId === 'admin' && (
                                        <Avatar>
                                            <AvatarFallback><Bot /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t pt-6">
                <form className="flex w-full items-center space-x-2" onSubmit={handleSendMessage}>
                    <Input
                        id="message"
                        placeholder="Type your message..."
                        className="flex-1"
                        autoComplete="off"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
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
