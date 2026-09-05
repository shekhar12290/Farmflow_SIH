CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(40) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE farmers (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  farm_name VARCHAR(255),
  location VARCHAR(255),
  crop_focus VARCHAR(255),
  average_price NUMERIC(10,2)
);

CREATE TABLE fpos (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  fpo_name VARCHAR(255),
  region VARCHAR(255),
  member_count INT
);

CREATE TABLE buyers (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  buyer_name VARCHAR(255),
  buyer_type VARCHAR(80),
  location VARCHAR(255)
);

CREATE TABLE crops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  unit VARCHAR(30)
);

CREATE TABLE produce (
  id SERIAL PRIMARY KEY,
  farmer_id INT REFERENCES farmers(id),
  crop_id INT REFERENCES crops(id),
  quantity NUMERIC(12,2),
  grade VARCHAR(10),
  harvest_date DATE,
  location VARCHAR(255),
  minimum_price NUMERIC(10,2),
  shelf_life_days INT,
  available_from DATE,
  status VARCHAR(40)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  buyer_id INT REFERENCES buyers(id),
  status VARCHAR(40),
  total_quantity NUMERIC(12,2),
  required_by DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  produce_id INT REFERENCES produce(id),
  quantity NUMERIC(12,2),
  price_per_kg NUMERIC(10,2)
);

CREATE TABLE shipments (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  vehicle_id INT,
  status VARCHAR(40),
  estimated_cost NUMERIC(10,2)
);

CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  capacity_kg NUMERIC(12,2),
  current_load NUMERIC(12,2),
  route_id INT
);

CREATE TABLE routes (
  id SERIAL PRIMARY KEY,
  shipment_id INT REFERENCES shipments(id),
  total_distance_km NUMERIC(10,2),
  estimated_time_hours NUMERIC(8,2),
  optimized_cost NUMERIC(10,2)
);

CREATE TABLE demand_predictions (
  id SERIAL PRIMARY KEY,
  crop_id INT REFERENCES crops(id),
  region VARCHAR(255),
  current_demand_kg NUMERIC(12,2),
  predicted_demand_kg NUMERIC(12,2),
  growth_percent NUMERIC(8,2),
  confidence_percent INT,
  horizon_days INT
);

CREATE TABLE price_predictions (
  id SERIAL PRIMARY KEY,
  crop_id INT REFERENCES crops(id),
  region VARCHAR(255),
  current_market_price NUMERIC(10,2),
  recommended_min NUMERIC(10,2),
  recommended_max NUMERIC(10,2),
  buyer_expected_price NUMERIC(10,2)
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE traceability_events (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  event_type VARCHAR(80),
  description TEXT,
  event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
