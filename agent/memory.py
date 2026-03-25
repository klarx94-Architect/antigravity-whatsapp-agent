import sqlite3
import json
from typing import List, Dict

class AgentMemory:
    def __init__(self, db_path: str = "agent_memory.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS history (
                    session_id TEXT,
                    role TEXT,
                    content TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)

    def add_message(self, session_id: str, role: str, content: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("INSERT INTO history (session_id, role, content) VALUES (?, ?, ?)", 
                         (session_id, role, content))

    def get_history(self, session_id: str, limit: int = 10) -> List[Dict]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute(
                "SELECT role, content FROM history WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?", 
                (session_id, limit)
            )
            rows = cursor.fetchall()
            # Convertir a formato compatible con Gemini: role ('user' o 'model')
            history = [{"role": r, "parts": [c]} for r, c in reversed(rows)]
            return history

    def clear(self, session_id: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("DELETE FROM history WHERE session_id = ?", (session_id,))
