import { Subtopic } from './subtopic.model';

export interface LearningObjective {
  code: string;
  grade: number;
  subtopic: Subtopic;
  name_eng: string;
  name_ara: string;
}
