const stats = [
  { value: "15+", label: "Years" },
  { value: "500+", label: "Projects" },
  { value: "Licensed", label: "& Insured" },
  { value: "100%", label: "On-Time" },
];

export function AuthorityBar() {
  return (
    <section className="border-b border-slate-200 bg-[#FAFAF8] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={`${stat.value}-${stat.label}`}>
              <p className="font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl">{stat.value}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
