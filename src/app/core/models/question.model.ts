
export interface Question {
  id: number;
  title: string;
  order: number;
  question_type: QuestionTypeEnum;
  hint: Hint;
  attachments: [];
}

export interface QuestionInput extends Question {
  valid_answer: string;
}

export interface QuestionNumberLine extends Question {
  expected_value: number;
  start: number;
  end: number;
  step: number;
  show_value: boolean;
  show_ticks: boolean;
}

export interface QuestionSelect extends Question {
  multiple: boolean;
  options: SelectOption[];
}

export interface QuestionSort extends Question {
  category_A: string;
  category_B: string;
  options: SortOption[];
}

export interface QuestionDragAndDrop extends Question {
  drop_areas: AreaOption[];
  drag_items: [];
  background_image: any;
}

export interface AreaOption {
  coordinates: {
    x: number,
    y: number,
    width: number,
    height: number
  };
  name: string;
}

export interface SelectOption {
  id: number;
  value: string;
  valid: boolean;
  attachments: [];
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
}

export interface Hint {
  id: number;
  text: string;
  attachments: [];
}
