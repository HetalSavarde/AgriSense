"""
Feature owner: Disease Detection

Two jobs live here, and it's fine to split them between two people if needed:
1. Image classification -> predicted_class, confidence, top3
   (your trained model / a vision API call)
2. Report generation -> the `report` object
   (AI call, e.g. Claude, prompted with the predicted disease)

Everything below is mock data matching the contract shape exactly.
Replace analyze_leaf() internals without changing its signature or
return shape — the router and frontend already depend on this shape.
"""


def classify_image(image_bytes: bytes) -> dict:
    """TODO: replace with real model inference."""
    return {
        "predicted_class": "Tomato___Early_blight",
        "confidence": 0.9432,
        "top3": [
            {"class": "Tomato___Early_blight", "confidence": 0.9432},
            {"class": "Tomato___Late_blight", "confidence": 0.0401},
            {"class": "Tomato___healthy", "confidence": 0.0091},
        ],
    }


def generate_report(predicted_class: str) -> dict:
    """TODO: replace with real AI call, prompted with predicted_class."""
    return {
        "severity": "Moderate",
        "symptoms": [
            "Dark concentric spots on lower leaves",
            "Yellowing around lesions",
        ],
        "causes": [
            "Fungal infection (Alternaria solani)",
            "High humidity and warm temperatures",
        ],
        "treatment": [
            "Apply copper-based fungicide every 7-10 days",
            "Remove and dispose of infected leaves",
        ],
        "prevention": [
            "Avoid overhead watering",
            "Rotate crops yearly",
            "Ensure good air circulation",
        ],
        "estimated_recovery_days": 10,
        "next_steps": [
            "Re-scan in 3 days to track progress",
            "Isolate plant if possible",
        ],
    }


def analyze_leaf(image_bytes: bytes) -> dict:
    classification = classify_image(image_bytes)
    report = generate_report(classification["predicted_class"])
    return {**classification, "report": report}
