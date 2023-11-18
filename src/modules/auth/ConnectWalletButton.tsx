import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import React, { useMemo } from "react";
import { useLensAuth } from "~/modules/lens";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Loader2, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import ProfileManagerSetting from "./ProfileManager";

const ProfileButton = () => {
  const { profile, logout, getProfilePictureUri } = useLensAuth();

  const profilePictureUri = useMemo(getProfilePictureUri, [
    getProfilePictureUri,
  ]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row items-center justify-center space-x-4">
        <Avatar>
          {profilePictureUri && <AvatarImage src={profilePictureUri} />}
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span>{profile?.handle?.localName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <ProfileManagerSetting />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button onClick={logout} variant="link" size={"sm"}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ConnectWalletButton = () => {
  const address = useAddress();
  const { loading } = useLensAuth();

  if (!address) return <ConnectWallet />;

  if (loading) {
    return (
      <Button disabled={true} size={"sm"}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return <ProfileButton />;
};

export default ConnectWalletButton;
