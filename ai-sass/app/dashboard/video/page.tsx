"use client";

import React, { useState } from "react";
import { Heading } from "@/components/Heading";
import { VideoIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserAvatar } from "@/components/UserAvatar";
import { BotAvatar } from "@/components/BotAvatar";

type VideoMessage = {
  role: "user" | "assistant";
  content: string;
  videoUrl?: string;
};

const VideoPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<VideoMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

      const userMessage: VideoMessage = {
        role: "user",
        content: values.prompt,
      };
      setMessages((prev) => [...prev, userMessage]);

      const response = await axios.post(
        "/api/video",
        { prompt: values.prompt },
        { headers: { "Content-Type": "application/json" } }
      );

      const assistantMessage: VideoMessage = {
        role: "assistant",
        content: response.data.videoUrl
          ? "Here's your generated video:"
          : "Sorry, no video was returned.",
        videoUrl: response.data.videoUrl,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      form.reset();
    } catch (error: any) {
      let errorMessage = "Failed to generate video";
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
        title="Video Generation"
        description="Create videos using Google Veo AI"
        icon={VideoIcon}
        iconColor="text-orange-500"
        bgColor="bg-orange-500/10"
      />

      <div className="px-4 lg:px-8">
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
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
                      placeholder="Panning wide shot of a calico kitten sleeping in the sunshine"
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
                Your generated videos will appear here
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-gray-50 border border-gray-200"
                      : "bg-orange-50 border border-orange-200"
                  }`}
                >
                  {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                  <div className="flex-1">
                    <p className="font-semibold">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </p>
                    <p className="mt-1">{message.content}</p>
                    {message.videoUrl && (
                      <div className="mt-4">
                        <video
                          controls
                          autoPlay
                          className="w-full max-w-full rounded-lg"
                          src={message.videoUrl}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;