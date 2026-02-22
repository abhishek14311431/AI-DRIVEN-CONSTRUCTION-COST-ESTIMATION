# 🏗️ Construction AI Cost Estimator

A premium, AI-driven construction cost estimation platform built with **FastAPI** and **React**. This application provides architectural-grade valuations with a high-density "Liquid Glass" user interface.

## 🚀 Key Features
- **Smart Breakdown Engine**: 18-Component distribution based on civil engineering ratios.
- **Dynamic Logic**: Adjusts costs based on plot size, bedroom count, floor height, and plan quality.
- **Real-time Animations**: CountUp financial engines for live valuation updates.
- **Premium Aesthetics**: Multi-layered backdrop blur, neon HUD elements, and deep-space theme.

## 🧠 DSA Concepts Used

| DSA Concept | Implementation Area | File Path |
| :--- | :--- | :--- |
| **Priority Queue (Max-Heap)** | Sorting the cost breakdown by "Highest Cost First" to prioritize structural visibility. | `app/engines/breakdown_engine.py` |
| **Hash Maps (Dictionaries)** | O(1) constant-time lookups for plot rules, material rates, and category configuration. | `app/core/constants.py` |
| **Stateful Iteration** | Management of multi-step wizard logic and input synthesis. | `frontend/src/pages/ProjectWizard.jsx` |
| **Normalization Algorithms** | Re-calculating percentage weights dynamically after plan multipliers are applied. | `app/engines/breakdown_engine.py` |
| **Conditional Control Flow** | Complex decision branching for optional features (Compound, Rainwater, etc.). | `app/engines/own_house_engine.py` |
| **Linear Time (O(N)) Mapping** | Rendering high-density intelligence grids from backend JSON payloads. | `frontend/src/pages/ProjectWizard.jsx` |

## ⚡ Performance Optimizations
- **IPv4 Hardcoding**: API calls use `127.0.0.1` instead of `localhost` to bypass Windows DNS resolution lag.
- **Stateless Estimation**: The `/estimate` route is decoupled from the database to ensure sub-millisecond calculation speeds.
- **Animation Scaling**: Perceived performance enhanced with 800ms tweening for financial tickers.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, CSS (Glassmorphism)
- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: SQLite (Default for High Availability)
- **Logic**: 2026 Smart Breakdown Engine
