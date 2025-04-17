from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .your_ai_module import run_pipeline

class QueryRequest(BaseModel):
    query: str

class SearchResponse(BaseModel):
    results: list
    overview: str

app = FastAPI()

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/search", response_model=SearchResponse)
async def search_endpoint(req: QueryRequest):
    try:
        results, overview = run_pipeline(req.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"results": results, "overview": overview}
