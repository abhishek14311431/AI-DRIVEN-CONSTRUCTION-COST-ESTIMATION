# AI-Driven Construction Cost Estimation

An end-to-end platform for construction cost estimation with multi-project workflows, configurable pricing engines, market-inflation adjustments, smart upgrade logic, and project archival.

## Project Phases Completed

### Phase 1: Core Foundation and Architecture
- Project structure established for backend, frontend, datasets, and services.
- FastAPI app initialization with versioned API namespace.
- React single-page frontend initialized with Vite.

### Phase 2: Estimation Engine Implementation
- Independent engines implemented for Own House, Rental, Villa, Commercial, Interior, and Exterior.
- Breakdown engine added for itemized component-level cost output.
- Inflation-aware and multiplier-based valuation logic integrated.

### Phase 3: API and Validation Layer
- REST endpoints created for estimate and save operations per project type.
- Pydantic schemas added for payload validation and typed responses.
- Generic project routes implemented for save/list/fetch/delete and PDF download.

### Phase 4: Interactive Frontend Workflows
- Dashboard, Project Selection, and multi-step Project Wizard implemented.
- Dynamic form flows per project type using centralized configuration.
- Real-time estimation requests and visual result presentation integrated.

### Phase 5: Smart Upgrade and Advanced UX
- Smart upgrade flow integrated for higher-grade recommendations.
- Rich UI with animated cards, progress flow, and detailed review/summary sections.
- Signature-based save confirmation and archives view added.

### Phase 6: Data Persistence and Reporting
- Database session/model/service layers integrated with SQLAlchemy.
- Project archive retrieval and deletion completed.
- PDF report generation and download endpoint integrated.

### Phase 7: Rental Flow Enhancement
- Rental flow updated with Site Type + Plot Dimensions on a shared screen.
- Floors + Grade merged into one step.
- Additional details, review, interior selection, project specs, and final estimation sequence structured.

### Phase 8: Dataset-Driven Interior and Exterior Estimation
- Interior and Exterior workflows expanded for style-based estimation.
- Dataset style categories integrated into selection flow.
- Area-based and feature-toggle-based cost logic added with structured breakdown response.

## Complete Technology Stack

### Backend
- Language: Python 3.9+
- API Framework: FastAPI
- ASGI Server: Uvicorn
- Data Validation: Pydantic, pydantic-settings
- ORM and DB Layer: SQLAlchemy
- DB Driver Support: psycopg2-binary (PostgreSQL driver support), SQLite used in local setup
- Migrations: Alembic
- File Upload/Form Handling: python-multipart
- Environment Management: python-dotenv
- PDF Generation: reportlab

### Frontend
- Framework: React 19
- Rendering: react-dom
- Build Tool: Vite 7
- Language: JavaScript (ES Modules)
- State Management: React Hooks (useState/useEffect)
- Networking: Browser Fetch API
- Styling: Custom CSS (glassmorphism-inspired UI, responsive layouts)
- Linting: ESLint, eslint-plugin-react-hooks, eslint-plugin-react-refresh

### Data and ML-Related Assets
- Dataset Organization: folder-based class structure for style categories
- Labels: CSV label mapping for test dataset
- Categories in dataset: asian, coastal, contemporary, craftsman, eclectic, farmhouse, french-country, industrial, mediterranean, mid-century-modern, modern, rustic, scandinavian, shabby-chic-style, southwestern, traditional, transitional, tropical, victorian

### Persistence and Reporting
- Project save/list/delete/fetch APIs
- Structured cost breakdown JSON storage
- PDF report path management and file download route

### Development and DevOps Tooling
- Version Control: Git + GitHub
- Package Managers: pip, npm
- Local Runtime: Python virtual environment and Node.js runtime

## Key Modules

- Backend app entry: app/main.py
- API routes: app/api/routes
- Cost engines: app/engines
- Validation schemas: app/schemas
- DB setup and session: app/database
- Business services: app/services
- Frontend app shell: frontend/src/App.jsx
- Wizard and flows: frontend/src/pages/ProjectWizard.jsx
- Project flow configuration: frontend/src/constants/projectConfigs.js

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm

### Backend

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m app.main
```

Backend URL:
- http://localhost:8080
- Swagger docs: http://localhost:8080/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:
- http://localhost:5173

## API Surface Overview

- POST /api/v1/own-house/estimate
- POST /api/v1/rental/estimate
- POST /api/v1/villa/estimate
- POST /api/v1/commercial/estimate
- POST /api/v1/interior/estimate
- POST /api/v1/exterior/estimate
- POST /api/v1/projects/save
- GET /api/v1/projects
- GET /api/v1/projects/{project_id}
- GET /api/v1/projects/{project_id}/download-pdf
- DELETE /api/v1/projects/{project_id}

## Environment Variables

Create a .env file in project root:

```env
DATABASE_URL=sqlite:///./test.db
PYTHONUNBUFFERED=1
```

## License

MIT
