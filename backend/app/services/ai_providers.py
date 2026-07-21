"""
One thin wrapper per provider. Each function takes raw image bytes and
returns a validated dict matching the detection contract, or raises —
the caller in detection_service.py catches any exception and moves to
the next provider in the fallback chain.

NOTE: model name strings (e.g. "claude-...", "gemini-...", "grok-...")
change over time as providers release new versions. Confirm the current
recommended model name in each provider's docs before your demo —
don't assume the ones below are still current when you're reading this.
"""

import base64

from app.config import GEMINI_API_KEY, XAI_API_KEY
from app.services.detection_prompt import (
    DETECTION_PROMPT,
    parse_json_response,
    validate_shape,
)


def _require_valid(data: dict, provider_name: str) -> dict:
    if not validate_shape(data):
        raise ValueError(f"{provider_name} response did not match the expected shape")
    return data


def call_gemini(image_bytes: bytes) -> dict:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set")

    import google.generativeai as genai

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(
        "gemini-3.5-flash"
    )  # confirm current model name before demo

    response = model.generate_content(
        [
            DETECTION_PROMPT,
            {"mime_type": "image/jpeg", "data": image_bytes},
        ]
    )
    data = parse_json_response(response.text)
    return _require_valid(data, "gemini")


def call_grok(image_bytes: bytes) -> dict:
    if not XAI_API_KEY:
        raise RuntimeError("XAI_API_KEY not set")

    from openai import OpenAI  # xAI's API is OpenAI-client-compatible

    client = OpenAI(api_key=XAI_API_KEY, base_url="https://api.x.ai/v1")
    image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")
    data_url = f"data:image/jpeg;base64,{image_b64}"

    response = client.responses.create(
        model="grok-4.5",  # confirm current model name before demo
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_image", "image_url": data_url},
                    {"type": "input_text", "text": DETECTION_PROMPT},
                ],
            }
        ],
    )
    raw_text = response.output_text
    data = parse_json_response(raw_text)
    return _require_valid(data, "grok")


# Registry the fallback loop in detection_service.py iterates over.
PROVIDER_FUNCTIONS = {
    "gemini": call_gemini,
    "grok": call_grok,
}
