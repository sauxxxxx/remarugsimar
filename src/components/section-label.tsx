type SectionLabelProps = {
  children: React.ReactNode;
  note?: React.ReactNode;
};

export function SectionLabel({ children, note }: SectionLabelProps) {
  return (
    <header className="section-label">
      <span className="section-label__title">
        <span aria-hidden="true" className="section-label__marker" />
        {children}
      </span>
      {note ? <span className="section-label__note">{note}</span> : null}
    </header>
  );
}
