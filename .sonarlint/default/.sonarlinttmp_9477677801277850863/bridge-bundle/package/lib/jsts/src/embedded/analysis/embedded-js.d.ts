/**
 * An extracted embedded JavaScript code snippet
 *
 * @param code JS code
 * @param line Line where JS code starts
 * @param column Column where JS code starts
 * @param offset Offset where JS code starts
 * @param lineStarts Offset at each line start for the whole file
 * @param text Whole file content
 * @param format Format of the string that embeds the JS code
 * @param extras Additional data, filled by ExtrasPicker
 */
export type EmbeddedJS = {
    code: string;
    line: number;
    column: number;
    offset: number;
    lineStarts: number[];
    text: string;
    format: 'PLAIN' | 'BLOCK_FOLDED' | 'BLOCK_LITERAL';
    extras: {
        resourceName?: string;
    };
};
