import EmployeeAuthClient from "@/app/(auth)/auth/employee/EmployeeAuthClient";

type EmployeeAuthPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function EmployeeAuthPage({ searchParams }: EmployeeAuthPageProps) {
  const params = await searchParams;
  return <EmployeeAuthClient initialError={params.error} />;
}
