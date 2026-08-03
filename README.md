# AI-Driven Construction Cost Estimation

Construction cost estimation platform with a FastAPI backend, a Vite + React frontend, dataset assets for style-based workflows, and deployment settings for Render and Vercel.

## Overview

The repository is organized around two runnable application roots:

- `app/` is the primary FastAPI backend used by the root deployment config and local backend runs.
- `frontend/` is the Vite application and should be the Vercel project root.

There is also a `backend/` folder that contains a secondary backend scaffold and requirements file. The production backend entrypoint used by `render.yaml` is `app/main.py`.

## Features

- Multi-project estimation flows for own house, commercial, villa, rental, exterior, and interior projects.
- Smart upgrade flows with Classic, Premium, and Elite levels.
- Detailed breakdowns and saved project archives.
- PDF report generation.
- Exterior and interior dataset folders for style-aware workflows.

## Repository Structure

```text
.
├── app/
│   ├── api/routes/
│   ├── core/
│   ├── database/
│   ├── engines/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── main.py
├── backend/
│   ├── app/
│   └── requirements.txt
├── dataset/
│   ├── train/dataset_train/
│   └── test/dataset_test/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
├── requirements.txt
├── render.yaml
├── start.bat
└── README.md
```

## Local Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm

### Backend

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app/main.py
```

The backend runs on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Deployment Notes

- Render backend command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Render build command: `pip install -r requirements.txt`
- Vercel project root should be `frontend/`
- Vercel build command: `npm run build`
- Vercel install command: `npm install`

## API Routes

The FastAPI app exposes these route groups under `/api/v1`:

- `/own-house`
- `/rental`
- `/villa`
- `/commercial`
- `/interior`
- `/exterior`
- `/projects`

Root health check:

```text
GET /
```

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Uvicorn
- reportlab

### Frontend

- React 19
- Vite 7
- ESLint 8
- Fetch API

## Configuration

Create a `.env` file in the repository root if you want to override the default database location:

```env
DATABASE_URL=sqlite:///./test.db
PYTHONUNBUFFERED=1
```

## Notes

- Generated directories such as `.venv/`, `venv/`, `frontend/node_modules/`, and `frontend/dist/` are intentionally ignored and should not be committed.
- If you redeploy on Vercel, make sure the project root points to `frontend/` so it installs the correct dependencies.

### API Base URL
Frontend communicates via: `http://localhost:8080/api/v1`

---

## 🧪 Testing

```bash
# Backend tests
pytest app/

# Frontend tests
cd frontend
npm test
```

---

## 📝 Recent Updates

### Smart Upgrade Implementation
- ✅ Yes/No prompt for upgrades
- ✅ Grade selection (Classic, Premium, Elite)
- ✅ Editable upgrade facilities
- ✅ Dynamic cost calculation
- ✅ Market Analysis integration

### Code Cleanup
- Removed debug statements
- Removed unnecessary comments
- Optimized component rendering
- Fixed state management

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Contact & Support

For issues, questions, or suggestions:
- GitHub Issues: [Create an issue](https://github.com/abhishek14311431/AI-DRIVEN-CONSTRUCTION-COST-ESTIMATION/issues)
- Email: abhishek14311431@mail.com

---

## 🎉 Acknowledgments

- FastAPI community for excellent documentation
- React and Vite teams for powerful tools
- Construction industry experts for domain knowledge
- Contributors and users for feedback

---

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time market data integration
- [ ] Advanced financial forecasting
- [ ] Multi-currency support
- [ ] Collaborative team features
- [ ] Advanced analytics dashboard
- [ ] Integration with suppliers
- [ ] AI-powered design suggestions

---

**Last Updated**: March 6, 2026  
**Version**: 2.0.0 - Smart Upgrade Release

