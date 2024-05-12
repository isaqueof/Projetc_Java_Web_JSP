import Detector from './Detector';
import LanguageFootprint from './LanguageFootprint';
export declare class JavaScriptFootPrint implements LanguageFootprint {
    detectors: Set<Detector>;
    constructor();
    getDetectors(): Set<Detector>;
}
