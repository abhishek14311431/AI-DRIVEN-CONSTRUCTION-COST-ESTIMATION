# 🏗️ AI-Driven Construction Cost Estimation

A comprehensive AI-powered construction cost estimation platform that provides precise project valuations using advanced algorithms and real-time market analysis. Perfect for architects, builders, and construction companies to estimate project costs accurately.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![React](https://img.shields.io/badge/React-18+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Features

### 🎯 Core Functionality
- **Multi-Project Type Support**: Own House, Commercial, Villa, Rental, Exterior, Interior
- **Smart Upgrade System**: AI-powered suggestions for Classic, Premium, and Elite grade upgrades
- **Detailed Cost Breakdown**: Component-wise cost analysis with percentage allocation
- **Market Analysis**: Real-time 2026 market dynamics and inflation factors
- **Project Archive**: Save and retrieve previous project valuations
- **PDF Reports**: Generate professional cost estimation reports

### 🤖 AI Features
- **Smart Upgrade Module**: Evaluates current configuration and suggests grade upgrades
- **Market-Driven Valuation**: Analyzes market trends and construction indices
- **Dynamic Pricing**: Inflation margins and market escalation factors
- **Breakdown Engine**: Detailed component-wise cost estimation

### 🎨 User Interface
- **Modern Design**: Glassmorphism UI with liquid glass panels
- **Interactive Wizard**: Step-by-step project configuration
- **Real-time Updates**: Live cost calculations
- **Responsive Layout**: Works on desktop and tablet devices

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/abhishek14311431/AI-DRIVEN-CONSTRUCTION-COST-ESTIMATION.git
cd AI-DRIVEN-CONSTRUCTION-COST-ESTIMATION
```

#### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app/main.py
```

Backend will run on: `http://localhost:8080`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 📁 Project Structure

```
AI-Driven Construction Cost Estimation/
├── app/                          # Backend application
│   ├── api/routes/              # API endpoints
│   │   ├── own_house.py
│   │   ├── commercial.py
│   │   ├── villa.py
│   │   ├── rental.py
│   │   ├── exterior.py
│   │   ├── interior.py
│   │   └── projects.py
│   ├── engines/                 # Cost estimation engines
│   │   ├── own_house_engine.py
│   │   ├── commercial_engine.py
│   │   ├── breakdown_engine.py
│   │   └── ...
│   ├── models/                  # SQLAlchemy models
│   │   ├── project.py
│   │   ├── saved_project.py
│   │   └── ...
│   ├── schemas/                 # Pydantic schemas
│   │   ├── own_house_schema.py
│   │   └── ...
│   ├── services/                # Business logic
│   │   ├── project_service.py
│   │   └── pdf_service.py
│   ├── core/                    # Configuration
│   │   ├── config.py
│   │   └── constants.py
│   ├── database/                # Database setup
│   │   ├── session.py
│   │   └── base.py
│   └── main.py                  # FastAPI app entry point
│
├── frontend/                    # React Vite application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProjectSelection.jsx
│   │   │   ├── ProjectWizard.jsx
│   │   │   ├── EstimationResult.jsx
│   │   │   ├── UpgradesPage.jsx
│   │   │   └── Archives.jsx
│   │   ├── components/         # Reusable components
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── ExteriorSelector.jsx
│   │   │   └── InteriorSelector.jsx
│   │   ├── constants/          # Project configurations
│   │   │   └── projectConfigs.js
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css
│   │   └── index.css           # Global styles
│   ├── public/                 # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── exterior_dataset/           # Exterior design styles
└── interior_dataset/           # Interior design styles
```

---

## 🔌 API Endpoints

### Own House
- `POST /api/v1/own-house/estimate` - Get cost estimation
- `POST /api/v1/own-house/save` - Save project

### Commercial
- `POST /api/v1/commercial/estimate` - Get cost estimation
- `POST /api/v1/commercial/save` - Save project

### Similar endpoints for:
- `/api/v1/villa`
- `/api/v1/rental`
- `/api/v1/exterior`
- `/api/v1/interior`

### Projects
- `GET /api/v1/projects` - List all saved projects
- `GET /api/v1/projects/{id}` - Get project details
- `DELETE /api/v1/projects/{id}` - Delete project

---

## 💻 Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: SQLite (SQLAlchemy ORM)
- **Validation**: Pydantic
- **PDF Generation**: reportlab
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS with Glassmorphism effects
- **HTTP Client**: Fetch API
- **UI State**: React Hooks (useState, useEffect)

---

## 📊 Smart Upgrade Feature

The Smart Upgrade system evaluates your current configuration and suggests enhancements:

### Grade Levels
1. **Classic** (Base + Standard Upgrades)
   - Enhanced finishes
   - Better materials
   - ~30% cost increase

2. **Premium** (Classic + Premium Features)
   - Premium fixtures
   - Enhanced automation
   - ~60% cost increase

3. **Elite** (Full Luxury)
   - Top-tier materials
   - Advanced systems
   - ~100% cost increase

### Editable Upgrades
Each grade includes customizable facilities:
- Sanitary fixtures
- Electrical systems
- Flooring options
- Finishing details
- And more...

---

## 🎯 Usage

### Creating a Project
1. **Dashboard** → Start estimation
2. **Project Selection** → Choose project type (Own House, Commercial, etc.)
3. **Wizard** → Configure step-by-step:
   - Plot dimensions
   - Building specifications
   - Interior preferences
   - Additional details
4. **Estimation** → View detailed cost breakdown
5. **Market Analysis** → Review 2026 market insights
6. **Smart Upgrade** → Explore upgrade options

### Smart Upgrades
1. Click "Yes" to Smart Upgrades prompt
2. Choose grade (Classic, Premium, or Elite)
3. Navigate to Upgrades page
4. Toggle desirable facilities
5. Finalize to update costs

### Saving Projects
- Click "SECURE THIS VALUATION" to save
- Access via Archives tab later
- Download PDF reports

---

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL=sqlite:///./test.db
PYTHONUNBUFFERED=1
```

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

