"use client";

import { useState } from "react";
import { ArrowRight, Clapperboard } from "lucide-react";
import { storyExamples } from "./capability-demo-data";
import styles from "./capability-demos.module.css";

export function AiDemo() {
  const [exampleIndex, setExampleIndex] = useState(0);
  const [sceneIndex, setSceneIndex] = useState(0);
  const example = storyExamples[exampleIndex];
  const scene = example.scenes[sceneIndex];

  return <div className={`${styles.demo} ${styles.ai}`}>
    <header className={styles.toolbar}><strong>CasaToon <span>Story to scene</span></strong><span className={styles.badge}>Preset example</span></header>
    <div className={styles.storyContent}>
      <div className={styles.segmented} role="group" aria-label="Choose a story example">
        {storyExamples.map((item, index) => <button key={item.id} type="button" aria-pressed={exampleIndex === index} onClick={() => { setExampleIndex(index); setSceneIndex(0); }}>{item.label}</button>)}
      </div>
      <div className={styles.storyFlow}>
        <div className={styles.storyIdea}><p className={styles.smallLabel}>Story idea</p><blockquote>{example.idea}</blockquote><span>{example.tone}</span></div>
        <ArrowRight className={styles.flowArrow} size={22} aria-hidden="true" />
        <div className={styles.scenePlan}>
          <p className={styles.smallLabel}><Clapperboard size={14} aria-hidden="true" />Scene plan</p>
          <div className={styles.sceneNumbers} role="group" aria-label="Choose a scene">
            {example.scenes.map((item, index) => <button key={item.title} type="button" aria-label={`Scene ${index + 1}: ${item.title}`} aria-pressed={sceneIndex === index} onClick={() => setSceneIndex(index)}>0{index + 1}</button>)}
          </div>
          <div className={styles.sceneText} aria-live="polite" aria-atomic="true"><span>{scene.shot}</span><h5>{scene.title}</h5><p>{scene.copy}</p></div>
        </div>
      </div>
    </div>
    <footer className={styles.demoFooter}><p>Explore two prepared examples and their scenes.</p></footer>
  </div>;
}
