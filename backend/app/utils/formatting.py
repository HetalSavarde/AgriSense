def readable_class_name(raw: str) -> str:
    """Tomato___Early_blight -> Tomato Early blight (for logs/prompts, not
    for the API response — the frontend owns display formatting per the
    contract's 'Shared display formatting rules' section)."""
    return raw.replace("___", " ").replace("_", " ")
