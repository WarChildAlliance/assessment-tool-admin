import { Language } from "./language.model";

export interface Country {
    code: string,
    name_en: string,
    name_local?: string,
    language: Language
}