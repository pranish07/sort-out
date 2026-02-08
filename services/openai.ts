import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

export interface AIAnalysisRequest {
    issue: string;
    user1Perspective: string;
    user2Perspective: string;
    user1Gender: 'male' | 'female' | 'other';
    user2Gender: 'male' | 'female' | 'other';
}

export interface AIAnalysisResponse {
    balancedView: string;
    user1Perspective: string;
    user2Perspective: string;
    suggestions: string[];
}

export const analyzeRelationshipIssue = async (
    request: AIAnalysisRequest
): Promise<AIAnalysisResponse> => {
    const systemPrompt = `You are a warm, empathetic relationship counselor for couples. Your role is to:
1. Provide balanced, non-judgmental analysis of relationship issues
2. Understand and explain male vs female emotional needs
3. Help prevent emotional drift between partners
4. Offer actionable, practical suggestions
5. Be supportive and encouraging

Always maintain a calm, understanding tone. Focus on helping both partners feel heard and understood.`;

    const userPrompt = `Analyze this relationship issue:

Issue: ${request.issue}

Partner 1 (${request.user1Gender}): ${request.user1Perspective}

Partner 2 (${request.user2Gender}): ${request.user2Perspective}

Please provide:
1. A balanced view of the situation
2. Understanding of Partner 1's perspective and why they might feel this way
3. Understanding of Partner 2's perspective and why they might feel this way
4. 3-5 actionable suggestions to resolve this issue

Format your response as JSON with keys: balancedView, user1Perspective, user2Perspective, suggestions (array)`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
        });

        const response = JSON.parse(completion.choices[0].message.content || '{}');
        return response as AIAnalysisResponse;
    } catch (error) {
        console.error('Error analyzing relationship issue:', error);
        throw new Error('Failed to analyze relationship issue');
    }
};

export const generateDailyTip = async (
    user1Gender: 'male' | 'female' | 'other',
    user2Gender: 'male' | 'female' | 'other',
    relationshipStatus: 'dating' | 'engaged' | 'married'
): Promise<string> => {
    const systemPrompt = `You are a relationship expert providing daily tips for couples. Keep tips warm, practical, and actionable. Focus on strengthening connection and preventing drift.`;

    const userPrompt = `Generate a daily relationship tip for a ${relationshipStatus} couple (${user1Gender} and ${user2Gender}). Keep it under 100 words and make it actionable.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.8,
            max_tokens: 150,
        });

        return completion.choices[0].message.content || 'Take time today to appreciate your partner.';
    } catch (error) {
        console.error('Error generating daily tip:', error);
        return 'Take time today to appreciate your partner.';
    }
};

export const generateAIReply = async (
    context: string,
    partnerGender: 'male' | 'female' | 'other',
    imageDescription?: string
): Promise<string> => {
    const systemPrompt = `You are helping someone get a fun, cute response "as if from their partner". Keep it playful, affectionate, and authentic. Match the partner's likely communication style.`;

    const userPrompt = imageDescription
        ? `Context: ${context}\nImage: ${imageDescription}\n\nGenerate a cute, fun reply as if from a ${partnerGender} partner.`
        : `Context: ${context}\n\nGenerate a cute, fun reply as if from a ${partnerGender} partner.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            temperature: 0.9,
            max_tokens: 100,
        });

        return completion.choices[0].message.content || 'Looks great! 😊';
    } catch (error) {
        console.error('Error generating AI reply:', error);
        return 'Looks great! 😊';
    }
};

export const detectDrift = async (
    requirementsUser1: any,
    requirementsUser2: any,
    recentInteractions: number,
    daysSinceLastEntry: number
): Promise<{ hasDrift: boolean; severity: 'low' | 'medium' | 'high'; reasons: string[] }> => {
    const systemPrompt = `You are a relationship drift detector. Analyze patterns and identify potential emotional drift between partners. Be gentle but honest.`;

    const userPrompt = `Analyze potential drift:
  
User 1 needs: ${JSON.stringify(requirementsUser1)}
User 2 needs: ${JSON.stringify(requirementsUser2)}
Recent interactions: ${recentInteractions}
Days since last journal entry: ${daysSinceLastEntry}

Determine if there's drift, severity (low/medium/high), and reasons. Format as JSON with keys: hasDrift, severity, reasons (array)`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.5,
        });

        const response = JSON.parse(completion.choices[0].message.content || '{}');
        return response;
    } catch (error) {
        console.error('Error detecting drift:', error);
        return { hasDrift: false, severity: 'low', reasons: [] };
    }
};
