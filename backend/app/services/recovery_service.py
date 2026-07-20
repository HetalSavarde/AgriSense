"""
Feature owner: Smart Recovery Planner

TODO: replace build_plan() with a real AI call, prompted with `disease`,
asking for a day-by-day plan. Keep the day numbers non-consecutive-safe —
the frontend renders by day number, not array index.
"""


def build_plan(disease: str) -> dict:
    return {
        "plan": [
            {
                "day": 1,
                "title": "Remove Infected Leaves",
                "tasks": ["Cut off affected leaves", "Avoid watering at night"],
            },
            {
                "day": 3,
                "title": "Apply Treatment",
                "tasks": ["Apply recommended fungicide"],
            },
            {
                "day": 5,
                "title": "Check Progress",
                "tasks": ["Inspect for new spots"],
            },
            {
                "day": 7,
                "title": "Reassess",
                "tasks": ["Upload another image for progress comparison"],
            },
        ],
        "estimated_recovery_days": 10,
    }
