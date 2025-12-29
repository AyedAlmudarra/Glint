-- Update marketing tasks with proper validation types

-- Update Campaign Budget Analyzer Task (ID 11)
UPDATE tasks 
SET definition = jsonb_set(
    definition, 
    '{solution}', 
    '{
        "validation_type": "exact_match",
        "expected_value": {
            "cost_per_click": 5.0,
            "conversion_rate": 5.0,
            "roi_percentage": 50.0
        }
    }'::jsonb
)
WHERE id = 11;

-- Update Marketing Funnel Builder Task (ID 12)
UPDATE tasks 
SET definition = jsonb_set(
    definition, 
    '{solution}', 
    '{
        "validation_type": "range_match",
        "target_conversion_score_min": 35,
        "target_conversion_score_max": 55
    }'::jsonb
)
WHERE id = 12;

-- Update Customer Persona Creator Task (ID 13)
UPDATE tasks 
SET definition = jsonb_set(
    definition, 
    '{solution}', 
    '{
        "validation_type": "exact_match",
        "expected_value": {
            "age_range": "26-35",
            "income_level": "100,000-200,000 ريال",
            "education": "جامعي",
            "lifestyle": "مشغول بالعمل",
            "tech_usage": "مبكر في تبني التقنية",
            "fitness_level": "مبتدئ",
            "shopping_preference": "أونلاين دائماً",
            "social_media": "انستغرام"
        }
    }'::jsonb
)
WHERE id = 13;

-- Update Write & React Task (ID 14) - already has completion validation
UPDATE tasks 
SET definition = jsonb_set(
    definition, 
    '{solution}', 
    '{
        "validation_type": "completion"
    }'::jsonb
)
WHERE id = 14;

