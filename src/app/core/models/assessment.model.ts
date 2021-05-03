import { Language } from "./language.model";

export interface Assessment {
  id: number;
  title: string;
  grade: number;
  subject: Subjects;
  language?: string;
  country?: string;
  private: boolean;
}

enum Subjects {
  Math = 'MATH',
  Literacy = 'LITERACY'
}
