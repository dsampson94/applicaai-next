import pdf from 'pdf-parse';
import {NextRequest} from 'next/server';
import {ChatOpenAI} from '@langchain/openai';
import {handleResponse} from '../../../lib/server';
import {HumanMessage, MessageContentComplex, SystemMessage} from '@langchain/core/messages';

const RESOURCE_NAME = 'insights';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const extractTextFromPDF = async (base64: string): Promise<string> => {
    const base64Data = base64.split(',')[1];
    const pdfBuffer = Buffer.from(base64Data, 'base64');
    try {
        const data = await pdf(pdfBuffer);
        return data.text;
    } catch (error) {
        throw new Error('Failed to extract text from PDF');
    }
};

const getInsights = async (jobSpecUrl: string, userCvUrl: string, type: string): Promise<string | MessageContentComplex[]> => {
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
        const model = new ChatOpenAI({ apiKey: OPENAI_API_KEY, modelName: 'gpt-3.5-turbo' });

        const messages = [
            new SystemMessage({ content: "You are a helpful assistant." }),
            new HumanMessage({ content: userPrompt })
        ];

        const result = await model.invoke(messages);
        return result.content;
    } catch (error) {
        throw new Error('Failed to fetch insights');
    }
};

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { jobSpecUrl, userCvUrl, type } = body;

    try {
        const insights = await getInsights(jobSpecUrl, userCvUrl, type);
        return handleResponse(RESOURCE_NAME, '', insights);
    } catch (error) {
        return handleResponse(RESOURCE_NAME, error.message);
    }
}
