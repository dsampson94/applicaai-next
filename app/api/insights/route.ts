import pdf from 'pdf-parse';
import fetch from 'node-fetch';
import {handleResponse} from '../../../lib/server';
import {NextRequest} from 'next/server';

const RESOURCE_NAME = 'insights';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


const extractTextFromPDF = async (base64: string): Promise<string> => {
    const base64Data = base64.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    try {
        const data = await pdf(pdfBuffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
};

const getInsights = async (jobSpecUrl: string, userCvUrl: string, type: string): Promise<string | null> => {
    const specText = await extractTextFromPDF(jobSpecUrl);
    const cvText = await extractTextFromPDF(userCvUrl);

    let userPrompt = '';
    switch (type) {
        case 'mockInterview':
            userPrompt = `Create a thoughtful, probable mock job interview dialogue between an interviewer and interviewee based on this job specification - ${specText} and this applicant's resume - ${cvText} that the reader can use to practice for their upcoming job interview.`;
            break;
        case 'suitability':
            userPrompt = `Evaluate the suitability of this applicant based on this job specification - ${specText} and this applicant's resume - ${cvText}. Provide detailed feedback.`;
            break;
        case 'tips':
            userPrompt = `Provide tips and advice for this applicant based on this job specification - ${specText} and this applicant's resume - ${cvText}.`;
            break;
        default:
            throw new Error('Invalid request type');
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {role: 'system', content: 'You are a helpful assistant.'},
                    {role: 'user', content: userPrompt},
                ],
                max_tokens: 2000,
            }),
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            console.error('No valid choices returned from OpenAI:', data);
            throw new Error('No valid choices returned from OpenAI');
        }
    } catch (error) {
        console.error('Error fetching insights from OpenAI:', error);
        throw new Error('Failed to fetch insights');
    }
};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { jobSpecUrl, userCvUrl, type } = body;

    try {
        const insights = await getInsights(jobSpecUrl, userCvUrl, type);
        return handleResponse(RESOURCE_NAME, '', insights);
    } catch (error: any) {
        return handleResponse(RESOURCE_NAME, error.message);
    }
};
