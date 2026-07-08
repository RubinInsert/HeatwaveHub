type QuestionScoreMap = {
  options: Record<string, number>;
  index_type: "EXPOSURE" | "SENSITIVITY" | "ADAPTIVE" | "NONE";
};
type AssessmentMap = Record<string, QuestionScoreMap>;
const ASSESSMENT_SCORE_MAP: AssessmentMap = {
  "gender": {
    index_type: "NONE",
    options: {
      "male": 0,
      "female": 0,
      "other": 0
    }
  },
  "heat-information-sources": {
    index_type: "NONE",
    options: {
      "bureau-of-meteorology-bom-or-weather-app": 0,
      "state-emergency-service-ses": 0,
      "fire-and-rescue-fire-authorities": 0,
      "local-council-website": 0,
      "social-media": 0,
      "radio": 0,
      "television news": 0,
      "family-or-friends": 0,
      "workplace-or-employer": 0,
      "community-groups-or-organisations": 0,
      "doctor-nurse-or-health-service": 0,
      "i-do-not-recieve-this-information": 0
    }
  },
  "risk-factors": {
    index_type: "EXPOSURE",
    options: {
      "none": 0,
      "1-to-2-hours": 0.33,
      "3-to-4-hours": 0.67,
      "5-or-more-hours": 1
    }
  },
  "medical-care": {
    index_type: "EXPOSURE",
    options: {
      "no": 0,
      "yes": 1
    }
  },
  "work-types": {
    index_type: "EXPOSURE",
    options: {
      "outdoor-work-eg-construction-landscaping-delivery": 1,
      "indoor-physical-work-eg-warehouse-factory-kitchen": 1,
      "none-of-the-above": 0
    }
  },
  "itsi-identification": {
    index_type: "SENSITIVITY",
    options: {
      "no": 0,
      "yes": 1
    }
  },
  "postcode": {
    index_type: "SENSITIVITY",
    options: {}
  },
  "age-group": {
    index_type: "SENSITIVITY",
    options: {
      "18-to-64-years": 0,
      "55-to-74-years": 0.67,
      "75-to-84-years": 0.83,
      "85-years-or-older": 1
    }
  },
  "dependents": {
    index_type: "SENSITIVITY",
    options: {
      "children-under-5-years": 1,
      "children-aged-5-17": 0.5,
      "both-of-the-above": 1,
      "no-dependents": 0
    }
  },
  "english-comprehension": {
    index_type: "SENSITIVITY",
    options: {
      "very-well": 0,
      "well": 0.33,
      "not-well": 0.67,
      "not-at-all": 1
    }
  },
  "general-health": {
    index_type: "SENSITIVITY",
    options: {
      "excelent": 0,
      "good": 0.33,
      "fair": 0.67,
      "poor": 1
    }
  },
  "long-term-conditions": {
    index_type: "SENSITIVITY",
    options: {
      "heart-condition": 0.2,
      "lung-condition": 0.2,
      "kidney-disease": 0.2,
      "diabetes": 0.2,
      "mental-health-condition": 0.2,
      "other-chronic-health-conditions": 0.2,
      "none-of-the-above": 0
    }
  },
  "heat-sensitive-medicines": {
    index_type: "SENSITIVITY",
    options: {
      "no": 0,
      "yes-for-example-fluid-pills-heart-or-blood-pressure-medicine-medicine-for-mental-health": 1
    }
  },
  "pregnant-breastfeeding": {
    index_type: "SENSITIVITY",
    options: {
      "no": 0,
      "yes-for-example-fluid-pills-heart-or-blood-pressure-medicine-medicine-for-mental-health": 1
    }
  },
  "daily-assistance": {
    index_type: "SENSITIVITY",
    options: {
      "no-i-manage-independently": 0,
      "somewhat-it-is-harder-but-i-usually-manage": 0.5,
      "significantly-i-often-cannot-go-out-or-access-services-when-needed": 1
    }
  },
  "household-situation": {
    index_type: "SENSITIVITY",
    options: {
      "i-live-with-others-in-a-household-with-adequate-space": 0,
      "i-live-alone": 1,
      "i-live-in-a-crowded-household-where-space-is-limited": 1
    }
  },
  "social-support": {
    index_type: "SENSITIVITY",
    options: {
      "no": 0,
      "yes": 1,
      "im-not-sure": 0.5
    }
  },
  "social-support-person": {
    index_type: "SENSITIVITY",
    options: {
      "neighbour": 1,
      "family-member": 1,
      "friend": 1,
      "housemate-roommate": 1,
      "carer-or-support-worker": 1,
      "healthcare-worker": 1,
      "religious-or-community-group-member": 1,
      "other-please-specify": 1
    }
  },
  "cooling-method": {
    index_type: "ADAPTIVE",
    options: {
      "air-conditioning-at-least-one-cooled-room-to-retreat-to": 1,
      "evaporative-cooling": 0.67,
      "portable-air-conditioner-or-fan-only": 0.33,
      "no-cooling": 0
    }
  },
  "cooling-effectiveness": {
    index_type: "ADAPTIVE",
    options: {
      "yes-it-works-well": 1,
      "it-works-somewhat": 0.67,
      "no-it-doesnt-work-well": 0.33,
      "i-dont-have-cooling-na": 0
    }
  },
  "cooling-affordability": {
    index_type: "ADAPTIVE",
    options: {
      "yes-always": 1,
      "yes-most-of-the-time": 0.67,
      "only-sometimes": 0.33,
      "no-never": 0,
      "i-dont-have-cooling-na": 0
    }
  },
  "home-built-year": {
    index_type: "ADAPTIVE",
    options: {
      "2003 or later": 1,
      "dont-know": 0.5,
      "before-2003": 0
    }
  },
  "home-type": {
    index_type: "ADAPTIVE",
    options: {
      "detached-house": 1,
      "semi-detached-house-townhouse-or-duplex-joined-to-one-other-home": 0.67,
      "apartment-or-unit": 0.33,
      "other-for-example-mobile-home-granny-flat-caravan": 0
    }
  },
  "wall-material": {
    index_type: "ADAPTIVE",
    options: {
      "brick": 0.67,
      "weatherboard": 0.67,
      "cement-sheets": 0.33,
      "mixed": 0.5,
      "other": 0.5,
      "dont-know": 0.5
    }
  },
  "roof-type": {
    index_type: "ADAPTIVE",
    options: {
      "light-coloured": 1,
      "tiled": 0.5,
      "colourbond": 0.5,
      "dark-coloured": 0
    }
  },
  "home-insulation": {
    index_type: "ADAPTIVE",
    options: {
      "window-protection-eg-double-glazing-or-tinting": 0.33,
      "wall-insulation": 0.33,
      "roof-insulation": 0.33,
      "none": 0,
      "unsure": 0.5
    }
  },
  "external-shading": {
    index_type: "ADAPTIVE",
    options: {
      "external-blinds-awnings-or-shutters": 1,
      "no-built-in-shading-but-trees-provide-shade": 0.5,
      "no-external-external-shading-at-all": 0
    }
  },
  "home-modification": {
    index_type: "ADAPTIVE",
    options: {
      "yes-any-changes": 1,
      "some-small-changes": 0.5,
      "no": 0
    }
  },
  "routine-flexibility": {
    index_type: "ADAPTIVE",
    options: {
      "yes-usually": 1,
      "sometimes": 0.5,
      "no-i-cant-change-my-routine": 0
    }
  },
  "work-study-flexibility": {
    index_type: "ADAPTIVE",
    options: {
      "yes": 1,
      "no": 0,
      "na": 1
    }
  },
  "cool-retreat-knowledge": {
    index_type: "ADAPTIVE",
    options: {
      "yes-and-i-could-access-at-least-one-of-them": 1,
      "yes-but-i-would-have-difficulty-accessing-them-eg-transport-cost-hours-other-barriers": 0.5,
      "i-dont-have-any-cool-places": 0
    }
  },
  "local-amenities": {
    index_type: "ADAPTIVE",
    options: {
      "a-park-garden-or-green-space-with-shade-trees": 0.33,
      "a-beach-river-lake-or-other-water-body": 0.33,
      "a-public pool-or-splash-park": 0.33,
      "none-of-these": 0
    }
  },
  "heatwave-transport": {
    index_type: "ADAPTIVE",
    options: {
      "i-have-my-own-car": 1,
      "i-could-arrange-private-transport": 0.67,
      "i-could-use-public-transport": 0.33,
      "i-walk-ride-a-bike": 0.67,
      "i-would-have-difficulty-getting-there": 0
    }
  },
  "data-connectivity": {
    index_type: "ADAPTIVE",
    options: {
      "yes-always": 1,
      "sometimes": 0.5,
      "rarely": 0,
      "no-access": 0
    }
  }
};
export default  Object.entries(ASSESSMENT_SCORE_MAP);