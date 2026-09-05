# FarmFlow AI

## Project Overview

FarmFlow AI is a demo-first agri-tech platform built for Smart India Hackathon 2026 (SIH26033). The solution helps reduce intermediary layers in agricultural supply chains by connecting farmers and FPOs directly with buyers using AI-based demand forecasting, dynamic pricing, matching, aggregation, and route optimization.

## Problem Statement

"Multiple intermediaries reduce farmers' earnings and increase consumer prices."

## Solution

FarmFlow AI creates a transparent direct-to-market marketplace that:

- predicts regional commodity demand
- recommends farm-gate and buyer-side pricing
- matches buyers with farmers using distance, availability, and quality criteria
- aggregates fragmented farmer supply into consolidated shipments
- optimizes delivery routes and reduces logistics waste
- offers traceability from farm-to-buyer

## Features

- Farmer / FPO dashboard
- Buyer marketplace with filters
- Admin analytics and impact dashboard
- AI demand forecasting
- AI price recommendation engine
- AI sellability score
- Matching engine and order aggregation
- Smart logistics optimization
- Price transparency comparison
- SIH Demo Mode with preloaded scenario
- Multilingual UI-ready labels and rural-friendly interface

## Architecture

- Frontend: React + TypeScript + Tailwind CSS + Recharts
- Backend: FastAPI
- AI logic: Python, NumPy, Pandas, scikit-learn
- Data: simulated Indian agricultural dataset
- Documentation: docs and architecture notes

## Technology Stack

- Frontend: React 19, Vite, Tailwind CSS
- Backend: FastAPI, Pydantic
- AI: Python, Pandas, NumPy, scikit-learn
- Visualization: Recharts
- Prototype data: simulated Indian agri market data

## AI Methodology

The prototype uses a demonstrative time-series and feature-based approach:

- historical demand patterns by crop and region
- season, quality, and supply indicators
- price elasticity and buyer availability logic
- demand score and sellability score calculations
- rule-based recommendation engine for prototype reliability

This is a prototype AI model and is clearly labelled as simulated data.

## Database Design

Core entities include:

- User
- Farmer
- FPO
- Buyer
- Produce
- Crop
- Order
- OrderItem
- Payment
- Shipment
- Vehicle
- Route
- DemandPrediction
- PricePrediction
- Notification
- TraceabilityEvent

See the schema in the database folder.

## API Documentation

Core API endpoints are implemented in the backend service and cover authentication, produce listing, ordering, matching, aggregation, routing, and analytics.

## Setup Instructions

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux / macOS
.venv\Scripts\activate     # Windows PowerShell
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Demo Credentials

- Farmer: farmer@demo.com
- Buyer: buyer@demo.com
- Admin: admin@demo.com

## Future Scope

- Real farmers and buyer onboarding
- Postgres persistence and auth
- Real map and route APIs
- Weather-aware demand forecasting
- Carbon and sustainability tracking
- SMS / voice listing for rural users

## Demo Note

This repository contains a functioning prototype with a demo-ready narrative, illustrative scenario calculations, and product screens for SIH presentation.
