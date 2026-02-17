import sys
import time
from typing import Any, Dict

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .models.request_schema import EstimateRequest
from .engines.rental_engine import RentalEngine
from .engines.ownhouse_engine import OwnHouseEngine
from .engines.breakdown_engine import BreakdownEngine
from .engines.xai_engine import XAIEngine
from .report.pdf_generator import PDFGenerator
from .database.db import init_db
from .upgrade_suggestions import generate_upgrade_suggestions

init_db()

app = FastAPI(title="AI Construction Cost Estimation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from .engines.commercial_engine import CommercialEngine
from .engines.villa_engine import VillaEngine
from .engines.interior_engine import InteriorEngine
from .engines.exterior_engine import ExteriorEngine


@app.post("/estimate")
async def estimate(request: EstimateRequest) -> Dict[str, Any]:
	try:
		print("\n" + "="*50)
		print("[API] REQUEST RECEIVED")
		print("="*50)
		start_time = time.time()
		payload = request.dict()
		print(f"[PAYLOAD] RAW: {payload}")

		project_type = payload["project_type"]
		plot_size = payload["plot_size"]
		if plot_size in ["full-site", "half-site", "double-site"] and payload.get("dimensions"):
			print(f"[NORM] plot_size '{plot_size}' -> dimensions '{payload['dimensions']}'")
			plot_size = payload["dimensions"]

		floors_raw = payload["floors"]
		floors = 1
		if isinstance(floors_raw, int):
			floors = floors_raw
		elif isinstance(floors_raw, str):
			if "g+" in floors_raw.lower():
				try:
					floors = int(floors_raw.lower().replace("g+", "")) + 1
					print(f"[PARSE] floors '{floors_raw}' -> {floors}")
				except:
					floors = 1
			else:
				try:
					floors = int(floors_raw)
				except:
					floors = 1

		zone = payload.get("zone", "Zone 1")
		
		selected_tier_raw = payload["selected_tier"]
		selected_tier = selected_tier_raw.capitalize() if selected_tier_raw else "Basic"
		if selected_tier == "Base":
			selected_tier = "Basic"
		print(f"[TIER] '{selected_tier_raw}' -> '{selected_tier}'")

		site_type = payload.get("site_type", "full")
		family_details = payload["family_details"]
		lift_required = payload.get("lift_required", False)
		generate_pdf = payload.get("generate_pdf", False)
		upgrades = payload.get("upgrades", {})
		interior = payload.get("interior", None)

		print(f"[PROC] Processing '{project_type}' project...")

		base_calc_start = time.time()
		
		engine_project_type = project_type
		if project_type in ["dream-house", "own-house"]:
			engine_project_type = "own_house"
		elif project_type in ["rental-homes", "rental"]:
			engine_project_type = "rental"
		elif project_type == "villa":
			engine_project_type = "villas"
		elif project_type == "interiors":
			engine_project_type = "interior"
		elif project_type == "exteriors":
			engine_project_type = "exterior"
			
		print(f"[ENGINE] Project Type: {engine_project_type}")

		if engine_project_type == "rental":
			base_result = RentalEngine(plot_size, floors, lift_required, site_type, family_details).calculate_rental_cost()
		elif engine_project_type == "own_house":
			base_result = OwnHouseEngine(plot_size, floors, lift_required, site_type, family_details).calculate_ownhouse_cost()
		elif engine_project_type == "commercial":
			base_result = CommercialEngine(plot_size, floors, lift_required, site_type, family_details).calculate_commercial_cost()
		elif engine_project_type == "villas":
			base_result = VillaEngine(plot_size, floors, lift_required, site_type, family_details).calculate_villa_cost()
		elif engine_project_type == "interior":
			base_result = InteriorEngine(plot_size, floors, site_type, family_details).calculate_interior_cost()
		elif engine_project_type == "exterior":
			base_result = ExteriorEngine(plot_size, floors, site_type, family_details).calculate_exterior_cost()
		else:
			print(f"[WARN] Unknown project type '{project_type}', defaulting to own_house logic")
			base_result = OwnHouseEngine(plot_size, floors, lift_required, site_type, family_details).calculate_ownhouse_cost()

		if upgrades:
			base_result["upgrades"] = upgrades
		if interior:
			base_result["interior_package"] = interior
			
		base_result["compound_wall_required"] = payload.get("compound_wall", False)
		base_result["rain_water_harvesting_required"] = payload.get("rain_water_harvesting", False)

		base_calc_time = time.time() - base_calc_start
		print(f"[TIME] Base calculation: {base_calc_time:.2f}s")

		breakdown_start = time.time()
		breakdown = BreakdownEngine(base_result, selected_tier).generate_final_breakdown()
		breakdown_time = time.time() - breakdown_start
		print(f"[TIME] Breakdown generation: {breakdown_time:.2f}s")

		explanation_start = time.time()
		explanation = XAIEngine(breakdown).generate_explanation()
		explanation_time = time.time() - explanation_start
		print(f"[TIME] AI explanation: {explanation_time:.2f}s")

		breakdown["selected_tier"] = selected_tier

		pdf_generated = False
		if generate_pdf:
			pdf_payload = breakdown.copy()
			pdf_payload["explanation"] = explanation
			
			pdf_start = time.time()
			pdf = PDFGenerator(pdf_payload, "estimation_report.pdf")
			pdf.generate_pdf()
			pdf_time = time.time() - pdf_start
			print(f"[TIME] PDF generation: {pdf_time:.2f}s")
			pdf_generated = True

		upgrade_start = time.time()
		upgrade_suggestions = generate_upgrade_suggestions(
			breakdown, selected_tier,
			family_details=family_details,
			lift_required=lift_required,
			project_type=engine_project_type
		)
		upgrade_suggestions_time = time.time() - upgrade_start
		print(f"[TIME] Upgrade suggestions: {upgrade_suggestions_time:.2f}s")

		total_time = time.time() - start_time
		print(f"[DONE] TOTAL TIME: {total_time:.2f}s")
		print("="*50 + "\n")
		return {
			"breakdown": breakdown, 
			"explanation": explanation, 
			"upgrade_suggestions": upgrade_suggestions, 
			"pdf_generated": pdf_generated
		}

	except ValueError as exc:
		print(f"[ERR] ValueError: {str(exc)}")
		raise HTTPException(status_code=400, detail=str(exc))
	except HTTPException as exc:
		print(f"[ERR] HTTPException: {str(exc)}")
		raise
	except Exception as e:
		print(f"[ERR] Unexpected: {str(e)}")
		import traceback
		traceback.print_exc()
		raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


from fastapi.responses import FileResponse, StreamingResponse
import io

@app.post("/generate-pdf")
async def generate_pdf_endpoint(payload: Dict[str, Any]):
	try:
		print("\n" + "="*50)
		print("[API] PDF GENERATION REQUEST")
		print("="*50)
		
		pdf_buffer = io.BytesIO()
		
		from .report.pdf_generator import PDFGenerator
		pdf = PDFGenerator(payload, pdf_buffer)
		pdf.generate_pdf()
		
		pdf_buffer.seek(0)
		
		filename = f"Cost_Estimate_{payload.get('project_type', 'Project')}.pdf"
		
		return StreamingResponse(
			pdf_buffer, 
			media_type="application/pdf", 
			headers={"Content-Disposition": f"attachment; filename={filename}"}
		)
	except Exception as e:
		print(f"[ERR] PDF Gen: {str(e)}")
		import traceback
		traceback.print_exc()
		raise HTTPException(status_code=500, detail=str(e))
