import { Topic } from './topic.models';

export interface Question {
  title: string;
  question_type: string;
  assessment_topic: Topic;
}
