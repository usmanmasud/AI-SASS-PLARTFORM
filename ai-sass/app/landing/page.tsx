import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage(){
  return <div>
    <Button>
    <Link href="/sign-in">
      Login
    </Link>
    </Button>
    <Button>
    <Link href="/sign-up">
      register
    </Link>
    </Button>
  </div>
};

