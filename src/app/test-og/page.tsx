import Image from "next/image";

export default function TestOGPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold">OG Image Test</h1>
        <p className="text-muted-foreground text-center">
          Below is a preview of the OG image that will be used for social media
          sharing
        </p>
      </div>

      <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-lg border bg-muted shadow-md">
        <Image
          src="/api/og"
          alt="OG Image Preview"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">Direct URL to OG Image:</p>
        <code className="px-4 py-2 rounded-md bg-muted text-sm">
          {`${
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
          }/api/og`}
        </code>
      </div>
    </div>
  );
}
