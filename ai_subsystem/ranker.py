from sentence_transformers import CrossEncoder
from typing import List, Dict

def rerank_candidates(
    query: str,
    candidates: List[Dict],
    model_name: str = "cross-encoder/ms-marco-MiniLM-L-12-v2"
) -> List[Dict]:
    cross_encoder = CrossEncoder(model_name)
    pairs = [(query, c["text"]) for c in candidates]
    scores = cross_encoder.predict(pairs)
    for c, s in zip(candidates, scores):
        c["re_rank_score"] = float(s)
    return sorted(candidates, key=lambda x: x["re_rank_score"], reverse=True)

def normalize_scores(candidates: List[Dict]) -> List[Dict]:
    if not candidates:
        return candidates
    min_score = min(c["re_rank_score"] for c in candidates)
    for c in candidates:
        c["norm_score"] = c["re_rank_score"] - min_score
    return candidates
