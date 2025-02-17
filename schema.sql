CREATE TABLE poles (
    id SERIAL PRIMARY KEY,
    pole VARCHAR(10) NOT NULL,
    rating VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    location VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    date TIMESTAMP NOT NULL,
    imbalance_qty INTEGER DEFAULT 0,
    imbalance_pole VARCHAR(10),
    status_class VARCHAR(20) DEFAULT 'status-balanced'
);