import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAF8] px-6 text-center">
      <p className="section-kicker mb-4">Page Not Found</p>
      <h1 className="font-serif text-6xl tracking-tight text-[#0A1628] md:text-8xl">404</h1>
      <p className="mt-6 max-w-md text-lg font-light text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to the main site.
      </p>
      <Link href="/" className="cta-primary mt-10">
        Back to Home
      </Link>
    </main>
  );
}
