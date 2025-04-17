import os
import faiss
from sentence_transformers import SentenceTransformer
from whoosh.fields import Schema, TEXT, ID
from whoosh import index as whoosh_index
from typing import List, Dict

def generate_document_embeddings(
    documents: List[Dict],
    model: SentenceTransformer
):
    texts = [doc["text"] for doc in documents]
    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        show_progress_bar=True,
        batch_size=32
    )
    return embeddings

def build_faiss_index(embeddings):
    dim = embeddings.shape[1]
    index_flat = faiss.IndexFlatL2(dim)
    index_flat.add(embeddings)
    return index_flat

def create_whoosh_index(
    documents: List[Dict],
    index_dir: str = "whoosh_index"
):
    if not os.path.exists(index_dir):
        os.makedirs(index_dir)
    schema = Schema(
        doc_id=ID(stored=True, unique=True),
        text=TEXT(stored=True),
        label=ID(stored=True),
        label_text=TEXT(stored=True)
    )
    ix = whoosh_index.create_in(index_dir, schema)
    writer = ix.writer()
    for i, doc in enumerate(documents):
        writer.add_document(
            doc_id=str(i),
            text=doc.get("text", ""),
            label=str(doc.get("label", "")),
            label_text=doc.get("label_text", "")
        )
    writer.commit()
    return ix
