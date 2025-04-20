import os
from google import genai
from typing import List, Dict

def generate_overview_with_gemini(
    query: str,
    candidates: List[Dict],
    model: str = "gemini-2.0-flash-lite"
) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError("GEMINI_API_KEY not set in environment")
    context_parts = []
    for i, cand in enumerate(candidates[:3]):
        snippet = cand["text"]
        context_parts.append(f"Document {i+1} (Category: {cand['label_text']}):\n{snippet}")
    aggregated_context = "\n\n---\n\n".join(context_parts)
    prompt = (
        f"Based on the following documents relevant to the query '{query}', "
        "provide a concise summary that directly answers the query.\n\n"
        f"{aggregated_context}\n\nSummary/Answer:"
    )
    client = genai.Client(api_key=api_key)
    stream = client.models.generate_content_stream(
        model=model,
        contents=[prompt]
    )
    overview = ""
    for chunk in stream:
        overview += chunk.text
    return overview
