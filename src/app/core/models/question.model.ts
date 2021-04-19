import { Topic } from './topic.models';

export interface Question {
    title: string;
    assessment_topic: Topic;
    question_type: string;
  }
