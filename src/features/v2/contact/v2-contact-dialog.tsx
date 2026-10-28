"use client";

import { ArrowUpRight, Check, Copy, X } from "lucide-react";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import styles from "./v2-contact-dialog.module.css";

type Status = "idle" | "sending" | "sent" | "error";
type Field = "name" | "email" | "message";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const subject = "Project inquiry";

const gmailHref = (context: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.email)}&su=${encodeURIComponent(context ? `${subject}: ${context}` : subject)}`;
const mailHref = (context: string) =>
  `mailto:${siteConfig.email}?subject=${encodeURIComponent(context ? `${subject}: ${context}` : subject)}`;

function validate(form: HTMLFormElement) {
  const value = (name: Field) => (form.elements.namedItem(name) as HTMLInputElement).value.trim();
  const errors: Partial<Record<Field, string>> = {};
  if (!value("name")) errors.name = "Please add your name.";
  if (!EMAIL_PATTERN.test(value("email"))) errors.email = "Please add an email I can reply to.";
  if (value("message").length < 10) errors.message = "A sentence or two about the project helps.";
  return errors;
}

/**
 * The "start a project" form. Any link marked with data-v2-contact opens it (the attribute's
 * value names what the enquiry is about); without JavaScript those links still open email.
 */
export function V2ContactDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const startedAt = useRef(0);
  const [context, setContext] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sentTo, setSentTo] = useState({ name: "", email: "" });
  const [copied, setCopied] = useState(false);
  const id = useId();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest<HTMLElement>("[data-v2-contact]");
      if (!link || !dialogRef.current) return;
      event.preventDefault();
      setContext(link.dataset.v2Contact ?? "");
      setStatus((current) => (current === "sending" ? current : "idle"));
      startedAt.current = Date.now();
      dialogRef.current.showModal();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Keep the page still behind the open dialog.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const root = document.documentElement;
    let previous = "";
    const observer = new MutationObserver(() => {
      if (dialog.open) {
        previous = root.style.overflow;
        root.style.overflow = "hidden";
      } else {
        root.style.overflow = previous;
      }
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ["open"] });
    return () => {
      observer.disconnect();
      root.style.overflow = previous;
    };
  }, []);

  const close = () => dialogRef.current?.close();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const found = validate(form);
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      (form.elements.namedItem(first) as HTMLElement).focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, context, startedAt: startedAt.current }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
      if (!response.ok || !result?.ok) throw new Error(String(response.status));
      setSentTo({ name: data.name.trim().split(/\s+/)[0], email: data.email.trim() });
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = mailHref(context);
    }
  }

  const fieldProps = (name: Field) => ({
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
    "aria-invalid": errors[name] ? true : undefined,
    id: `${id}-${name}`,
    name,
    onInput: () => errors[name] && setErrors((current) => ({ ...current, [name]: undefined })),
  });
  const error = (name: Field) =>
    errors[name] ? <span className={styles.fieldError} id={`${id}-${name}-error`}>{errors[name]}</span> : null;

  return (
    <dialog
      aria-labelledby={`${id}-title`}
      className={styles.dialog}
      data-lenis-prevent
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      ref={dialogRef}
    >
      <div className={styles.panel}>
        <button aria-label="Close" className={styles.close} onClick={close} type="button"><X aria-hidden="true" size={20} /></button>

        {status === "sent" ? (
          <div className={styles.done} role="status">
            <span aria-hidden="true" className={styles.doneMark}><Check size={26} /></span>
            <h2 id={`${id}-title`}>Thanks, {sentTo.name}.</h2>
            <p>Your message is on its way. I&apos;ll reply to <strong>{sentTo.email}</strong>.</p>
            <button className={styles.submit} onClick={close} type="button">Close</button>
          </div>
        ) : (
          <>
            <h2 className={styles.title} id={`${id}-title`}>Start a project.</h2>
            <p className={styles.intro}>
              {context ? <>About <strong>{context}</strong>. </> : null}
              Tell me what you&apos;d like to build and I&apos;ll reply by email.
            </p>

            <form className={styles.form} noValidate onSubmit={submit}>
              <div className={styles.row}>
                <label className={styles.field} htmlFor={`${id}-name`}>
                  <span>Name</span>
                  <input autoComplete="name" autoFocus maxLength={100} type="text" {...fieldProps("name")} />
                  {error("name")}
                </label>
                <label className={styles.field} htmlFor={`${id}-email`}>
                  <span>Email</span>
                  <input autoComplete="email" inputMode="email" maxLength={200} type="email" {...fieldProps("email")} />
                  {error("email")}
                </label>
              </div>
              <label className={styles.field} htmlFor={`${id}-message`}>
                <span>What do you want to build?</span>
                <textarea
                  maxLength={5000}
                  placeholder="The problem, who uses it, and any timeline you have in mind."
                  rows={5}
                  {...fieldProps("message")}
                />
                {error("message")}
              </label>

              {/* Hidden from people; bots that fill it are ignored. */}
              <label aria-hidden="true" className={styles.trap}>
                Website <input autoComplete="off" name="website" tabIndex={-1} type="text" />
              </label>

              {status === "error" && (
                <p className={styles.formError} role="alert">
                  That didn&apos;t send. Please try again, or email me directly using the links below.
                </p>
              )}

              <button className={styles.submit} disabled={status === "sending"} type="submit">
                {status === "sending" ? "Sending…" : <>Send message <ArrowUpRight aria-hidden="true" size={18} /></>}
              </button>
            </form>

            <p className={styles.alternatives}>
              <span>Prefer email?</span>
              <a href={gmailHref(context)} rel="noopener noreferrer" target="_blank">Gmail</a>
              <a href={mailHref(context)}>Mail app</a>
              <button onClick={copyEmail} type="button">
                {copied ? <><Check aria-hidden="true" size={14} /> Copied</> : <><Copy aria-hidden="true" size={14} /> Copy address</>}
              </button>
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}
