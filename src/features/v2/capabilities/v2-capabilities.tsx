"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { v2ProjectHref } from "../projects/v2-project-data";
import { capabilities, type CapabilityId } from "./capability-data";
import { CrmDemo } from "./crm-demo";
import { AccountingDemo } from "./accounting-demo";
import { AiDemo } from "./ai-demo";
import { WebsiteDemo } from "./website-demo";
import styles from "./v2-capabilities.module.css";

const demos = { crm: CrmDemo, accounting: AccountingDemo, ai: AiDemo, web: WebsiteDemo };

export function V2Capabilities({ staticLayout }: { staticLayout: boolean }) {
  const [selectedId, setSelectedId] = useState<CapabilityId>("crm");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = capabilities.find((item) => item.id === selectedId)!;
  const Demo = demos[selectedId];

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % capabilities.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index + capabilities.length - 1) % capabilities.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = capabilities.length - 1;
    else return;
    event.preventDefault();
    setSelectedId(capabilities[next].id);
    tabs.current[next]?.focus({ preventScroll: true });
  }

  return <div className={`${styles.capabilities} ${staticLayout ? styles.flow : ""}`} style={{ "--capability-color": selected.color } as CSSProperties}>
    <div className={styles.intro}><h3>What I can build for you.</h3><p>Choose a service. Try a small example.</p></div>
    <div className={styles.layout}>
      <div className={styles.tabs} role="tablist" aria-label="Services" aria-orientation="vertical">
        {capabilities.map((item, index) => <button key={item.id} ref={(node) => { tabs.current[index] = node; }} type="button" role="tab" id={`v2-capability-tab-${item.id}`} aria-controls="v2-capability-preview" aria-selected={selectedId === item.id} tabIndex={selectedId === item.id ? 0 : -1} style={{ "--item-color": item.color } as CSSProperties} onClick={() => setSelectedId(item.id)} onKeyDown={(event) => onTabKeyDown(event, index)}>
          <span className={styles.number}>0{index + 1}</span><span className={styles.tabCopy}><strong>{item.label}</strong><span>{item.hint}</span></span><ArrowRight size={20} className={styles.tabArrow} aria-hidden="true" />
        </button>)}
      </div>
      <div className={styles.preview} id="v2-capability-preview" role="tabpanel" aria-labelledby={`v2-capability-tab-${selected.id}`} tabIndex={0}>
        <div className={styles.previewHeading}><h4>{selected.title}</h4><span>{selected.description}</span></div>
        <div className={styles.demoStage}><Demo key={`demo-${selected.id}`} /></div>
        <footer className={styles.projectFooter}><span>Built in <strong>{selected.project}</strong></span><Link href={v2ProjectHref(selected.slug)}>View case study <ArrowUpRight size={17} aria-hidden="true" /></Link></footer>
      </div>
    </div>
  </div>;
}
