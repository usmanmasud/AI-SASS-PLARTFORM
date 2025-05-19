"use client";

import React, { useState } from "react";
import { Heading } from "@/components/Heading"; // Custom Heading component
import { Music2 } from "lucide-react"; // Music icon
import { useForm } from "react-hook-form"; // React Hook Form for handling forms
import { z } from "zod"; // Zod validation
import { formSchema } from "./constants"; // Schema for form validation
import { zodResolver } from "@hookform/resolvers/zod"; // Zod resolver for React Hook Form
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"; // Custom form components
import { Input } from "@/components/ui/input"; // Custom Input component
import { Button } from "@/components/ui/button"; // Custom Button component
import axios from "axios"; // Axios for making HTTP requests
import { useRouter } from 'next/navigation'; // Next.js router for navigation
import { Loader2 } from "lucide-react"; // Loading icon
import { UserAvatar } from "@/components/UserAvatar"; // Avatar for user
import { BotAvatar } from "@/components/BotAvatar"; // Avatar for AI

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const Music = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // State for the audio URL

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user's message to the chat history
      const userMessage: ChatMessage = {
        role: "user",
        content: values.prompt,
      };

      setMessages(prev => [...prev, userMessage]);

      // Send the prompt to the backend for music generation
      const response = await axios.post("/api/music", {
        prompt: values.prompt,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      // Add assistant's message to the chat history
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: "Here is the music based on your prompt.",
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Set the audio URL returned from the backend
      if (response.data.audio) {
        setAudioUrl(response.data.audio); // Assuming audio URL is returned from the API
      }

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
    <div>
      <Heading
        title="Music Generation"
        description="Powered by AI"
        icon={Music2}
        iconColor="text-emrald-500"
        bgColor="bg-emrald-500/10"
      />
      <div className="px-4 lg:px-8">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600">
            {error}
          </div>
        )}

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
                      placeholder="What type of music would you like to generate?"
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

        <div className="space-y-4 mt-4">
          <div className="flex flex-col-reverse gap-y-4">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Your music will appear here
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
                      {message.role === "user" ? "You" : "AI"}
                    </p>
                    <p className="mt-1">{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {audioUrl && (
          <div className="mt-4">
            <audio controls>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
};

export default Music;
