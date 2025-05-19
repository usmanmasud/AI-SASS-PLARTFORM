// components/BotAvatar.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export const BotAvatar = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="bg-violet-100 text-violet-600">
        <Bot className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
};