# Local translation setup

The portfolio uses checked-in JSON dictionaries. Translation does not require an API, billing,
an environment secret, or a network request.

## Supported languages

- English is the source language.
- Filipino, Cebuano, Spanish, Japanese, Korean, Simplified Chinese, French, German, Portuguese,
  Indonesian, and Vietnamese are loaded from separate JSON bundles only when selected.
- The visitor's selected language is saved in local storage and restored on future visits.

## Updating translated copy

1. Add or update the English source text in `translation.constants.ts` or the portfolio data file.
2. Add the matching translation at the same array position in every file under `locales/`.
3. Keep every locale array the same length as `TRANSLATION_SOURCE_TEXTS`.
4. Run lint, type checking, and the production build before publishing.

The locale loader validates dictionary length at runtime and reports an incomplete locale instead
of applying a partially translated page.

## Adding another language

1. Create a JSON array in `src/features/translation/locales/`.
2. Add its language code and display name to `SUPPORTED_LANGUAGES`.
3. Register its dynamic import in `locale-loader.ts`.
4. Add it to the recommended group only when it should appear at the top of the selector.
