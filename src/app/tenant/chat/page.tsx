
"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFirebase } from "@/components/firebase-provider";
import { collection, onSnapshot, query, addDoc, Timestamp, orderBy } from "firebase/firestore";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  text: string;
  senderId: string; // 'admin' or resident's user ID
  timestamp: Timestamp;
};

export default function TenantChatPage() {
  const { db, user, isLoading: isAuthLoading } = useFirebase();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthLoading || !db || !user) {
        setIsLoading(false);
        return;
    };

    setIsLoading(true);
    // In the admin panel, the chat ID is hardcoded for demo purposes. 
    // Here we use a hardcoded resident ID that matches one in the admin panel's list.
    const residentIdForChat = "user-a-101";
    const chatId = `chat_${residentIdForChat}`;
    
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
  }, [db, user, isAuthLoading]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: "smooth"
        });
    }
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !db || !user) return;
    
    // In the admin panel, the chat ID is hardcoded for demo purposes. 
    // Here we use a hardcoded resident ID that matches one in the admin panel's list.
    const residentIdForChat = "user-a-101";
    const chatId = `chat_${residentIdForChat}`;
    const messagesCollection = collection(db, "chats", chatId, "messages");
    
    try {
      await addDoc(messagesCollection, {
        text: newMessage,
        senderId: user.uid, // This distinguishes tenant messages from admin
        timestamp: Timestamp.now(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <PageHeader
        title="Chat with Admin"
        description="Directly communicate with the society administration."
      />
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback><Bot /></AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">Society Admin</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Online
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4 md:p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-full"><LoaderCircle className="animate-spin" /></div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={cn("flex items-start gap-3", msg.senderId !== 'admin' ? "justify-end" : "")}>
                    {msg.senderId === 'admin' && (
                      <Avatar>
                        <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("rounded-lg px-4 py-2 max-w-xs lg:max-w-md", msg.senderId !== 'admin' ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    {msg.senderId !== 'admin' && (
                      <Avatar>
                        <AvatarFallback><User /></AvatarFallback>
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
              disabled={isAuthLoading || isLoading}
            />
            <Button type="submit" size="icon" disabled={isAuthLoading || isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
