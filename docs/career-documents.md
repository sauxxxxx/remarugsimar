# Resume and curriculum vitae

The `/resume` and `/cv` pages use `src/features/career/career-content.ts`.
This module combines the current project catalogue and work history with career-specific
summary text, responsibility bullets, and verified education details.

The resume includes university education and four application projects. The CV includes
all three schools and all ten projects. Do not add metrics, credentials, employment dates,
or project technologies unless they have been confirmed.

## Regenerate PDF downloads

Install the Python dependency once:

```sh
python -m pip install -r scripts/career-pdf-requirements.txt
```

Then run from the repository root:

```sh
python scripts/generate-career-pdfs.py
```

The exporter loads the same TypeScript content as the pages, using the repository's
installed TypeScript compiler. PDFs are written to `output/pdf/` and copied into
`public/documents/` for the website download links. Commit the public PDFs alongside
any content updates; `output/` and `tmp/` are ignored.

Render and visually inspect every page after updating the content. Check page count,
selectable text, link targets, margins, and page breaks before publishing.
