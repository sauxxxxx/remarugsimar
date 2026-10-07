"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { contactFaqs } from "./closing-content";
import styles from "./v2-contact-faqs.module.css";

export function V2ContactFaqs() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div aria-label="Project questions" className={styles.faqs} data-v2-reveal="visual" role="group">
      {contactFaqs.map((faq) => (
        <div className={styles.faq} key={faq.id}>
          <button
            aria-controls={`v2-faq-answer-${faq.id}`}
            aria-expanded={openId === faq.id}
            id={`v2-faq-question-${faq.id}`}
            onClick={() => setOpenId((current) => current === faq.id ? null : faq.id)}
            type="button"
          >
            <span>{faq.question}</span><Plus aria-hidden="true" size={20} />
          </button>
          <div
            aria-labelledby={`v2-faq-question-${faq.id}`}
            className={styles.answer}
            hidden={openId !== faq.id}
            id={`v2-faq-answer-${faq.id}`}
            role="region"
          >
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
