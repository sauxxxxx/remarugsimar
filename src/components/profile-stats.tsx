import { CalendarDays, FolderOpen, MapPin } from "lucide-react";
import { profileStats } from "@/lib/portfolio-data";
import { TranslatedText } from "@/features/translation/translation-provider";

const statIcons = [CalendarDays, FolderOpen, MapPin] as const;

export function ProfileStats() {
  return (
    <dl aria-label="Career statistics" className="stats-grid">
      {profileStats.map((stat, index) => {
        const Icon = statIcons[index];

        return (
          <div className="stat" key={stat.label}>
            <Icon aria-hidden="true" size={14} strokeWidth={1.45} />
            <dt className="stat__value">{stat.value}</dt>
            <dd className="stat__label">
              <TranslatedText text={stat.label} />
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
