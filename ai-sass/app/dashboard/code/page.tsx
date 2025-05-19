"use client";

import React, { useState, useEffect, useRef } from "react";
import { Heading } from "@/components/Heading";
import { CodeIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/UserAvatar";
import { BotAvatar } from "@/components/BotAvatar";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const Code = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

      const userMessage: ChatMessage = {
        role: "user",
        content: values.prompt,
      };

      setMessages((prev) => [...prev, userMessage]);

      const response = await axios.post(
        "/api/code",
        {
          contents: [
            {
              role: "user",
              parts: [{ text: values.prompt }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.data.candidates[0].content.parts[0].text,
      };

      setMessages((prev) => [...prev, assistantMessage]);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Execute Code using Genius AI"
        icon={CodeIcon}
        iconColor="text-green-500"
        bgColor="bg-green-500/10"
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
                      placeholder="e.g. Create a React toggle button component"
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
                Your code will appear here
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
                  <div className="w-full">
                    <p className="font-semibold">
                      {message.role === "user" ? "You" : "Genius AI"}
                    </p>
                    <div className="mt-1">
                      {message.role === "assistant" ? (
                        <>
                          <SyntaxHighlighter
                            language="javascript"
                            style={oneDark}
                            className="rounded-md text-sm"
                          >
                            {message.content}
                          </SyntaxHighlighter>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              navigator.clipboard.writeText(message.content)
                            }
                            className="mt-2"
                          >
                            Copy Code
                          </Button>
                        </>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3 p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <BotAvatar />
                <div>
                  <p className="font-semibold">Genius AI</p>
                  <p className="mt-1 text-sm text-gray-500">Thinking...</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Code;
