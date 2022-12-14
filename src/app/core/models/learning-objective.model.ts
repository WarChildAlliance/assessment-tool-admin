import { Topic } from './topic.model';

export interface LearningObjective {
  code: string;
  grade: number;
  topic: Topic;
  name_eng: string;
  name_ara: string;
}
