export interface Question {
  id: number;
  text: string;
  type: 'answer_text' | 'answer_rating';
}
