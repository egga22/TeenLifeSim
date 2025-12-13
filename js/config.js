// Configuration and Constants

const CONFIG = {
    // Game version
    version: '0.1.0',
    
    // Initial character stats
    initialStats: {
        happiness: 70,
        health: 80,
        intelligence: 60,
        social: 65,
        energy: 75
    },
    
    // Stat limits
    statLimits: {
        min: 0,
        max: 100
    },
    
    // Starting age and grade
    startingAge: 13,
    startingGrade: 8,
    
    // Time progression
    daysInWeek: 7,
    weeksInMonth: 4,
    monthsInYear: 12,
    schoolYears: 5, // 8th through 12th grade
    
    // Seasons
    seasons: ['Fall', 'Winter', 'Spring', 'Summer'],
    
    // Relationship types
    relationshipTypes: ['friend', 'romantic', 'family', 'teacher', 'rival'],
    
    // Stat change thresholds for events
    statThresholds: {
        critical: 20,
        low: 40,
        high: 80
    },
    
    // AI Configuration
    ai: {
        modelName: 'gemini-1.5-pro',
        temperature: 0.9,
        maxTokens: 500
    },
    
    // Local storage keys
    storageKeys: {
        gameState: 'teenLifeSim_gameState',
        settings: 'teenLifeSim_settings',
        apiKey: 'teenLifeSim_apiKey'
    }
};

// Event categories and weights
const EVENT_CATEGORIES = {
    school: { weight: 0.3, requiresSchoolDay: true },
    social: { weight: 0.25 },
    family: { weight: 0.15 },
    personal: { weight: 0.2 },
    random: { weight: 0.1 }
};

// Days of the week
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Grade names
const GRADE_NAMES = {
    8: '8th',
    9: '9th',
    10: '10th',
    11: '11th',
    12: '12th'
};
