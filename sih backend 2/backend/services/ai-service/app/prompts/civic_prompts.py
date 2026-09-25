"""Civic prompt templates, keyword taxonomies, and guidelines."""

# High-priority urgency and safety indicator keywords
CRITICAL_SAFETY_KEYWORDS = [
    "live wire", "dangling wire", "electric spark", "transformer fire", "short circuit",
    "open manhole", "deep manhole", "cave in", "sinkhole", "bridge collapse",
    "gas leak", "chemical spill", "toxic", "poisonous", "massive flood",
    "water burst", "electrocution", "fatal", "accident death", "death trap"
]

HIGH_URGENCY_KEYWORDS = [
    "major pothole", "pothole on highway", "broken road", "water logging",
    "sewage overflow", "foul smell", "stagnant water", "dengue", "cholera",
    "hospital entrance", "school entrance", "traffic jam", "signal down",
    "tree fallen", "blocked road", "water supply contaminated", "no water for 3 days"
]

# Civic Category keyword taxonomy for high-accuracy zero-shot & keyword scoring
CATEGORY_KEYWORD_TAXONOMY = {
    "ROADS_AND_TRANSPORT": [
        "road", "pothole", "asphalt", "traffic", "signal", "zebra crossing", "footpath",
        "pavement", "street", "highway", "divider", "speed breaker", "culvert", "flyover",
        "tar", "cracked road", "traffic light", "signboard"
    ],
    "WATER_AND_SEWAGE": [
        "water", "pipe", "pipeline", "leakage", "drain", "drainage", "sewage", "gutter",
        "manhole", "overflow", "drinking water", "tap", "borewell", "water tanker",
        "contamination", "sewer", "clogged drain", "burst pipe"
    ],
    "SOLID_WASTE_MANAGEMENT": [
        "garbage", "trash", "waste", "dump", "dustbin", "litter", "debris", "plastic waste",
        "rotting", "uncollected", "dumpster", "sweep", "sanitation worker", "dead dog",
        "animal carcass", "refuse"
    ],
    "ELECTRICITY_AND_POWER": [
        "light", "streetlight", "pole", "electric pole", "wire", "cable", "transformer",
        "blackout", "power outage", "spark", "fuse", "meter", "voltage", "current",
        "dangling wire", "dark street"
    ],
    "PUBLIC_HEALTH_AND_SANITATION": [
        "mosquito", "dengue", "malaria", "health", "hospital", "dispensary", "sanitation",
        "public toilet", "urinal", "hygiene", "stench", "epidemic", "stagnant water",
        "open defecation", "medical waste"
    ],
    "ENVIRONMENT_AND_GREENERY": [
        "tree", "branch", "fallen tree", "park", "garden", "lake", "pond", "river",
        "smoke", "air pollution", "burning", "forest", "greenery", "illegal cutting",
        "encroachment on park"
    ],
    "PUBLIC_SAFETY_AND_LAW": [
        "unsafe", "dark alley", "harassment", "cctv", "theft", "vandalism", "crime",
        "encroachment", "broken railing", "unsafe bridge", "dangerous", "hazard", "security"
    ],
    "EDUCATION_AND_INFRASTRUCTURE": [
        "school", "college", "classroom", "blackboard", "desk", "drinking water school",
        "toilet school", "anganwadi", "compound wall", "playground", "library"
    ]
}

# Subcategory fine-grained classifier markers
SUBCATEGORY_MARKERS = {
    "POTHOLE": ["pothole", "crater", "hole in road", "road pit"],
    "BROKEN_ROAD": ["broken road", "damaged road", "caved in", "uneven road"],
    "TRAFFIC_SIGNAL_FAILURE": ["traffic light", "signal not working", "blinking red", "signal off"],
    "PIPELINE_LEAKAGE": ["pipe leak", "water gushing", "burst pipe", "pipeline break"],
    "SEWAGE_OVERFLOW": ["sewage", "gutter water", "drain overflow", "dirty water on road"],
    "OPEN_MANHOLE": ["open manhole", "manhole cover missing", "drain open", "pit uncovered"],
    "GARBAGE_DUMP": ["garbage heap", "dumping ground", "piles of trash", "overflowing bin"],
    "BROKEN_STREETLIGHT": ["streetlight off", "dark pole", "light broken", "unlit street"],
    "DANGLING_WIRE": ["dangling wire", "hanging wire", "loose cable", "electric wire touching ground"],
    "FALLEN_TREE": ["fallen tree", "tree branch broken", "tree blocking road"],
    "DIRTY_PUBLIC_TOILET": ["toilet dirty", "public urinal blocked", "no water in toilet"],
}
