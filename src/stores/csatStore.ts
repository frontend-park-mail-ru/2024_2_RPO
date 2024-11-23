import { defineStore } from '@/jsxCore/hooks';

interface PollQuestion {
  id: string;
  text: string;
  type: 'answer_text' | 'answer_rating';
  //   options?: Array<{ id: string; text: string }>;
}

interface CsatStore {
  isOpened: boolean;
  questions: PollQuestion[];
}

export const [useCsatStore, setCsatStore] = defineStore<CsatStore>('csat', {
  isOpened: true,
  questions: [],
});
