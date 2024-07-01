import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import pdf from 'pdf-parse';
import { getEmbeddingsTransformer, searchArgs } from '../../../lib/openai';
import { MongoDBAtlasVectorSearch } from '@langchain/community/vectorstores/mongodb_atlas';
import {customTextSplitter} from "../../../lib/tools/text-splitter";

export async function POST(req: NextRequest) {
    try {
        const formData: FormData = await req.formData();
        const uploadedFiles = formData.getAll('filepond').filter(item => item instanceof File);

        if (!uploadedFiles || uploadedFiles.length === 0) {
            console.log('No files found.');
            return NextResponse.json({ message: 'No files found' }, { status: 500 });
        }

        const uploadedFile = uploadedFiles[0];
        console.log('Uploaded file:', uploadedFile);

        if (!(uploadedFile instanceof Blob)) {
            console.log('Uploaded file is not in the expected format.');
            return NextResponse.json({ message: 'Uploaded file is not in the expected format' }, { status: 500 });
        }

        const fileName = uploadedFile.name.toLowerCase();
        console.log('File name:', fileName);

        const tempFilePath = `/tmp/${fileName}.pdf`;
        const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

        // Write the uploaded file to a temporary location
        await fs.writeFile(tempFilePath, fileBuffer);
        const dataBuffer = await fs.readFile(tempFilePath);

        // Parse the PDF file to extract text
        const data = await pdf(dataBuffer);
        const parsedText = data.text;
        console.log('Parsed text length:', parsedText.length);

        // Use custom text splitter
        const chunks = customTextSplitter(parsedText, 1000, 100);
        console.log('Number of chunks:', chunks.length);

        if (chunks.length === 0) {
            console.error('No text chunks created.');
            return NextResponse.json({ message: "No text chunks created." }, { status: 200 });
        }

        const validChunks = chunks.filter(chunk => typeof chunk === 'string' && chunk.trim().length > 0);
        console.log('Number of valid chunks:', validChunks.length);

        if (validChunks.length === 0) {
            console.error('No valid text chunks created.');
            return NextResponse.json({ message: "No valid text chunks created." }, { status: 200 });
        }

        // Sanitize chunks before storing
        const sanitizedChunks = validChunks.map(chunk => chunk.replace(/\s+/g, ' ').trim());
        console.log('Sanitized chunks:', sanitizedChunks);

        // Store chunks in MongoDB
        await MongoDBAtlasVectorSearch.fromTexts(
            sanitizedChunks,
            [],
            getEmbeddingsTransformer(),
            searchArgs()
        );

        return NextResponse.json({ message: "Uploaded to MongoDB" }, { status: 200 });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ message: "An error occurred during processing.", error: error.message }, { status: 500 });
    }
}
