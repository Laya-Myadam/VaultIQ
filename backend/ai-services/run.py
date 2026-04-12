import sys
import os
sys.path.insert(0, os.path.dirname(__file__))
import uvicorn

services = {
    "fraud":      ("fraud.main:app",      8001),
    "credit":     ("credit.main:app",     8002),
    "compliance": ("compliance.main:app", 8003),
    "risk":       ("risk.main:app",       8004),
     "docs":       ("docs.main:app",       8005),

}

service = sys.argv[1] if len(sys.argv) > 1 else "fraud"
app_path, port = services[service]

if __name__ == "__main__":
    uvicorn.run(app_path, host="0.0.0.0", port=port, reload=True)