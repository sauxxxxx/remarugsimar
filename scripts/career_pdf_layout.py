"""Print typography shared by the resume and CV generators."""
from html import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Spacer

INK = colors.HexColor("#152420")
MUTED = colors.HexColor("#53605b")
ACCENT = colors.HexColor("#157958")


def clean(text):
    for char in ("\u2013", "\u2014", "\u2011"):
        text = str(text).replace(char, "-")
    return text.replace("\u2019", "'").replace("\u2018", "'").replace("\u00b7", "|")


def styles():
    size = 11
    result = {
        "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=29, leading=34, textColor=INK, spaceAfter=5),
        "role": ParagraphStyle("role", fontName="Helvetica", fontSize=14, leading=19, textColor=ACCENT, spaceAfter=8),
        "body": ParagraphStyle("body", fontName="Helvetica", fontSize=size, leading=16, textColor=INK, spaceAfter=4, alignment=TA_JUSTIFY, splitLongWords=False),
        "small": ParagraphStyle("small", fontName="Helvetica", fontSize=10, leading=14, textColor=MUTED, spaceAfter=3),
        "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=12, leading=17, textColor=ACCENT, spaceBefore=14, spaceAfter=8, keepWithNext=True),
        "entry": ParagraphStyle("entry", fontName="Helvetica-Bold", fontSize=size + 1, leading=size * 1.5, textColor=INK, spaceBefore=3, spaceAfter=2, keepWithNext=True),
        "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=size, leading=16, textColor=INK, leftIndent=10, firstLineIndent=-8, spaceAfter=2, alignment=TA_JUSTIFY),
    }
    return result


def para(text, style, markup=False):
    return Paragraph(clean(text) if markup else escape(clean(text)), style)


def section(title, style):
    return para(title.upper(), style["section"])


def header(profile, label, style):
    links = [f'<link href="mailto:{profile["email"]}">{escape(profile["email"])}</link>',
             f'<link href="{profile["website"]}">remarugsimar.com</link>']
    links += [f'<link href="{link["href"]}">{link["label"].title()}</link>' for link in profile["links"]]
    return [para(profile["name"], style["name"]), para(profile["title"], style["role"]),
            para(profile["location"], style["small"]),
            para(" | ".join(links), style["small"], True),
            para(label + " | " + profile["updatedLabel"], style["small"]), Spacer(1, 5)]


def footer(profile, label):
    def draw(canvas, document):
        canvas.saveState()
        width, _ = document.pagesize
        canvas.setStrokeColor(colors.HexColor("#dce4df"))
        canvas.line(42, 34, width - 42, 34)
        canvas.setFont("Helvetica", 10)
        canvas.setFillColor(MUTED)
        canvas.drawString(42, 22, clean(f'{profile["name"]} | {label} | {profile["updatedLabel"]}'))
        canvas.drawRightString(width - 42, 22, str(document.page))
        canvas.restoreState()
    return draw


def skills(data, style):
    flow = [section("Technical skills", style)]
    for group in data["skills"]:
        text = f'<b>{escape(group["name"])}:</b> {escape(", ".join(group["technologies"]))}'
        flow.append(para(text, style["body"], True))
    return flow


def education(data, style):
    flow = [section("Education", style)]
    for entry in data["education"]:
        flow.append(para(f'{entry["school"]} | {entry["year"]}', style["entry"]))
        text = entry["qualification"] + (f' | {entry["distinction"]}' if entry["distinction"] else "")
        flow.append(para(text, style["body"]))
    return flow
