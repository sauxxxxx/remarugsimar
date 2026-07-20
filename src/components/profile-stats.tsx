import { profileStats } from "@/lib/portfolio-data";
import { TranslatedText } from "@/features/translation/translation-provider";

export function ProfileStats() {
  return (
    <dl aria-label="Career statistics" className="stats-grid">
      {profileStats.map((stat) => (
        <div className="stat" key={stat.label}>
          <dt className="stat__value">{stat.value}</dt>
          <dd className="stat__label">
            <TranslatedText text={stat.label} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
