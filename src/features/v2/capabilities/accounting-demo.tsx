"use client";

import { useState } from "react";
import { accountingMonths, formatPesos, type AccountingMetric } from "./capability-demo-data";
import styles from "./capability-demos.module.css";

export function AccountingDemo() {
  const [metric, setMetric] = useState<AccountingMetric>("income");
  const [month, setMonth] = useState<number | null>(null);
  const months = accountingMonths.filter((_, index) => month === null || month === index);
  const income = months.reduce<number>((sum, item) => sum + item.income, 0);
  const expenses = months.reduce<number>((sum, item) => sum + item.expenses, 0);
  const total = metric === "income" ? income : expenses;
  const max = Math.max(...accountingMonths.map((item) => item[metric]));

  return <div className={`${styles.demo} ${styles.accounting}`}>
    <header className={styles.toolbar}><strong>Joyno Accounting</strong><span className={styles.badge}>Sample data</span></header>
    <div className={styles.accountingContent}>
      <div className={styles.accountingHeading}>
        <div><p className={styles.smallLabel}>{month === null ? "January – June" : accountingMonths[month].month} · {metric}</p><strong className={styles.amount} aria-live="polite" aria-atomic="true">{formatPesos(total)}</strong></div>
        <div className={styles.segmented} role="group" aria-label="Financial metric">
          {(["income", "expenses"] as const).map((item) => <button key={item} type="button" aria-pressed={metric === item} onClick={() => setMetric(item)}>{item === "income" ? "Income" : "Expenses"}</button>)}
        </div>
      </div>
      <div className={styles.chart} role="group" aria-label={`Sample monthly ${metric}`}>
        {accountingMonths.map((item, index) => <button key={item.month} className={styles.barButton} type="button" aria-pressed={month === index} aria-label={`${item.month} ${metric}: ${formatPesos(item[metric])}`} data-muted={month !== null && month !== index} onClick={() => setMonth(index)}>
          <span className={styles.barTrack}><span className={styles.bar} style={{ height: `${item[metric] / max * 100}%` }} /></span>
          <span>{item.label}</span>
        </button>)}
      </div>
      <div className={styles.financialSummary}><span>Income <strong>{formatPesos(income)}</strong></span><span>Expenses <strong>{formatPesos(expenses)}</strong></span><span>Net income <strong>{formatPesos(income - expenses)}</strong></span></div>
    </div>
    <footer className={styles.demoFooter}><p>Select a bar to explore a month.</p><button type="button" aria-pressed={month === null} onClick={() => setMonth(null)}>All months</button></footer>
  </div>;
}
