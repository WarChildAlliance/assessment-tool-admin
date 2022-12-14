import { QuestionSet } from './question-set.model';
import { Topic } from './topic.model';

export interface Assessment {
  id: number;
  title: string;
  grade: number;
  subject: Subjects;
  topic?: Topic;
  language_name?: string;
  country_name?: string;
  private: boolean;
  question_sets?: QuestionSet[];
}

enum Subjects {
  Math = 'MATH',
  Literacy = 'LITERACY'
}
