"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Settings,
  UserCircle2,
  FileEdit,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { userStorage } from "@/lib/storage";
import { ClientOnly } from "@/components/client-only";
import { useUserCandidate } from "@/hooks/use-user-candidate";
import { useUserStore } from "@/lib/store";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { user: userData, setUser } = useUserStore();
  const { hasCandidate } = useUserCandidate(userData?.id);

  useEffect(() => {
    setMounted(true);
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
      setUser(null);
      setIsOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userData) return "U";
    return `${userData.first_name.charAt(0)}${userData.last_name.charAt(
      0
    )}`.toUpperCase();
  };

  // Navigation items
  const getNavigationItems = () => {
    if (!mounted) return [];

    return [
      ...(!hasCandidate && userData
        ? [{ name: "تسجيل منتسب", href: "/candidate/register", icon: FileEdit }]
        : []),
    ];
  };

  const navigation = getNavigationItems();

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
        {mounted && (
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {mounted ? (
            userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={userData.image_url || "/default_avatar.jpeg"}
                        alt={userData.first_name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userData.first_name} {userData.last_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/profile"
                        className="cursor-pointer flex items-center"
                      >
                        <UserCircle2 className="w-4 h-4 ml-2" />
                        الملف الشخصي
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
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
                    <LogIn className="w-4 h-4" />
                    تسجيل الدخول
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
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
            )
          ) : null}
        </div>

        {/* Mobile Navigation */}
        {mounted && (
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
              </SheetHeader>
              <div className="flex flex-col gap-8 mt-6">
                {/* Mobile User Info */}
                {userData && (
                  <div className="flex items-center gap-4 px-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={userData.image_url || "/default_avatar.jpeg"}
                        alt={userData.first_name}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {userData.first_name} {userData.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userData.email}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-sm font-medium transition-colors hover:text-primary text-right px-4 py-2 rounded-lg hover:bg-primary/5 flex items-center gap-2 ${
                          pathname === item.href
                            ? "text-primary bg-primary/5"
                            : "text-muted-foreground"
                        }`}
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                  {userData ? (
                    <>
                      <Button
                        variant="ghost"
                        className="justify-start gap-2 h-10"
                        asChild
                      >
                        <Link href="/profile" onClick={() => setIsOpen(false)}>
                          <UserCircle2 className="w-4 h-4" />
                          الملف الشخصي
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:text-red-500 hover:bg-red-50 justify-start gap-2 h-10"
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
                        className="justify-start gap-2 h-10"
                        asChild
                      >
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <LogIn className="w-4 h-4" />
                          تسجيل الدخول
                        </Link>
                      </Button>
                      <Button
                        className="bg-primary hover:bg-primary/90 justify-start gap-2 h-10"
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
        )}
      </div>
    </header>
  );
}
