from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Image, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

OUT = "/home/ubuntu/webdev-static-assets/curriculo-pablo-guilherme-profissional.pdf"
PHOTO = "/home/ubuntu/webdev-static-assets/pablo-guilherme-retrato-profissional.png"
PAGE_W, PAGE_H = A4
NAVY = colors.HexColor("#07111f")
INK = colors.HexColor("#102033")
BLUE = colors.HexColor("#19bfe8")
CYAN = colors.HexColor("#0e7490")
MUTED = colors.HexColor("#526579")
PALE = colors.HexColor("#e9f8fc")

try:
    pdfmetrics.registerFont(TTFont("DejaVu", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
    pdfmetrics.registerFont(TTFont("DejaVu-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
    FONT, BOLD = "DejaVu", "DejaVu-Bold"
except Exception:
    FONT, BOLD = "Helvetica", "Helvetica-Bold"

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="ResumeSmall", fontName=FONT, fontSize=8.5, leading=12, textColor=MUTED))
styles.add(ParagraphStyle(name="ResumeBody", fontName=FONT, fontSize=9.5, leading=14, textColor=INK))
styles.add(ParagraphStyle(name="ResumeSection", fontName=BOLD, fontSize=9, leading=12, textColor=CYAN, spaceBefore=6, spaceAfter=4))
styles.add(ParagraphStyle(name="ResumeTitle", fontName=BOLD, fontSize=27, leading=29, textColor=colors.white))
styles.add(ParagraphStyle(name="ResumeSubtitle", fontName=FONT, fontSize=10, leading=14, textColor=colors.HexColor("#b8eaf5")))
styles.add(ParagraphStyle(name="ResumeCardTitle", fontName=BOLD, fontSize=10.5, leading=13, textColor=INK))
styles.add(ParagraphStyle(name="ResumeCardBody", fontName=FONT, fontSize=8.5, leading=12, textColor=MUTED))

class ResumeDocTemplate(SimpleDocTemplate):
    def afterPage(self):
        canvas = self.canv
        canvas.saveState()
        canvas.setFillColor(NAVY)
        canvas.rect(0, PAGE_H - 54 * mm, PAGE_W, 54 * mm, fill=1, stroke=0)
        canvas.setFillColor(BLUE)
        canvas.rect(0, PAGE_H - 54 * mm, 6 * mm, 54 * mm, fill=1, stroke=0)
        canvas.setFillColor(colors.HexColor("#d7f7ff"))
        canvas.setFont(FONT, 7)
        canvas.drawRightString(PAGE_W - 18 * mm, 10 * mm, f"PABLO GUILHERME  /  PORTFÓLIO  /  {canvas.getPageNumber():02d}")
        canvas.restoreState()


doc = ResumeDocTemplate(OUT, pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm, topMargin=55 * mm, bottomMargin=16 * mm)
story = []

photo = Image(PHOTO, width=31 * mm, height=39 * mm)
photo.hAlign = "RIGHT"
header_text = [
    Paragraph("PABLO GUILHERME", styles["ResumeTitle"]),
    Spacer(1, 2 * mm),
    Paragraph("Tecnologia · Conteúdo · Audiovisual", styles["ResumeSubtitle"]),
    Spacer(1, 2 * mm),
    Paragraph("Estudante de Tecnologia da Informação com repertório aplicado em interfaces, narrativa visual, captação terrestre e imagens aéreas.", styles["ResumeSubtitle"]),
]
header = Table([[header_text, photo]], colWidths=[139 * mm, 34 * mm])
header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
story.append(header)
story.append(Spacer(1, 5 * mm))

contact = Table([[Paragraph("Águas Lindas · Planaltina · Entorno", styles["ResumeSmall"]), Paragraph('<link href="https://instagram.com/pablogui000" color="#0e7490">instagram.com/pablogui000</link>', styles["ResumeSmall"]), Paragraph(f'<link href="https://wa.me/5561992903029" color="#0e7490">WhatsApp: (61) 99293-03029</link>', styles["ResumeSmall"]), Paragraph('<link href="https://t.me/mpjmarketing" color="#0e7490">Telegram: t.me/mpjmarketing</link>', styles["ResumeSmall"])]], colWidths=[48 * mm, 44 * mm, 43 * mm, 41 * mm])
contact.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
story.append(contact)
story.append(Spacer(1, 4 * mm))

story.append(Paragraph("PERFIL", styles["ResumeSection"]))
story.append(Paragraph("Organizo ideias e imagens para que um projeto seja entendido, visto e lembrado. Meu trabalho combina curiosidade técnica, cuidado com a narrativa e execução prática — da primeira referência à entrega pronta para circular.", styles["ResumeBody"]))

story.append(Paragraph("COMPETÊNCIAS", styles["ResumeSection"]))
competencies = [
    [Paragraph("Tecnologia e produto", styles["ResumeCardTitle"]), Paragraph("HTML · CSS · JavaScript · Python · interfaces · organização de informação", styles["ResumeCardBody"])],
    [Paragraph("Conteúdo e narrativa", styles["ResumeCardTitle"]), Paragraph("Roteiro · edição · vídeo vertical · ritmo · direção · presença digital", styles["ResumeCardBody"])],
    [Paragraph("Imagem e captação", styles["ResumeCardTitle"]), Paragraph("Drone · câmera · composição · planos aéreos · registro terrestre", styles["ResumeCardBody"])],
]
comp_table = Table(competencies, colWidths=[51 * mm, 122 * mm], rowHeights=[13 * mm] * 3)
comp_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), PALE), ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#b9e5ef")), ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#c9eaf0")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm)]))
story.append(comp_table)

story.append(Paragraph("ATUAÇÃO", styles["ResumeSection"]))
services = [
    [Paragraph("Filmagem aérea", styles["ResumeCardTitle"]), Paragraph("Perspectiva, escala e movimento para revelar o espaço.", styles["ResumeCardBody"]), Paragraph("9:16 · 16:9", styles["ResumeCardBody"])],
    [Paragraph("Captação terrestre", styles["ResumeCardTitle"]), Paragraph("Pessoas, detalhes e atmosfera em registros com presença.", styles["ResumeCardBody"]), Paragraph("Reels · aftermovie", styles["ResumeCardBody"])],
    [Paragraph("Criação de conteúdo", styles["ResumeCardTitle"]), Paragraph("Peças verticais e narrativas curtas prontas para circular.", styles["ResumeCardBody"]), Paragraph("15–60 s / peça", styles["ResumeCardBody"])],
]
service_table = Table(services, colWidths=[45 * mm, 94 * mm, 34 * mm])
service_table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), colors.white), ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#d7e1e8")), ("INNERGRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#e1e8ed")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm), ("TOPPADDING", (0, 0), (-1, -1), 2 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm)]))
story.append(service_table)

story.append(Paragraph("FORMAÇÃO E DIREÇÃO", styles["ResumeSection"]))
story.append(Paragraph("Estudante de Tecnologia da Informação · aprendizagem contínua · trabalho orientado por clareza, prática e melhoria constante. Disponível para projetos de conteúdo, imagem, audiovisual e experiências digitais em Águas Lindas, Planaltina e Entorno.", styles["ResumeBody"]))
story.append(Spacer(1, 3 * mm))
cta = Table([[Paragraph("Vamos transformar uma ideia em algo claro, útil e pronto para circular?", styles["ResumeCardTitle"]), Paragraph('<link href="https://wa.me/5561992903029?text=Olá%2C%20Pablo%21%20Vi%20seu%20currículo%20e%20gostaria%20de%20conversar." color="#0e7490">Conversar pelo WhatsApp →</link>', styles["ResumeCardBody"])]], colWidths=[115 * mm, 58 * mm])
cta.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), PALE), ("BOX", (0, 0), (-1, -1), 0.6, BLUE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm), ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm), ("TOPPADDING", (0, 0), (-1, -1), 4 * mm), ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm)]))
story.append(cta)

doc.build(story)
print(OUT)
