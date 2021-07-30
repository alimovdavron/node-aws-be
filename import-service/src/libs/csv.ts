import csv from "csv-parser";
import ReadableStream = NodeJS.ReadableStream;

interface Options {
    logContent: boolean;
}

export const fromStream = async (stream: ReadableStream, options: Options) => {
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
