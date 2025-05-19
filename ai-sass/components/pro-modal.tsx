"use client"

import { ArrowRight, Code, ImageIcon, MessageSquare, Music, VideoIcon, Badge, CheckIcon, ZapIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { useProModal } from "@/hooks/use-pro-modal";
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";
import { Button } from "./ui/button";


export const ProModal = () => {

    const tools = [
      {
        label: "Conversation",
        icon: MessageSquare,
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
        href: "/dashboard/conversation",
      },
      {
        label: "Video Generation",
        icon: VideoIcon,
        href: "/dashboard/video",
        color: "text-orange-700",
        bgColor: "bg-orange-700/10",
      },
      {
        label: "Music Generation",
        icon: Music,
        href: "/dashboard/music",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
      },
      {
        label: "Code Generation",
        icon: Code,
        href: "/dashboard/code",
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
    ];

    const proModal = useProModal();

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justif-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-center gap-x-2 font-bold py-1">
                        Upgrade to Genius
                        <Badge className="uppercase text-sm py-1  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-primary-foreground ">
                            pro
                        </Badge>
                        pro
                        </div>
                    </DialogTitle>
                    <DialogDescription className="text-center pt-3 space-y-2 text-zinc-900 font-medium">
                        {tools.map((tool) => ( 
                            <Card key={tool.label} className="p-2 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer">
                               <div className="flex items-center gap-x-1">
                                <div className={cn("p-1  rounded-md", tool.bgColor)}>
                                    <tool.icon className={cn("h-3 w-3", tool.color)} />
                               </div>
                               <div className="font-semibold text-sm">
                                    {tool.label}
                               </div>
                               </div>
                               <CheckIcon className="text-primary w-3 h-3" />
                            </Card>
                        ))}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button size="lg" variant="default" className="w-full">
                        Upgrade
                        <ZapIcon className="w-4 h-4 ml-2 fill-white" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
