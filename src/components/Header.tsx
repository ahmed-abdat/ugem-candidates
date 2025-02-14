"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogIn, UserPlus, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { userStorage } from "@/lib/storage";
import { ClientOnly } from "@/components/client-only";

interface UserData {
  id: string;
  first_name: string;
  email: string;
}

const navigation = [
  { name: "الرئيسية", href: "/" },
  { name: "تسجيل مرشح", href: "/candidate/register" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    // Get user data from storage on client side only
    const user = userStorage.getUser();
    setUserData(user);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      userStorage.clearUser();
      setUserData(null);
      setIsOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={() => setIsOpen(false)}
        >
          <Image
            src="/logo.png"
            alt="UGEM Logo"
            width={45}
            height={45}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <ClientOnly>
          <div className="hidden md:flex items-center gap-4">
            {userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200 gap-2"
                  >
                    <User className="w-4 h-4" />
                    {userData.first_name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      الملف الشخصي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                  asChild
                >
                  <Link href="/login" className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                    تسجيل الدخول
                  </Link>
                </Button>
                <Button
                  className="text-sm font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-200 group"
                  asChild
                >
                  <Link href="/register" className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                    إنشاء حساب
                  </Link>
                </Button>
              </>
            )}
          </div>
        </ClientOnly>

        {/* Mobile Navigation */}
        <ClientOnly>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-6">
              <SheetHeader>
                <SheetTitle className="text-right">القائمة الرئيسية</SheetTitle>
                <SheetDescription className="text-right">
                  تصفح جميع الصفحات والخدمات المتاحة
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-8 mt-6">
                {/* Mobile Logo */}
                <Link
                  href="/"
                  className="flex justify-center"
                  onClick={() => setIsOpen(false)}
                >
                  <Image
                    src="/logo.png"
                    alt="UGEM Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                    priority
                  />
                </Link>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm font-medium transition-colors hover:text-primary text-right px-4 py-2 rounded-lg hover:bg-primary/5 ${
                        pathname === item.href
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-3">
                  {userData ? (
                    <>
                      <Button
                        variant="ghost"
                        className="text-sm font-medium hover:bg-primary/5 hover:text-primary justify-start gap-2 h-10"
                        asChild
                      >
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          <User className="w-4 h-4" />
                          الملف الشخصي
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-500 justify-start gap-2 h-10"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="text-sm font-medium hover:bg-primary/5 hover:text-primary justify-start gap-2 h-10"
                        asChild
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <LogIn className="w-4 h-4" />
                          تسجيل الدخول
                        </Link>
                      </Button>
                      <Button
                        className="text-sm font-medium bg-primary hover:bg-primary/90 shadow-lg hover:shadow-primary/25 justify-start gap-2 h-10"
                        asChild
                      >
                        <Link href="/register" onClick={() => setIsOpen(false)}>
                          <UserPlus className="w-4 h-4" />
                          إنشاء حساب
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </ClientOnly>
      </div>
    </header>
  );
}
