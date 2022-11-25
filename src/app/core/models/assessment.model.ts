import { Topic } from './topic.models';

export interface Assessment {
  id: number;
  title: string;
  grade: number;
  subject: Subjects;
  language_name?: string;
  country_name?: string;
  private: boolean;
  topics?: Topic[];
}

enum Subjects {
  Math = 'MATH',
  Literacy = 'LITERACY'
}
