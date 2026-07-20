import { TRANSLATION_SOURCE_TEXTS } from "../translation.constants";

type LocaleModule = { default: string[] };

const localeLoaders: Record<string, () => Promise<LocaleModule>> = {
  ceb: () => import("./ceb.json"),
  de: () => import("./de.json"),
  es: () => import("./es.json"),
  fil: () => import("./fil.json"),
  fr: () => import("./fr.json"),
  id: () => import("./id.json"),
  ja: () => import("./ja.json"),
  ko: () => import("./ko.json"),
  pt: () => import("./pt.json"),
  vi: () => import("./vi.json"),
  "zh-CN": () => import("./zh-CN.json"),
};

export async function loadLocaleDictionary(languageCode: string) {
  const loader = localeLoaders[languageCode];
  if (!loader) throw new Error("This language is not available locally.");

  const { default: translatedTexts } = await loader();
  if (translatedTexts.length !== TRANSLATION_SOURCE_TEXTS.length) {
    throw new Error(`The ${languageCode} locale is incomplete.`);
  }

  return Object.fromEntries(
    TRANSLATION_SOURCE_TEXTS.map((source, index) => [source, translatedTexts[index]]),
  );
}
