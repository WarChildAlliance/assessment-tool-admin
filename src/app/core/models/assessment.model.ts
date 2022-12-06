import { Topic } from './topic.models';
import { Subtopic } from './subtopic.model';

export interface Assessment {
  id: number;
  title: string;
  grade: number;
  subject: Subjects;
  subtopic?: Subtopic;
  language_name?: string;
  country_name?: string;
  private: boolean;
  topics?: Topic[];
}

enum Subjects {
  Math = 'MATH',
  Literacy = 'LITERACY'
}
