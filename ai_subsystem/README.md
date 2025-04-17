## Running AI microservice
cd ai_subsystem && pip install -r requirements.txt
uvicorn ai_service:app --host 0.0.0.0 --port 8000
