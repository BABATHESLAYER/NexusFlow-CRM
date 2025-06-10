"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BotIcon, UserIcon, Loader2Icon } from "lucide-react";
import { getCrmAssistance, type CrmAssistanceInput } from "@/ai/flows/crm-assistant";

const chatSchema = z.object({
  query: z.string().min(1, "Message cannot be empty"),
});

type ChatFormValues = z.infer<typeof chatSchema>;

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export function CrmAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatFormValues>({
    resolver: zodResolver(chatSchema),
  });

  const onSubmit: SubmitHandler<ChatFormValues> = async (data) => {
    const userInput: CrmAssistanceInput = { query: data.query };
    const userMessage: Message = { id: Date.now().toString(), sender: "user", text: data.query };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    reset();

    try {
      const result = await getCrmAssistance(userInput);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), sender: "ai", text: result.response };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error getting AI assistance:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BotIcon className="h-6 w-6 text-primary" />
          CRM Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "ai" && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <BotIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-lg p-3 text-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.text}
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                     <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <UserIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <BotIcon className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                <div className="max-w-[75%] rounded-lg p-3 text-sm bg-muted">
                  <Loader2Icon className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full gap-2">
          <Input
            {...register("query")}
            placeholder="Ask for CRM tips or help..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </form>
        {errors.query && <p className="text-xs text-destructive mt-1">{errors.query.message}</p>}
      </CardFooter>
    </Card>
  );
}
