"use client";

import { useState, type CSSProperties } from "react";
import { GripVertical, RotateCcw } from "lucide-react";
import { formatPesos, leadStages, moveSampleLead, sampleLeads, type LeadStage } from "./capability-demo-data";
import styles from "./capability-demos.module.css";

export function CrmDemo() {
  const [leads, setLeads] = useState(() => [...sampleLeads]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [target, setTarget] = useState<LeadStage | null>(null);
  const [message, setMessage] = useState("");

  function move(id: string, stage: string) {
    const lead = leads.find((item) => item.id === id);
    const destination = leadStages.find((item) => item.id === stage);
    if (!lead || !destination) return;
    setLeads((current) => moveSampleLead(current, id, stage));
    setMessage(`${lead.name} moved to ${destination.label}.`);
    setDraggedId(null);
    setTarget(null);
  }

  return (
    <div className={`${styles.demo} ${styles.crm}`}>
      <header className={styles.toolbar}>
        <strong>Scout <span>Sales pipeline</span></strong>
        <span className={styles.badge}>Sample data</span>
      </header>
      <div className={styles.pipeline} aria-label="Sample sales pipeline">
        {leadStages.map((stage) => {
          const items = leads.filter((lead) => lead.stage === stage.id);
          return <section key={stage.id} className={styles.column} aria-label={`${stage.label} leads`} data-drop-target={target === stage.id} style={{ "--stage-color": stage.color } as CSSProperties}
            onDragOver={(event) => { if (draggedId) { event.preventDefault(); event.dataTransfer.dropEffect = "move"; setTarget(stage.id); } }}
            onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setTarget(null); }}
            onDrop={(event) => { event.preventDefault(); move(event.dataTransfer.getData("text/plain"), stage.id); }}>
            <h5><i />{stage.label}<span>{items.length}</span></h5>
            <p className={styles.stageTotal}>{formatPesos(items.reduce((sum, item) => sum + item.value, 0))}</p>
            <div className={styles.leads}>
              {items.map((lead) => <article className={styles.lead} key={lead.id} draggable data-dragging={draggedId === lead.id}
                onDragStart={(event) => { event.dataTransfer.setData("text/plain", lead.id); event.dataTransfer.effectAllowed = "move"; setDraggedId(lead.id); }}
                onDragEnd={() => { setDraggedId(null); setTarget(null); }}>
                <div className={styles.leadName}><strong>{lead.name}</strong><GripVertical size={14} aria-hidden="true" /></div>
                <p>{lead.note}</p>
                <span className={styles.leadValue}>{formatPesos(lead.value)}</span>
                <label className={styles.stageSelect}>Stage
                  <select aria-label={`Stage for ${lead.name}`} value={lead.stage} onChange={(event) => move(lead.id, event.target.value)}>
                    {leadStages.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                  </select>
                </label>
              </article>)}
              {items.length === 0 && <p className={styles.emptyColumn}>{draggedId ? "Drop here" : "No leads yet"}</p>}
            </div>
          </section>;
        })}
      </div>
      <footer className={styles.demoFooter}>
        <p>Drag a lead, or choose its stage.</p>
        <button type="button" onClick={() => { setLeads([...sampleLeads]); setDraggedId(null); setTarget(null); setMessage("Sample pipeline reset."); }}><RotateCcw size={14} aria-hidden="true" />Reset demo</button>
      </footer>
      <p className={styles.srOnly} role="status">{message}</p>
    </div>
  );
}
