export function DemoBanner({ label }: { label: string }) {
  return (
    <p
      role="note"
      data-testid="demo-banner"
      className="bg-gold px-4 py-2 text-center text-xs font-bold uppercase tracking-wider text-navy"
    >
      {label}
    </p>
  );
}
