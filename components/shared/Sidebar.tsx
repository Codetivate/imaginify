"use client";

import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="flex side-full flex-col gap-4">
        <Link href="/" className="sidebar-logo">
          <Image
            src="/assets/images/logo-text.svg"
            alt="logo"
            width={180}
            height={28}
          />
        </Link>
        <nav className="sidebar-nav">
          <SignedIn>
            <ul className="sidebar-nav_elements">
              {/* slice shows items index 0-5 or value 1-6 */}
              {navLinks.slice(0, 6).map((link) => {
                const isActive = link.route === pathname;

                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group ${
                      isActive
                        ? "bg-purple-gradient text-white"
                        : "text-gray-700"
                    }`}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive && "brightness-200"}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="sidebar-nav_elements">
              {/* slice shows items index above 6  or value 7 until the end */}
              {navLinks.slice(6).map((link) => {
                const isActive = link.route === pathname;

                return (
                  <li
                    key={link.route}
                    className={`sidebar-nav_element group ${
                      isActive
                        ? "bg-purple-gradient text-white"
                        : "text-gray-700"
                    }`}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive && "brightness-200"}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              <li className="flex-center cursor-pointer gap-2 p-4">
                <UserButton showName />
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button asChild>
              <Link
                href="/sign-in"
                className="button bg-purple-gradient bg-cover"
              >
                Login
              </Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

/*
No Wrap
Use whitespace-nowrap to prevent text from wrapping within an element. Newlines and spaces will be collapsed.

<div class="w-3/4 overflow-x-auto ...">
  <div class="whitespace-nowrap ...">Hey everyone!

It's almost 2022       and we still don't know if there       is aliens living among us, or do we? Maybe the person writing this is an alien.

You will never know.</div>
</div>


result is the same line:

Hey everyone! It's almost 2022 and we still don't.....

*/

//bg-purple-gradient from extending from tailwind.config.ts
