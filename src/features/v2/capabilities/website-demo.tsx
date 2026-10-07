"use client";

import Image from "next/image";
import { useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import styles from "./capability-demos.module.css";

const devices = [
  { id: "desktop", label: "Desktop", Icon: Monitor },
  { id: "tablet", label: "Tablet", Icon: Tablet },
  { id: "phone", label: "Phone", Icon: Smartphone },
] as const;

export function WebsiteDemo() {
  const [device, setDevice] = useState<(typeof devices)[number]["id"]>("desktop");
  const [guests, setGuests] = useState("2");
  const [planning, setPlanning] = useState(false);

  return <div className={`${styles.demo} ${styles.website}`}>
    <header className={styles.toolbar}><strong>The Beach Park – Hadsan</strong><span className={styles.badge}>Layout demo</span></header>
    <div className={styles.deviceControls} role="group" aria-label="Website preview size">
      {devices.map(({ id, label, Icon }) => <button key={id} type="button" aria-pressed={device === id} onClick={() => setDevice(id)}><Icon size={16} aria-hidden="true" />{label}</button>)}
    </div>
    <div className={styles.deviceStage}>
      <div className={styles.sitePreview} data-device={device}>
        <header className={styles.siteNav}><strong>THE BEACH PARK</strong><button type="button" aria-expanded={planning} aria-controls="v2-stay-planner" onClick={() => setPlanning((current) => !current)}>{planning ? "Close" : "Plan a stay"}</button></header>
        <div className={styles.beachPhoto}><Image src="/v2/screens/hadsan.png" alt="Aerial view of the beach and clear water at The Beach Park – Hadsan" fill sizes="(max-width: 720px) 90vw, 50vw" draggable={false} /></div>
        <div className={styles.siteCopy}><span>MACTAN, CEBU</span><h5>A better beach day.</h5><p>Come for the water. Stay for the moments.</p>
          {planning && <div className={styles.stayPlanner} id="v2-stay-planner"><label>Guests<select value={guests} onChange={(event) => setGuests(event.target.value)}>{[1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value} {value === 1 ? "guest" : "guests"}</option>)}</select></label><p role="status">A beach day for {guests} {guests === "1" ? "guest" : "guests"}.</p></div>}
        </div>
      </div>
    </div>
    <footer className={styles.demoFooter}><p>Switch sizes to see the layout adapt. Try “Plan a stay”.</p></footer>
  </div>;
}
