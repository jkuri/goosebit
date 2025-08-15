import { LogOut, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { useAuthStore } from "@/stores/auth";

export function UserMenu() {
  const { user, getUsername } = useUser();
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const email = getUsername();
  const initials = email
    ? email
        .split("@")[0]
        .split(".")
        .map((part) => part.charAt(0).toUpperCase())
        .join("")
        .slice(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <p className="text-muted-foreground text-sm leading-none">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <NavLink to="/settings">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </NavLink>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
