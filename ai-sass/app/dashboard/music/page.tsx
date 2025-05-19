"use client";

import { Music2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";

const MusicPage = () => {
  const router = useRouter();

  // TODO: Replace this with real Pro user logic (e.g., from user session or API)
  const isProUser = false;

  if (!isProUser) {
    return (
      <div>
        <Heading
          title="Music Generation"
          description="Powered by AI"
          icon={Music2}
          iconColor="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
        <div className="px-4 lg:px-8 mt-8">
          <div className="text-center text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <p className="text-lg font-semibold">Pro Version Required</p>
            <p className="mt-2">
              Upgrade to the Pro plan to access the music generation feature.
            </p>
            <Button className="mt-4" onClick={() => router.push("/upgrade")}>
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Heading
        title="Music Generation"
        description="Powered by AI"
        icon={Music2}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8 mt-8">
        {/* Replace this with your actual form and chat UI */}
        <p>Music generation functionality goes here.</p>
      </div>
    </div>
  );
};

export default MusicPage;
