"""
Feature owner: Disease Detection

analyze_leaf() tries each provider in app.config.DETECTION_PROVIDER_ORDER
in sequence (Claude -> Gemini -> Grok by default) and returns the first
one that succeeds. If a provider errors (network issue, invalid key,
rate limit, or a malformed response that fails validate_shape), it's
logged and skipped — the next provider is tried automatically.

If ALL three fail, this raises DetectionUnavailableError rather than
returning mock data — the router catches it and returns a clean error
to the frontend, so a real failure is never disguised as a real result.
"""

from app.config import DETECTION_PROVIDER_ORDER
from app.services.ai_providers import PROVIDER_FUNCTIONS


class DetectionUnavailableError(Exception):
    """Raised when every provider in the fallback chain has failed."""
    pass


def analyze_leaf(image_bytes: bytes) -> dict:
    errors = []

    for provider_name in DETECTION_PROVIDER_ORDER:
        provider_fn = PROVIDER_FUNCTIONS.get(provider_name)
        if provider_fn is None:
            continue
        try:
            result = provider_fn(image_bytes)
            print(f"[detection] succeeded using provider: {provider_name}")
            return result
        except Exception as exc:
            print(f"[detection] provider '{provider_name}' failed: {exc}")
            errors.append(f"{provider_name}: {exc}")
            continue

    # All three providers failed — surface this as a real error instead
    # of silently returning mock data.
    error_summary = "; ".join(errors)
    print(f"[detection] ALL providers failed ({error_summary}).")
    raise DetectionUnavailableError(
        f"Detection is currently unavailable — all providers failed ({error_summary})"
    )