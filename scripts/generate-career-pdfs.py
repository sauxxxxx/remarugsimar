"""Generate selectable, linked PDFs from the website's shared career content."""
import json
from pathlib import Path
import shutil
import subprocess
import sys

sys.dont_write_bytecode = True

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, PageBreak, KeepTogether, Spacer

from career_pdf_layout import education, footer, header, para, section, skills, styles

ROOT = Path(__file__).resolve().parents[1]


def experience(data, style, detailed=False):
    flow = [section("Professional experience", style)]
    for entry in data["experience"]:
        block = [para(f'{entry["role"]} | {entry["company"]}', style["entry"]),
                 para(entry["period"], style["small"])]
        if detailed:
            block.append(para(entry["description"], style["body"]))
        else:
            block += [para("- " + bullet, style["bullet"]) for bullet in entry["bullets"]]
        if detailed:
            block.append(para("Technologies: " + ", ".join(entry["technologies"]), style["small"]))
        flow.append(KeepTogether(block))
    return flow


def project(entry, style, detailed=False, include_outcome=True):
    from html import escape
    title = f'<link href="{entry["url"]}">{escape(entry["name"])}</link>'
    block = [para(title, style["entry"], True)]
    if detailed:
        block.append(para(f'{entry["category"]} | {entry["year"]} | {entry["role"]}', style["small"]))
    block.append(para(entry["description"], style["body"]))
    if detailed:
        block += [para("- " + item, style["bullet"]) for item in entry["contributions"]]
        if include_outcome:
            block.append(para("Result: " + entry["outcome"], style["body"]))
        if entry["technologies"]:
            block.append(para("Technologies: " + ", ".join(entry["technologies"]), style["small"]))
    block.append(Spacer(1, 2))
    return KeepTogether(block)


def generate(kind, data):
    detailed = kind == "cv"
    style = styles()
    label = "Curriculum vitae" if detailed else "Resume"
    flow = header(data["profile"], label, style)
    flow.append(para(data["profile"]["summary"], style["body"]))
    flow += experience(data, style, detailed)
    flow += education(data, style)
    if detailed:
        flow += [PageBreak()] + skills(data, style)
        flow += [section("Product and application projects", style)]
        flow += [project(entry, style, True) for entry in data["projects"][:4]]
        flow += [section("Websites and client projects", style)]
        flow += [project(entry, style, True, include_outcome=False) for entry in data["projects"][4:]]
    else:
        flow += [PageBreak(), section("Selected projects", style)]
        flow += [project(entry, style) for entry in data["projects"]]
        flow += skills(data, style)

    destination = ROOT / "output/pdf" / f"remar-ugsimar-{kind}.pdf"
    destination.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(str(destination), pagesize=A4, leftMargin=42, rightMargin=42,
                                 topMargin=36, bottomMargin=46, title=f'{data["profile"]["name"]} - {label}',
                                 author=data["profile"]["name"])
    draw = footer(data["profile"], label)
    document.build(flow, onFirstPage=draw, onLaterPages=draw)
    public = ROOT / "public/documents" / destination.name
    public.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(destination, public)
    print(destination)


if __name__ == "__main__":
    subprocess.run(["node", str(ROOT / "scripts/export-career-content.cjs")], cwd=ROOT, check=True)
    content = json.loads((ROOT / "tmp/pdfs/career-content.json").read_text(encoding="utf-8"))
    for kind, data in content.items():
        generate(kind, data)
