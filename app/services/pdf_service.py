from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from datetime import datetime
import os
from app.core.config import settings

class PDFService:
    @staticmethod
    def generate_project_report(project_data: dict, filename: str) -> str:
        # 1. Infrastructure: Ensure reports vault exists
        if not os.path.exists(settings.REPORTS_DIR):
            os.makedirs(settings.REPORTS_DIR)

        filepath = os.path.join(settings.REPORTS_DIR, filename)
        c = canvas.Canvas(filepath, pagesize=letter)
        width, height = letter
        
        # ── 2. BRANDED HEADER SHELL ──
        c.setFillColor(colors.HexColor("#0F172A")) # Slate-900 Ambient
        c.rect(0, height - 100, width, 100, fill=1)
        
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 26)
        c.drawString(40, height - 55, "ARCHITECTURAL COST ENGINE")
        
        c.setFont("Helvetica", 10)
        c.setFillColor(colors.HexColor("#94A3B8"))
        c.drawString(40, height - 75, "2026 AI-DRIVEN PROJECT VALUATION PORTAL")
        c.drawRightString(width - 40, height - 55, f"INDEX DATE: {datetime.now().strftime('%d-%m-%Y')}")
        
        # ── 3. PROJECT IDENTITY BLOCK ──
        c.setFillColor(colors.black)
        c.setFont("Helvetica-Bold", 18)
        y = height - 140
        c.drawString(40, y, f"Project Profile: {project_data['project_type'].replace('_', ' ').title()}")
        
        y -= 40
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(colors.HexColor("#64748B"))
        c.drawString(40, y, "CLIENT CONFIGURATION SUMMARY")
        y -= 25
        
        c.setFont("Helvetica", 11)
        c.setFillColor(colors.black)
        inputs = project_data['input_json']
        
        # Grid-like input summary
        input_count = 0
        for key, value in inputs.items():
            if key in ["client_name", "signature"]: continue
            if input_count % 2 == 0:
                c.drawString(50, y, f"• {key.replace('_', ' ').title()}:")
                c.setFont("Helvetica-Bold", 11)
                c.drawString(200, y, str(value))
                c.setFont("Helvetica", 11)
            else:
                c.drawString(320, y, f"• {key.replace('_', ' ').title()}:")
                c.setFont("Helvetica-Bold", 11)
                c.drawString(470, y, str(value))
                c.setFont("Helvetica", 11)
                y -= 22
            input_count += 1
        
        if input_count % 2 != 0: y -= 22
            
        # ── 4. TOTAL INVESTMENT HUD ──
        y -= 30
        c.setStrokeColor(colors.HexColor("#E2E8F0"))
        c.setLineWidth(1)
        c.line(40, y, width - 40, y)
        
        y -= 45
        c.roundRect(40, y - 15, width - 80, 60, 12, fill=0)
        c.setFont("Helvetica-Bold", 14)
        c.drawString(60, y + 15, "TOTAL ESTIMATED INVESTMENT")
        c.setFont("Helvetica-Bold", 28)
        c.setFillColor(colors.HexColor("#0F172A"))
        c.drawRightString(width - 60, y - 5, f"INR {project_data['total_cost']:,.2f}")

        # ── 5. DETAILED BOQ BREAKDOWN ──
        y -= 60
        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(colors.HexColor("#64748B"))
        c.drawString(40, y, "BILL OF QUANTITIES (BOQ) BREAKDOWN")
        y -= 30

        # Handle items list correctly
        items = project_data['breakdown_json'].get('items', [])
        c.setFont("Helvetica", 10)
        
        for item in items:
            if y < 150: # Trigger new page if overflow
                c.showPage()
                y = height - 50
                c.setFont("Helvetica", 10)

            c.setFillColor(colors.HexColor("#F1F5F9"))
            c.rect(40, y - 5, width - 80, 18, fill=1, stroke=0)
            
            c.setFillColor(colors.black)
            c.drawString(50, y, item['component'])
            c.drawRightString(width - 50, y, f"INR {item['amount']:,.2f}")
            y -= 22
            
        # ── 6. AUTHORIZATION BLOCK (Digital Signature) ──
        if y < 200:
            c.showPage()
            y = height - 50

        y -= 40
        c.setStrokeColor(colors.HexColor("#CBD5E1"))
        c.line(40, y, width - 40, y)
        y -= 30
        
        c.setFont("Helvetica-Bold", 12)
        c.drawString(40, y, "DIGITAL AUTHORIZATION")
        
        client_name = inputs.get("client_name", "Authorized Signatory")
        y -= 60
        
        c.setFont("Helvetica", 10)
        c.drawString(40, y, "Client Name:")
        c.setFont("Helvetica-Bold", 14)
        c.drawString(40, y - 20, str(client_name))
        
        # Render Digital Signature if present (base64 dataURL)
        signature_data = inputs.get("signature")
        if signature_data and signature_data.startswith("data:image"):
            try:
                import base64
                from io import BytesIO
                from reportlab.lib.utils import ImageReader
                
                # Strip metadata header
                header, encoded = signature_data.split(",", 1)
                img_data = base64.b64decode(encoded)
                img = ImageReader(BytesIO(img_data))
                
                # Draw the signature as an image
                c.drawImage(img, width - 240, y - 60, width=200, height=80, mask='auto', preserveAspectRatio=True)
                c.setStrokeColor(colors.lightgrey)
                c.line(width - 240, y - 65, width - 40, y - 65)
                c.setFont("Helvetica-Oblique", 8)
                c.drawRightString(width - 40, y - 75, "Digitally Verified via Mouse/Touchpad")
            except Exception as e:
                pass
        
        # FINAL FOOTER
        c.setFont("Helvetica-Oblique", 8)
        c.setFillColor(colors.grey)
        c.drawCentredString(width/2, 30, "Generated by Construction AI Cost Estimator - For Professional Planning Only")
        
        c.save()
        return filepath
