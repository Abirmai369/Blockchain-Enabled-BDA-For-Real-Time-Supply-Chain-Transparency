CREATE TABLE IF NOT EXISTS blockchain_transactions (
    transaction_id SERIAL PRIMARY KEY,
    block_hash VARCHAR(66) NOT NULL,
    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(50) NOT NULL,
    from_address VARCHAR(42),
    to_address VARCHAR(42),
    gas_used INTEGER,
    status VARCHAR(20) DEFAULT 'CONFIRMED'
);

CREATE TABLE IF NOT EXISTS shipments (
    shipment_id VARCHAR(50) PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    current_status VARCHAR(50),
    current_location VARCHAR(100),
    temperature_required DECIMAL(5,2),
    blockchain_tx_hash VARCHAR(66)
);

CREATE TABLE IF NOT EXISTS location_tracking (
    tracking_id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(50),
    location_name VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperature DECIMAL(5,2)
);

CREATE TABLE IF NOT EXISTS iot_sensor_data (
    sensor_id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(50),
    sensor_type VARCHAR(50),
    sensor_value DECIMAL(10,4),
    threshold_min DECIMAL(10,4),
    threshold_max DECIMAL(10,4),
    alert_triggered BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS participants (
    participant_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    role VARCHAR(50),
    location VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS alerts (
    alert_id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(50),
    alert_type VARCHAR(50),
    severity VARCHAR(20),
    message TEXT,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    acknowledged BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_blockchain_timestamp ON blockchain_transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(current_status);
CREATE INDEX IF NOT EXISTS idx_iot_shipment ON iot_sensor_data(shipment_id);
CREATE INDEX IF NOT EXISTS idx_alerts_shipment ON alerts(shipment_id);

SELECT 
    s.shipment_id,
    s.product_name,
    s.origin,
    s.destination,
    s.current_status,
    s.current_location,
    s.expected_delivery,
    CASE 
        WHEN s.actual_delivery IS NOT NULL THEN 'DELIVERED'
        WHEN s.expected_delivery < CURRENT_TIMESTAMP THEN 'DELAYED'
        ELSE 'ON_TIME'
    END as delivery_status,
    COUNT(lt.tracking_id) as tracking_updates,
    MAX(lt.timestamp) as last_update
FROM shipments s
LEFT JOIN location_tracking lt ON s.shipment_id = lt.shipment_id
WHERE s.current_status != 'DELIVERED'
GROUP BY s.shipment_id
ORDER BY s.expected_delivery;

SELECT 
    isd.shipment_id,
    s.product_name,
    s.temperature_required as required_temp,
    isd.sensor_value as actual_temp,
    isd.threshold_min,
    isd.threshold_max,
    isd.timestamp as violation_time,
    lt.location_name as violation_location,
    CASE 
        WHEN isd.sensor_value < isd.threshold_min THEN 'BELOW_MINIMUM'
        WHEN isd.sensor_value > isd.threshold_max THEN 'ABOVE_MAXIMUM'
    END as violation_type
FROM iot_sensor_data isd
JOIN shipments s ON isd.shipment_id = s.shipment_id
LEFT JOIN location_tracking lt ON isd.shipment_id = lt.shipment_id 
    AND ABS(EXTRACT(EPOCH FROM (isd.timestamp - lt.timestamp))) < 300
WHERE isd.sensor_type = 'TEMPERATURE'
  AND (isd.sensor_value < isd.threshold_min OR isd.sensor_value > isd.threshold_max)
ORDER BY isd.timestamp DESC
LIMIT 100;

SELECT 
    p.participant_id,
    p.name,
    p.role,
    p.location,
    COUNT(DISTINCT s.shipment_id) as total_shipments,
    COUNT(DISTINCT CASE WHEN s.current_status = 'DELIVERED' THEN s.shipment_id END) as delivered_shipments,
    COUNT(DISTINCT CASE WHEN s.actual_delivery <= s.expected_delivery THEN s.shipment_id END) as on_time_deliveries,
    ROUND(
        (COUNT(DISTINCT CASE WHEN s.actual_delivery <= s.expected_delivery THEN s.shipment_id END)::NUMERIC / 
         NULLIF(COUNT(DISTINCT CASE WHEN s.current_status = 'DELIVERED' THEN s.shipment_id END), 0)) * 100, 2
    ) as on_time_percentage,
    COUNT(DISTINCT a.alert_id) as total_alerts,
    ROUND(AVG(EXTRACT(EPOCH FROM (s.actual_delivery - s.created_at))/86400)::NUMERIC, 2) as avg_delivery_days
FROM participants p
LEFT JOIN shipments s ON p.participant_id = s.sender_id OR p.participant_id = s.receiver_id
LEFT JOIN alerts a ON s.shipment_id = a.shipment_id
GROUP BY p.participant_id
HAVING COUNT(DISTINCT s.shipment_id) > 0
ORDER BY on_time_percentage DESC;


SELECT 
    DATE_TRUNC('day', bt.timestamp) as transaction_date,
    bt.event_type,
    COUNT(*) as transaction_count,
    COUNT(DISTINCT bt.from_address) as unique_senders,
    COUNT(DISTINCT bt.to_address) as unique_receivers,
    ROUND(AVG(bt.gas_used)::NUMERIC, 2) as avg_gas_used,
    COUNT(CASE WHEN bt.status = 'CONFIRMED' THEN 1 END) as confirmed_txs,
    COUNT(CASE WHEN bt.status = 'FAILED' THEN 1 END) as failed_txs,
    ROUND((COUNT(CASE WHEN bt.status = 'CONFIRMED' THEN 1 END)::NUMERIC / COUNT(*)) * 100, 2) as success_rate
FROM blockchain_transactions bt
WHERE bt.timestamp >= CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', bt.timestamp), bt.event_type
ORDER BY transaction_date DESC, transaction_count DESC;

SELECT 
    DATE_TRUNC('day', a.triggered_at) as alert_date,
    a.alert_type,
    a.severity,
    COUNT(*) as alert_count,
    COUNT(DISTINCT a.shipment_id) as affected_shipments,
    COUNT(CASE WHEN a.acknowledged = TRUE THEN 1 END) as acknowledged_alerts,
    COUNT(CASE WHEN a.acknowledged = FALSE THEN 1 END) as pending_alerts
FROM alerts a
WHERE a.triggered_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', a.triggered_at), a.alert_type, a.severity
ORDER BY alert_date DESC, alert_count DESC;

SELECT 
    s.shipment_id,
    s.product_name,
    s.origin,
    s.destination,
    s.current_status,
    s.temperature_required as required_temp,
    COUNT(isd.sensor_id) as total_temp_readings,
    ROUND(MIN(isd.sensor_value)::NUMERIC, 2) as min_temp_recorded,
    ROUND(MAX(isd.sensor_value)::NUMERIC, 2) as max_temp_recorded,
    ROUND(AVG(isd.sensor_value)::NUMERIC, 2) as avg_temp,
    COUNT(CASE WHEN isd.alert_triggered = TRUE THEN 1 END) as temperature_violations,
    ROUND((COUNT(CASE WHEN isd.alert_triggered = FALSE THEN 1 END)::NUMERIC / COUNT(isd.sensor_id)) * 100, 2) as compliance_percentage,
    CASE 
        WHEN COUNT(CASE WHEN isd.alert_triggered = TRUE THEN 1 END) = 0 THEN 'FULLY COMPLIANT'
        WHEN COUNT(CASE WHEN isd.alert_triggered = TRUE THEN 1 END) <= 2 THEN 'MINOR VIOLATIONS'
        ELSE 'NON COMPLIANT'
    END as compliance_status
FROM shipments s
JOIN iot_sensor_data isd ON s.shipment_id = isd.shipment_id
WHERE s.temperature_required IS NOT NULL
  AND isd.sensor_type = 'TEMPERATURE'
GROUP BY s.shipment_id
ORDER BY temperature_violations DESC;

SELECT COUNT(*) FROM shipments;

-- EXECUTIVE DASHBOARD - ALL METRICS
SELECT 
    'SHIPMENT STATUS' as category,
    current_status as detail,
    COUNT(*) as count
FROM shipments
GROUP BY current_status
UNION ALL
SELECT 
    'ALERT SEVERITY',
    severity,
    COUNT(*)
FROM alerts
GROUP BY severity
UNION ALL
SELECT 
    'VENDOR PERFORMANCE',
    p.name,
    COUNT(s.shipment_id)
FROM participants p
LEFT JOIN shipments s ON p.participant_id = s.sender_id
GROUP BY p.name
ORDER BY category, count DESC;

-- Create View 1: Dashboard Summary
CREATE OR REPLACE VIEW view_dashboard AS
SELECT 
    s.shipment_id,
    s.product_name,
    s.origin,
    s.destination,
    s.current_status,
    s.current_location,
    CASE 
        WHEN s.expected_delivery < CURRENT_TIMESTAMP THEN 'DELAYED'
        ELSE 'ON_TIME'
    END as status
FROM shipments s
WHERE s.current_status != 'DELIVERED';

-- Create View 2: Temperature Violations
CREATE OR REPLACE VIEW view_temperature_alerts AS
SELECT 
    isd.shipment_id,
    s.product_name,
    isd.sensor_value as temp,
    isd.threshold_min,
    isd.threshold_max,
    lt.location_name
FROM iot_sensor_data isd
JOIN shipments s ON isd.shipment_id = s.shipment_id
LEFT JOIN location_tracking lt ON isd.shipment_id = lt.shipment_id
WHERE isd.alert_triggered = TRUE;

-- Create View 3: Vendor Performance
CREATE OR REPLACE VIEW view_vendor_performance AS
SELECT 
    p.name,
    p.role,
    COUNT(s.shipment_id) as total_shipments,
    COUNT(CASE WHEN s.current_status = 'DELIVERED' THEN 1 END) as delivered
FROM participants p
LEFT JOIN shipments s ON p.participant_id = s.sender_id
GROUP BY p.participant_id;

SELECT * FROM view_dashboard;
SELECT * FROM view_temperature_alerts;
SELECT * FROM view_vendor_performance;
