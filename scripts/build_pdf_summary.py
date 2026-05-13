#!/usr/bin/env python3
"""
Genera docs/RESUMEN_MULTIMEDIA_TYCOON.pdf desde docs/RESUMEN_MULTIMEDIA_TYCOON.md

Dependencias: pip install reportlab

Usa una fuente TrueType con soporte Unicode (Arial Unicode en macOS, DejaVu en Linux típico).
"""

from __future__ import annotations

import platform
import re
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
MD_PATH = ROOT / "docs" / "RESUMEN_MULTIMEDIA_TYCOON.md"
OUT_PATH = ROOT / "docs" / "RESUMEN_MULTIMEDIA_TYCOON.pdf"


def find_unicode_font() -> tuple[str, str]:
    """Devuelve (nombre_registro, ruta_ttf) o ('Helvetica', '') como último recurso."""
    candidates = []
    if platform.system() == "Darwin":
        candidates.append(
            "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
        )
    # Linux común (Debian/Ubuntu)
    candidates.extend(
        [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/TTF/DejaVuSans.ttf",
        ]
    )
    for path in candidates:
        p = Path(path)
        if p.is_file():
            return ("UnicodeBody", str(p))
    return ("Helvetica", "")


def register_font() -> str:
    name, path = find_unicode_font()
    if path:
        pdfmetrics.registerFont(TTFont(name, path))
        return name
    return "Helvetica"


def md_to_flowables(md_text: str, font_name: str):
    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "TitleDoc",
        parent=styles["Heading1"],
        fontName=font_name,
        fontSize=18,
        spaceAfter=10,
        textColor=colors.HexColor("#232337"),
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName=font_name,
        fontSize=13,
        spaceBefore=14,
        spaceAfter=8,
        textColor=colors.HexColor("#4b3778"),
    )
    h3 = ParagraphStyle(
        "H3",
        parent=styles["Heading3"],
        fontName=font_name,
        fontSize=11,
        spaceBefore=10,
        spaceAfter=6,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["Normal"],
        fontName=font_name,
        fontSize=10,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=6,
    )
    small = ParagraphStyle(
        "Small",
        parent=body,
        fontSize=8,
        leading=10,
        textColor=colors.grey,
    )
    code_style = ParagraphStyle(
        "Code",
        parent=styles["Code"],
        fontName="Courier",
        fontSize=8,
        leading=10,
        leftIndent=8,
        backColor=colors.HexColor("#f5f5f8"),
        borderPadding=6,
        spaceAfter=8,
    )

    story = []
    lines = md_text.splitlines()
    i = 0
    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()
        i += 1

        if not line.strip():
            continue

        if line.strip() == "---":
            story.append(Spacer(1, 6))
            continue

        if line.startswith("# "):
            story.append(Paragraph(escape(line[2:].strip()), title))
            continue

        if line.startswith("## "):
            story.append(Paragraph(escape(line[3:].strip()), h2))
            continue

        if line.startswith("### "):
            story.append(Paragraph(escape(line[4:].strip()), h3))
            continue

        # Bloque código ```
        if line.strip().startswith("```"):
            buf = []
            while i < len(lines):
                if lines[i].strip().startswith("```"):
                    i += 1
                    break
                buf.append(lines[i])
                i += 1
            txt = escape("\n".join(buf))
            story.append(Paragraph(txt.replace("\n", "<br/>"), code_style))
            continue

        # Tabla markdown simple (filas que empiezan por |)
        if "|" in line and line.strip().startswith("|"):
            table_lines = [line]
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i])
                i += 1
            data = []
            cell_style = ParagraphStyle(
                "Cell",
                parent=body,
                fontSize=8,
                leading=10,
            )
            for tl in table_lines:
                cells = [c.strip() for c in tl.split("|")[1:-1]]
                sep = "".join(cells).replace("-", "").replace(":", "").replace(" ", "")
                if sep == "":
                    continue
                data.append([Paragraph(escape(c), cell_style) for c in cells])
            if data:
                ncols = len(data[0])
                col_w = (170 * mm) / max(ncols, 1)
                t = Table(data, colWidths=[col_w] * ncols)
                t.setStyle(
                    TableStyle(
                        [
                            ("GRID", (0, 0), (-1, -1), 0.25, colors.grey),
                            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#edeaf7")),
                            ("VALIGN", (0, 0), (-1, -1), "TOP"),
                            ("LEFTPADDING", (0, 0), (-1, -1), 4),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                        ]
                    )
                )
                story.append(Spacer(1, 4))
                story.append(t)
                story.append(Spacer(1, 8))
            continue

        # Lista con prefijo
        m = re.match(r"^(\s*)([-*]|\d+\.)\s+(.*)$", line)
        if m:
            txt = escape(m.group(3))
            story.append(Paragraph(f"• {txt}", body))
            continue

        # Párrafo normal (quitar ** markdown simple)
        plain = re.sub(r"\*\*(.+?)\*\*", r"\1", line)
        story.append(Paragraph(escape(plain), body))

    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            escape(
                "Documento generado automáticamente desde docs/RESUMEN_MULTIMEDIA_TYCOON.md"
            ),
            small,
        )
    )
    return story


def main():
    if not MD_PATH.is_file():
        raise SystemExit(f"No existe {MD_PATH}")

    font_name = register_font()
    md_text = MD_PATH.read_text(encoding="utf-8")
    story = md_to_flowables(md_text, font_name)

    doc = SimpleDocTemplate(
        str(OUT_PATH),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="Multimedia Tycoon — Resumen técnico",
        author="Proyecto educativo",
    )
    doc.build(story)
    print(f"PDF generado: {OUT_PATH}")


if __name__ == "__main__":
    main()
