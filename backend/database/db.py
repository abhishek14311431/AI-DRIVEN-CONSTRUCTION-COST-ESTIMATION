import sqlite3
from typing import Dict, List, Any
import json

DATABASE_PATH = "construction_costs.db"

def init_db():
    """Initialize the database and create tables if they don't exist."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS estimates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_type TEXT,
            plot_size TEXT,
            floors INTEGER,
            zone TEXT,
            selected_tier TEXT,
            site_type TEXT,
            family_details TEXT,  -- JSON string
            lift_required BOOLEAN,
            final_cost REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_estimate(estimate_data: Dict[str, Any]):
    """Save an estimate to the database."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO estimates (project_type, plot_size, floors, zone, selected_tier, site_type, family_details, lift_required, final_cost)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        estimate_data.get("project_type"),
        estimate_data.get("plot_size"),
        estimate_data.get("floors"),
        estimate_data.get("zone"),
        estimate_data.get("selected_tier"),
        estimate_data.get("site_type"),
        json.dumps(estimate_data.get("family_details", {})),
        estimate_data.get("lift_required", False),
        estimate_data.get("final_cost")
    ))
    conn.commit()
    conn.close()

def get_historical_data() -> List[Dict[str, Any]]:
    """Retrieve historical estimates for training."""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM estimates ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()
    data = []
    for row in rows:
        data.append({
            "id": row[0],
            "project_type": row[1],
            "plot_size": row[2],
            "floors": row[3],
            "zone": row[4],
            "selected_tier": row[5],
            "site_type": row[6],
            "family_details": json.loads(row[7]) if row[7] else {},
            "lift_required": bool(row[8]),
            "final_cost": row[9],
            "created_at": row[10]
        })
    return data
