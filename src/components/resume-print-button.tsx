"use client";

export function ResumePrintButton() {
  return (
    <button className="resume-print" onClick={() => window.print()} type="button">
      save as PDF
      <span aria-hidden="true">↓</span>
    </button>
  );
}
