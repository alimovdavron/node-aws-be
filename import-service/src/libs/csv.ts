import csv from "csv-parser";
import ReadableStream = NodeJS.ReadableStream;

export const fromStream = async (stream: ReadableStream, options: { logContent: boolean; }) => {
    const parsedCSVRows = [];
    new Promise((resolve, reject) => {
        stream.pipe(csv())
            .on('data', (row) => {
                if(options.logContent) console.log(row);
                parsedCSVRows.push(row);
            })
            .on('end', () => {
                resolve(parsedCSVRows);
            })
            .on('error', reject)
    })
}

export const handlePerRecord = async (stream: ReadableStream, handler: Function) => {
    new Promise<void>((resolve, reject) => {
        stream.pipe(csv())
            .on('data', async (row) => {
                handler(row);
            })
            .on('end', () => {
                resolve();
            })
            .on('error', reject)
    })
}