export interface Question {
  id: number;
  text: string;
  type: 'answer_text' | 'answer_rating';
}

export interface PollSubmit {
  questionId: number;
  rating?: number;
  text?: string;
}

export interface TextResult {
  question: string;
  answers: string[];
}

export interface RatingResult {
  question: string;
  rating: string;
}

export interface PollResults {
  ratingResults: RatingResult[];
  answerResults: TextResult[];
}
