export function PublicPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">{children}</div>
  );
}
