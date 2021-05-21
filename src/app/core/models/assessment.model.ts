
export interface Assessment {
  id: number;
  title: string;
  grade: number;
  subject: Subjects;
  language_name?: string;
  country_name?: string;
  private: boolean;
}

enum Subjects {
  Math = 'MATH',
  Literacy = 'LITERACY'
}
