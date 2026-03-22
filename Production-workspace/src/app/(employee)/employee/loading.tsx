export default function EmployeeLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
        <p className="text-gray-500 text-lg">Cargando...</p>
      </div>
    </div>
  );
}
