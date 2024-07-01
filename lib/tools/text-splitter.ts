function splitTextByParagraphs(text: string): string[] {
    return text.split(/\n\s*\n/);
}

function splitTextBySentences(text: string): string[] {
    return text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];
}

function splitTextByWords(text: string, chunkSize: number): string[] {
    const words = text.split(' ');
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentLength = 0;

    for (const word of words) {
        if (currentLength + word.length + 1 > chunkSize) {
            chunks.push(currentChunk.join(' '));
            currentChunk = [];
            currentLength = 0;
        }
        currentChunk.push(word);
        currentLength += word.length + 1; // Include space
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }

    return chunks;
}

function recursiveSplitText(
    text: string,
    chunkSize: number,
    overlap: number,
    minChunkSize: number = 200
): string[] {
    // Ensure chunkSize is a positive integer
    chunkSize = Math.max(1, Math.floor(chunkSize));

    // Ensure overlap is a non-negative integer and less than chunkSize
    overlap = Math.max(0, Math.min(Math.floor(overlap), chunkSize - 1));

    const paragraphs = splitTextByParagraphs(text);
    const chunks: string[] = [];

    for (let paragraph of paragraphs) {
        if (paragraph.length <= chunkSize) {
            chunks.push(paragraph);
        } else {
            const sentences = splitTextBySentences(paragraph);
            let currentChunk: string[] = [];
            let currentLength = 0;

            for (let sentence of sentences) {
                if (currentLength + sentence.length > chunkSize) {
                    if (currentLength >= minChunkSize) {
                        chunks.push(currentChunk.join(' '));
                        currentChunk = [];
                        currentLength = 0;
                    }
                }

                currentChunk.push(sentence);
                currentLength += sentence.length;
            }

            if (currentChunk.length > 0) {
                chunks.push(currentChunk.join(' '));
            }
        }
    }

    // Ensure no chunk is larger than chunkSize
    const finalChunks: string[] = [];
    for (const chunk of chunks) {
        if (chunk.length > chunkSize) {
            finalChunks.push(...splitTextByWords(chunk, chunkSize));
        } else {
            finalChunks.push(chunk);
        }
    }

    // Apply overlap
    if (overlap > 0 && finalChunks.length > 1) {
        const overlappedChunks: string[] = [];
        for (let i = 0; i < finalChunks.length; i++) {
            if (i > 0) {
                const overlapText = finalChunks[i - 1].slice(-overlap);
                overlappedChunks.push(overlapText + finalChunks[i]);
            } else {
                overlappedChunks.push(finalChunks[i]);
            }
        }
        return overlappedChunks;
    }

    return finalChunks;
}

// Exported function to use in your server-side code
export function customTextSplitter(text: string, chunkSize: number, overlap: number): string[] {
    try {
        console.log(`Splitting text of length ${text.length} with chunkSize ${chunkSize} and overlap ${overlap}`);
        return recursiveSplitText(text, chunkSize, overlap);
    } catch (error) {
        console.error('Error in customTextSplitter:', error);
        return [text]; // Fallback to return the whole text as a single chunk in case of any error
    }
}
