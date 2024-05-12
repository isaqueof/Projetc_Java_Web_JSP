import Detector from './Detector';
export default interface LanguageFootprint {
    getDetectors(): Set<Detector>;
}
