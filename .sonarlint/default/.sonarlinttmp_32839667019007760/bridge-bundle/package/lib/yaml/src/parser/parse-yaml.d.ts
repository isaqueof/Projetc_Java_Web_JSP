import { EmbeddedJS } from '@sonar/jsts';
/**
 * A bundle of Yaml visitor predicate and Extras picker
 * We have bundled these together because they depend on each other
 * and should be used in pairs
 */
export type ParsingContext = {
    predicate: YamlVisitorPredicate;
    picker: ExtrasPicker;
};
/**
 * A function predicate to select a YAML node containing JS code
 */
export type YamlVisitorPredicate = (key: any, node: any, ancestors: any) => boolean;
/**
 * A function that picks extra data to save in EmbeddedJS
 */
export type ExtrasPicker = (key: any, node: any, ancestors: any) => {};
/**
 * Parses YAML file and extracts JS code according to the provided predicate
 */
export declare function parseYaml(parsingContexts: ParsingContext[], text: string): EmbeddedJS[];
