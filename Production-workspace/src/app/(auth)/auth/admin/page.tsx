import AdminAuthClient from "@/app/(auth)/auth/admin/AdminAuthClient";

type AdminAuthPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminAuthPage({ searchParams }: AdminAuthPageProps) {
  const params = await searchParams;
  return <AdminAuthClient initialError={params.error} />;
}
