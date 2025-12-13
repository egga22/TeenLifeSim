// Gemini API Integration

class GeminiAPI {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/';
        this.model = CONFIG.ai.modelName;
    }

    // Set API key
    setApiKey(key) {
        this.apiKey = key;
    }

    // Check if API is configured
    isConfigured() {
        return this.apiKey !== null && this.apiKey.length > 0;
    }

    // Generate event using Gemini API
    async generateEvent(context) {
        if (!this.isConfigured()) {
            throw new Error('API key not configured');
        }

        const prompt = this.buildEventPrompt(context);

        try {
            const response = await fetch(
                `${this.baseURL}${this.model}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: CONFIG.ai.temperature,
                            maxOutputTokens: CONFIG.ai.maxTokens,
                        }
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates.length > 0) {
                const text = data.candidates[0].content.parts[0].text;
                return this.parseEventResponse(text);
            }

            throw new Error('No response from API');
        } catch (error) {
            console.error('Gemini API error:', error);
            throw error;
        }
    }

    // Build prompt for event generation
    buildEventPrompt(context) {
        const { character, time, relationships, recentHistory } = context;

        return `You are a creative writer for a teenage life simulation game. Generate a realistic and engaging event for a teenage character.

Character Context:
- Name: ${character.name}
- Age: ${character.age}
- Grade: ${character.grade}th grade
- Happiness: ${character.stats.happiness}/100
- Health: ${character.stats.health}/100
- Intelligence: ${character.stats.intelligence}/100
- Social: ${character.stats.social}/100
- Energy: ${character.stats.energy}/100

Current Situation:
- Day: ${time.day}, Week: ${time.week}, ${time.season}
- Day of week: ${DAYS_OF_WEEK[time.dayOfWeek - 1]}

Relationships: ${relationships.length > 0 ? relationships.map(r => `${r.name} (${r.value}/100)`).join(', ') : 'None yet'}

Generate a JSON response with this exact structure:
{
  "title": "Event Title (short, engaging)",
  "description": "Event description (2-3 sentences, realistic teenage scenario)",
  "emoji": "single relevant emoji",
  "category": "one of: school, social, family, personal, random",
  "choices": [
    {
      "text": "Choice 1 text (action-oriented)",
      "effects": {"happiness": 0, "health": 0, "intelligence": 0, "social": 0, "energy": 0},
      "resultText": "Outcome description (1 sentence)",
      "relationship": {"name": "Person Name", "change": 0}
    },
    {
      "text": "Choice 2 text",
      "effects": {"happiness": 0, "health": 0, "intelligence": 0, "social": 0, "energy": 0},
      "resultText": "Outcome description"
    },
    {
      "text": "Choice 3 text",
      "effects": {"happiness": 0, "health": 0, "intelligence": 0, "social": 0, "energy": 0},
      "resultText": "Outcome description"
    }
  ]
}

Guidelines:
- Make events realistic for a ${character.age}-year-old in ${character.grade}th grade
- School events on weekdays, social/family events on weekends
- Effects should range from -15 to +15
- Energy costs should be negative for most activities
- Each choice should have different tradeoffs
- Keep tone appropriate for teens (PG-13)
- Focus on relatable situations: school, friendships, family, hobbies, emotions
- Make choices meaningful with clear consequences

Respond ONLY with valid JSON, no other text.`;
    }

    // Parse the API response
    parseEventResponse(text) {
        try {
            // Extract JSON from response (in case there's extra text)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const event = JSON.parse(jsonMatch[0]);

            // Validate event structure
            if (!event.title || !event.description || !event.choices || !Array.isArray(event.choices)) {
                throw new Error('Invalid event structure');
            }

            // Ensure we have at least 2 choices
            if (event.choices.length < 2) {
                throw new Error('Event must have at least 2 choices');
            }

            // Set defaults for missing fields
            event.id = 'ai_generated_' + Date.now();
            event.emoji = event.emoji || '📅';
            event.category = event.category || 'random';

            // Validate and normalize choices
            event.choices = event.choices.map(choice => ({
                text: choice.text,
                effects: choice.effects || {},
                resultText: choice.resultText || 'Something happens.',
                relationship: choice.relationship || null
            }));

            return event;
        } catch (error) {
            console.error('Failed to parse event response:', error);
            throw new Error('Failed to parse AI response');
        }
    }

    // Generate a contextual response to a choice
    async generateChoiceOutcome(event, choice, context) {
        if (!this.isConfigured()) {
            return choice.resultText;
        }

        try {
            const prompt = `Character ${context.character.name} chose: "${choice.text}" in response to: "${event.description}". Write a brief (1-2 sentences) outcome description that feels natural and realistic for a teenage life. Keep it PG-13.`;

            const response = await fetch(
                `${this.baseURL}${this.model}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.8,
                            maxOutputTokens: 100,
                        }
                    })
                }
            );

            if (!response.ok) {
                return choice.resultText;
            }

            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
                return data.candidates[0].content.parts[0].text.trim();
            }

            return choice.resultText;
        } catch (error) {
            console.error('Failed to generate outcome:', error);
            return choice.resultText;
        }
    }
}
