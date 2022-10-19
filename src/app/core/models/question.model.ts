
export interface Question {
  id: number;
  title: string;
  order: number;
  question_type: QuestionTypeEnum;
  hint: Hint;
  attachments: [];
  difficulty: QuestionDifficulty;
}

export interface QuestionSEL extends Question {
  sel_type: string;
}

export interface QuestionInput extends Question {
  valid_answer: string;
}

export interface QuestionNumberLine extends Question {
  start: number;
  end: number;
  step: number;
  expected_value: number;
  shuffle: boolean;
}

export interface QuestionDomino extends Question {
  expected_value: number;
  options: DominoOption[];
}

export interface QuestionSelect extends Question {
  options: SelectOption[];
}

export interface QuestionSort extends Question {
  category_A: string;
  category_B: string;
  options: SortOption[];
}

export interface QuestionDragAndDrop extends Question {
  areas: AreaOption[];
  drag_options: [];
  background_image: [];
}

export interface AreaOption {
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}

export interface SelectOption {
  id: number;
  value: string;
  valid: boolean;
  attachments: [];
}

export interface DominoOption {
  id: number;
  left_side_value: number;
  right_side_value: number;
  valid: boolean;
}

export interface SortOption {
  id: number;
  value: string;
  category: string;
  attachments: [];
}

enum QuestionTypeEnum {
  Input = 'INPUT',
  Select = 'SELECT',
  Sort = 'SORT',
  NumberLine = 'NUMBER_LINE',
  DragAndDrop = 'DRAG_AND_DROP',
  Domino = 'DOMINO'
}

enum QuestionDifficulty {
  'Difficulty 1' = 1,
  'Difficulty 2' = 2,
  'Difficulty 3' = 3,
}

export interface Hint {
  id: number;
  text: string;
  attachments: [];
}
