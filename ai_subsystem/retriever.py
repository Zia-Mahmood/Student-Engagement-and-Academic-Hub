from whoosh.qparser import QueryParser
from whoosh.index import Index
from sentence_transformers import SentenceTransformer
import faiss
from typing import List, Dict

def search_index(
    query: str,
    model: SentenceTransformer,
    faiss_index: faiss.IndexFlatL2,
    documents: List[Dict],
    top_k: int = 30
) -> List[Dict]:
    q_emb = model.encode([query], convert_to_numpy=True)
    D, I = faiss_index.search(q_emb, top_k)
    results = []
    for dist, idx in zip(D[0], I[0]):
        doc = documents[idx]
        results.append({
            "doc_id": idx,
            "distance": float(dist),
            "text": doc["text"],
            "label_text": doc["label_text"]
        })
    return results

def bm25_search(
    ix: Index,
    query_str: str,
    top_n: int = 30
) -> List[Dict]:
    qp = QueryParser("text", schema=ix.schema)
    q = qp.parse(query_str)
    results = []
    with ix.searcher() as searcher:
        hits = searcher.search(q, limit=top_n)
        for hit in hits:
            results.append({
                "doc_id": int(hit["doc_id"]),
                "bm25_score": hit.score,
                "text": hit["text"],
                "label_text": hit["label_text"]
            })
    return results
