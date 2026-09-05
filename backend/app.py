from fastapi import FastAPI
from pydantic import BaseModel
from typing import Any, Dict, List

app = FastAPI(title='FarmFlow AI API', version='1.0.0')

order_store: List[Dict[str, Any]] = []

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str | None = None

class ProduceRequest(BaseModel):
    crop: str
    quantity: float
    unit: str
    quality: str
    harvest_date: str
    farm_location: str
    expected_min_price: float
    available_from: str
    shelf_life_days: int

class OrderRequest(BaseModel):
    buyer_name: str
    buyer_type: str = 'Retailer'
    crop: str
    quantity: float
    grade: str = 'A'
    location: str
    required_by: str
    delivery_preference: str = 'Cold chain'
    consent_data: bool = True
    consent_ai: bool = True
    consent_commercial: bool = True
    notes: str = ''

@app.get('/')
def health():
    return {'status': 'FarmFlow AI backend running', 'demo_mode': True}

@app.post('/auth/login')
def login(payload: LoginRequest):
    allowed = {
        'farmer@demo.com': 'farmer',
        'buyer@demo.com': 'buyer',
        'admin@demo.com': 'admin',
    }
    role = allowed.get(payload.email)
    return {
        'success': True,
        'email': payload.email,
        'role': role or payload.role or 'demo',
        'message': 'Simulated authentication for prototype demo.'
    }

@app.get('/farmers')
def farmers():
    return [
        {'id': 1, 'name': 'Raj Kumar', 'location': 'Ludhiana, Punjab', 'crop': 'Tomato', 'available_kg': 1200, 'grade': 'A'},
        {'id': 2, 'name': 'Satish Yadav', 'location': 'Jaipur, Rajasthan', 'crop': 'Potato', 'available_kg': 900, 'grade': 'A'},
    ]

@app.get('/produce')
def produce_list():
    return [
        {'id': 1, 'crop': 'Tomato', 'quantity': 1200, 'grade': 'A', 'location': 'Ludhiana, Punjab', 'price': 22, 'harvest_date': '2026-09-18', 'seller': 'Raj Kumar', 'sellability_score': 86},
        {'id': 2, 'crop': 'Apple', 'quantity': 700, 'grade': 'A', 'location': 'Shimla, HP', 'price': 54, 'harvest_date': '2026-09-20', 'seller': 'Pawan Sharma', 'sellability_score': 88},
    ]

@app.post('/produce')
def create_produce(payload: ProduceRequest):
    return {
        'success': True,
        'message': 'Produce listed successfully',
        'ai_demand': 16100,
        'recommended_price_range': '₹22–24/kg',
        'sellability_score': 86,
        'potential_buyers': 7,
        'demonstration_data': True,
    }

@app.get('/orders')
def get_orders():
    return order_store

@app.post('/orders')
def create_order(payload: OrderRequest):
    order_id = f'FARMFLOW-{len(order_store) + 1001}'
    record = {
        'order_id': order_id,
        'buyer_name': payload.buyer_name,
        'buyer_type': payload.buyer_type,
        'crop': payload.crop,
        'quantity': payload.quantity,
        'grade': payload.grade,
        'location': payload.location,
        'required_by': payload.required_by,
        'delivery_preference': payload.delivery_preference,
        'consent_data': payload.consent_data,
        'consent_ai': payload.consent_ai,
        'consent_commercial': payload.consent_commercial,
        'notes': payload.notes,
        'status': 'confirmed',
        'matched_farmers': 3,
        'aggregated_quantity_kg': payload.quantity,
        'route_cost': 1850,
    }
    order_store.append(record)
    return record

@app.post('/match')
def match_farmers():
    return {
        'matches': [
            {'name': 'Farmer A', 'quantity_kg': 500, 'distance_km': 18, 'match_score': 94},
            {'name': 'Farmer B', 'quantity_kg': 300, 'distance_km': 25, 'match_score': 91},
            {'name': 'Farmer C', 'quantity_kg': 200, 'distance_km': 32, 'match_score': 87},
        ],
        'total_matched_kg': 1000,
    }

@app.post('/aggregate-orders')
def aggregate_orders():
    return {
        'aggregation': {
            'Farmer A': 400,
            'Farmer B': 350,
            'Farmer C': 250,
        },
        'total': 1000,
        'logistics_saving': 890,
    }

@app.post('/optimize-route')
def optimize_route():
    return {
        'traditional_distance_km': 92,
        'optimized_distance_km': 74,
        'traditional_cost': 2740,
        'optimized_cost': 1850,
        'estimated_savings': 890,
        'vehicle_utilization_percent': 92,
    }

@app.get('/demand-prediction')
def demand_prediction():
    return {
        'commodity': 'Tomato',
        'current_demand_kg': 14200,
        'predicted_demand_kg': 16100,
        'demand_growth_percent': 13.4,
        'confidence_percent': 87,
        'demand_level': 'HIGH',
        'recommended_sale_range': '₹22–24/kg',
        'horizon_days': 7,
        'prototype_ai': True,
    }

@app.get('/price-recommendation')
def price_recommendation():
    return {
        'current_market_price': 20,
        'recommended_price': '₹22–24/kg',
        'expected_buyer_price': 27,
        'expected_farmer_revenue': 26400,
        'farmer_benefit_percent': 18,
        'explanation': 'Demand is expected to increase by 13.4% in the next 7 days while regional supply remains moderate. The recommended listing range is ₹22–24/kg.',
    }

@app.get('/analytics')
def analytics():
    return {
        'farmer_income_projection_percent': 32,
        'consumer_price_reduction_percent': 18,
        'logistics_cost_reduction_percent': 23,
        'vehicle_utilization_before': 68,
        'vehicle_utilization_after': 91,
        'waste_reduction_percent': 15,
        'prototype_simulation': True,
    }

@app.get('/traceability/{orderId}')
def traceability(orderId: str):
    return {
        'order_id': orderId,
        'farm': 'Raj Kumar • Ludhiana, Punjab',
        'harvest_date': '2026-09-18',
        'quality_grade': 'A',
        'delivery_status': 'In transit',
        'timeline': [
            'Farm verified',
            'Harvest logged',
            'Quality check passed',
            'Pickup scheduled',
            'Route optimized',
            'Buyer delivery in progress',
        ]
    }
