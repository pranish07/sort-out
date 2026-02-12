import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not defined in environment variables');
}

// Initializing with explicit apiVersion to avoid 404s on v1beta
// Note: gemini-1.5-flash is supported on v1, but the SDK sometimes defaults to v1beta
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Actually, in current SDK version, we set model-specific versions if needed, 
// but the easiest is to use a model that is available in both.

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
2. Understand and explain emotional needs
3. Help prevent emotional drift between partners
4. Offer actionable, practical suggestions
5. Be supportive and encouraging

Always maintain a calm, understanding tone. Focus on helping both partners feel heard and understood.`;

    // Try flash-latest first, then fallback to gemini-pro
    let model;
    try {
        model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash-latest',
            systemInstruction: systemPrompt
        });
    } catch (e) {
        console.warn('Failed to get gemini-1.5-flash-latest, falling back to gemini-pro', e);
        model = genAI.getGenerativeModel({
            model: 'gemini-pro'
        });
    }

    const userPrompt = `Analyze this relationship issue:

Issue: ${request.issue}

Partner 1 (${request.user1Gender}): ${request.user1Perspective}

Partner 2 (${request.user2Gender}): ${request.user2Perspective}

Please provide:
1. A balanced view of the situation
2. Understanding of Partner 1's perspective and why they might feel this way
3. Understanding of Partner 2's perspective and why they might feel this way
4. 3-5 actionable suggestions to resolve this issue

Format your response as a JSON object with keys: balancedView, user1Perspective, user2Perspective, suggestions (array). Do not include any markdown formatting like \`\`\`json.`;

    try {
        const result = await model.generateContent(userPrompt);
        const responseText = result.response.text();
        // Clean markdown if AI included it
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const response = JSON.parse(cleanedText || '{}');
        return response as AIAnalysisResponse;
    } catch (error) {
        console.error('Error analyzing relationship issue with Gemini:', error);
        throw new Error('Failed to analyze relationship issue');
    }
};

export const generateDailyTip = async (
    user1Gender: 'male' | 'female' | 'other',
    user2Gender: 'male' | 'female' | 'other',
    relationshipStatus: 'dating' | 'engaged' | 'married'
): Promise<string> => {
    const systemPrompt = `You are a relationship expert providing daily tips for couples. Keep tips warm, practical, and actionable. Focus on strengthening connection and preventing drift.`;

    // Try flash-latest first, then fallback to gemini-pro
    let model;
    try {
        model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash-latest',
            systemInstruction: systemPrompt
        });
    } catch (e) {
        model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    const userPrompt = `Generate a daily relationship tip for a ${relationshipStatus} couple (${user1Gender} and ${user2Gender}). Keep it under 100 words and make it actionable.`;

    try {
        const result = await model.generateContent(userPrompt);
        return result.response.text() || 'Take time today to appreciate your partner.';
    } catch (error) {
        console.error('Error generating daily tip with Gemini:', error);
        return 'Take time today to appreciate your partner.';
    }
};

export const generateAIReply = async (
    context: string,
    partnerGender: 'male' | 'female' | 'other',
    imageDescription?: string
): Promise<string> => {
    const systemPrompt = `You are helping someone get a fun, cute response "as if from their partner". Keep it playful, affectionate, and authentic. Match the partner's likely communication style.`;

    // Try flash-latest first, then fallback to gemini-pro
    let model;
    try {
        model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash-latest',
            systemInstruction: systemPrompt
        });
    } catch (e) {
        model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    const userPrompt = imageDescription
        ? `Context: ${context}\nImage: ${imageDescription}\n\nGenerate a cute, fun reply as if from a ${partnerGender} partner.`
        : `Context: ${context}\n\nGenerate a cute, fun reply as if from a ${partnerGender} partner.`;

    try {
        const result = await model.generateContent(userPrompt);
        return result.response.text() || 'Looks great! 😊';
    } catch (error) {
        console.error('Error generating AI reply with Gemini:', error);
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

    // Try flash-latest first, then fallback to gemini-pro
    let model;
    try {
        model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash-latest',
            systemInstruction: systemPrompt
        });
    } catch (e) {
        model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    const userPrompt = `Analyze potential drift:
  
User 1 needs: ${JSON.stringify(requirementsUser1)}
User 2 needs: ${JSON.stringify(requirementsUser2)}
Recent interactions: ${recentInteractions}
Days since last journal entry: ${daysSinceLastEntry}

Determine if there's drift, severity (low/medium/high), and reasons. Format as a JSON object with keys: hasDrift (boolean), severity (string), reasons (array of strings). Do not include markdown.`;

    try {
        const result = await model.generateContent(userPrompt);
        const responseText = result.response.text();
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const response = JSON.parse(cleanedText || '{}');
        return response;
    } catch (error) {
        console.error('Error detecting drift with Gemini:', error);
        return { hasDrift: false, severity: 'low', reasons: [] };
    }
};
