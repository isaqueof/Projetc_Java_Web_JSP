import { EmbeddedJS } from '@sonar/jsts';
/**
 * Parses HTML file and extracts JS code
 * We look for script tags without src attribute, meaning the code is
 * inline between open and close tags.
 */
export declare function parseHTML(code: string): EmbeddedJS[];
