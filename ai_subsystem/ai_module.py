import os
from sentence_transformers import SentenceTransformer, CrossEncoder
from .data_loader import load_jsonl
from .indexer import (
    generate_document_embeddings,
    build_faiss_index,
    create_whoosh_index
)
from .retriever import search_index, bm25_search
from .ranker import rerank_candidates, normalize_scores
from .summarizer import generate_overview_with_gemini

def run_pipeline(query: str):
    # Load data
    jsonl_file = os.getenv("AI_JSONL_PATH", "bbc_dataset.jsonl")
    documents = load_jsonl(jsonl_file)

    # Embedding model
    embed_model_name = os.getenv("EMBEDDING_MODEL", "paraphrase-mpnet-base-v2")
    embed_model = SentenceTransformer(embed_model_name)

    # Index creation
    embeddings = generate_document_embeddings(documents, embed_model)
    faiss_idx = build_faiss_index(embeddings)
    whoosh_ix = create_whoosh_index(documents, index_dir=os.getenv("WHOOSH_INDEX_DIR", "whoosh_index"))

    # Retrieval
    top_k = int(os.getenv("TOP_K", "30"))
    v_cands = search_index(query, embed_model, faiss_idx, documents, top_k=top_k)
    b_cands = bm25_search(whoosh_ix, query, top_n=top_k)

    # Fusion
    unique = {c["doc_id"]: c for c in (v_cands + b_cands)}.values()
    candidates = list(unique)

    # Re‑ranking
    rerank_model = os.getenv("RERANK_MODEL", "cross-encoder/ms-marco-MiniLM-L-12-v2")
    ranked = rerank_candidates(query, candidates, model_name=rerank_model)
    normalized = normalize_scores(ranked)

    # Overview
    overview = generate_overview_with_gemini(query, normalized)
    return normalized, overview
