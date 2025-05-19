import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = () => {
  const { user } = useUser();

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.imageUrl} alt="User Avatar" />
      <AvatarFallback>
        {user?.firstName?.[0]}{user?.lastName?.[0]}
      </AvatarFallback>
    </Avatar>
  );
};