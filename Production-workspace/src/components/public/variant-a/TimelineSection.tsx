const steps = [
  { title: "Request a Quote", body: "Submit the form or call directly. We respond within the hour." },
  { title: "We Assess", body: "We review scope and provide a transparent estimate." },
  { title: "We Clean", body: "Insured crews execute with documented standards." },
  { title: "You Walk Through", body: "Final QA review before handoff." },
];

export function TimelineSection() {
  return (
    <section className="border-b border-slate-200 bg-[#FAFAF8] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-16 text-center font-serif text-4xl tracking-tight text-[#0A1628] md:text-5xl">How It Works</h2>
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-sm border border-slate-200 bg-white p-6">
              <p className="mb-3 font-serif text-4xl text-slate-300">{index + 1}</p>
              <h3 className="mb-2 font-serif text-2xl text-[#0A1628]">{step.title}</h3>
              <p className="font-light text-slate-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
