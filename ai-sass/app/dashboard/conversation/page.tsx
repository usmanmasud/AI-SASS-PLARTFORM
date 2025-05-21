"use client";

import React, { useState, useRef, useEffect } from "react";
import { Heading } from "@/components/Heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import { BotAvatar } from "@/components/BotAvatar";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const Conversation = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userMessage: ChatMessage = {
        role: "user",
        content: values.prompt,
      };

      setMessages(prev => [...prev, userMessage]);

      const response = await axios.post("/api/conversation", {
        message: values.prompt,
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.data.message,
      };

      setMessages(prev => [...prev, assistantMessage]);
      form.reset();

    } catch (error: any) {
      let errorMessage = "Failed to get response";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response) {
        errorMessage = `Error: ${error.response.status}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="px-4 lg:px-8">
        <Heading
          title="Conversation"
          description="Powered by Google Gemini AI"
          icon={MessageSquare}
          iconColor="text-violet-500"
          bgColor="bg-violet-500/10"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 lg:px-8">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-4 mt-4 pb-4">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Your conversation will appear here
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 p-4 rounded-lg ${
                  message.role === "user" 
                    ? "bg-gray-50 border border-gray-200" 
                    : "bg-violet-50 border border-violet-200"
                }`}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <div>
                  <p className="font-semibold">
                    {message.role === "user" ? "You" : "Genius AI"}
                  </p>
                  <p className="mt-1">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t p-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg w-full p-4 border px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      {...field}
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                      disabled={isLoading}
                      placeholder="How do I calculate the radius of a circle?"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Conversation;