import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "~/components/ui/button";
import ConnectWalletButton from "~/modules/auth/ConnectWalletButton";

export default function Navbar() {
  const [showMobileHeader, setShowMobileHeader] = React.useState(false);

  const menus = [
    { title: "Home", path: "/your-path" },
    { title: "Explore", path: "/your-path" },
  ];

  return (
    <nav className="w-full border-b border-border bg-background/95 bg-white shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-screen-xl items-center px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:block md:py-5">
          <Link href="/">
            <h1 className="text-3xl font-bold text-purple-600">Logo</h1>
          </Link>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileHeader(!showMobileHeader)}
            >
              <Menu />
            </Button>
          </div>
        </div>
        <div
          className={`mt-8 flex-1 justify-self-center pb-3 md:mt-0 md:block md:pb-0 ${
            showMobileHeader ? "block" : "hidden"
          }`}
        >
          <ul className="items-center space-y-8 px-0 md:flex md:space-x-6 md:space-y-0 md:px-12">
            {menus.map((item, idx) => (
              <li
                key={idx}
                className="text-foreground hover:text-foreground/60"
              >
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <ConnectWalletButton />
      </div>
    </nav>
  );
}
