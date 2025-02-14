"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Logo Section */}
        <div className="mb-6">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="شعار"
              width={100}
              height={35}
              className="mx-auto"
              priority
            />
          </Link>
        </div>

        {/* 404 Number */}
        <h1 className="text-[120px] sm:text-[180px] font-black leading-none bg-gradient-to-b from-primary/80 to-primary/40 bg-clip-text text-transparent drop-shadow-sm">
          404
        </h1>

        {/* Main Message */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
            عذراً، الصفحة غير موجودة
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground/80">
            يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/">
            <Button
              variant="default"
              className="w-full sm:w-auto h-9 px-8 text-sm bg-primary hover:bg-primary/90"
            >
              العودة للرئيسية
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto h-9 px-8 text-sm border-primary/20 hover:bg-primary/5"
            onClick={() => window.history.back()}
          >
            الرجوع للخلف
            <ArrowLeft className="mr-2 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />

          {/* Decorative Circles */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-b from-primary/20 to-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-b from-primary/20 to-primary/10 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
