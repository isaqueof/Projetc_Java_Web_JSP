/**
 * Extracts from a YAML file all the embedded JavaScript code snippets either
 * in AWS Lambda Functions or AWS Serverless Functions.
 */
export declare const parseAwsFromYaml: (text: string) => import("../../../jsts/src").EmbeddedJS[];
