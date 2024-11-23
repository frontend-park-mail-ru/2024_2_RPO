import { defineStore } from '@/jsxCore/hooks';

interface PollQuestion {
  id: string;
  text: string;
  type: 'answer_text' | 'answer_rating';
}

interface CsatStore {
  isOpened: boolean;
  currentSurvey: number;
  questions: Record<number, PollQuestion[]>;
  responses: Record<string, string | number>;
}

export const [useCsatStore, setCsatStore] = defineStore<CsatStore>('csat', {
  isOpened: true,
  currentSurvey: 1,
  questions: {
    1: [
      {
        id: '1-1',
        text: 'Насколько удобно пользоваться интерфейсом доски?',
        type: 'answer_rating',
      },
      {
        id: '1-2',
        text: 'Насколько понятен дизайн элементов (карточки, кнопки, меню)?',
        type: 'answer_rating',
      },
      {
        id: '1-3',
        text: 'Насколько логично расположены основные функции доски?',
        type: 'answer_rating',
      },
    ],
    2: [
      {
        id: '2-1',
        text: 'Насколько удобно создавать и редактировать карточки?',
        type: 'answer_rating',
      },
      {
        id: '2-2',
        text: 'Оцените быстродействие сервиса при работе с большим количеством карточек.',
        type: 'answer_rating',
      },
      {
        id: '2-3',
        text: 'Насколько удобно пользоваться функциями поиска и фильтрации?',
        type: 'answer_rating',
      },
    ],
    3: [
      {
        id: '3-1',
        text: 'Насколько удобно делиться досками и карточками с коллегами?',
        type: 'answer_rating',
      },
      {
        id: '3-2',
        text: 'Насколько эффективно работают уведомления о событиях?',
        type: 'answer_rating',
      },
      {
        id: '3-3',
        text: 'Оцените удобство ведения комментариев и обсуждений в карточках.',
        type: 'answer_rating',
      },
    ],
    4: [
      {
        id: '4-1',
        text: 'Насколько вероятно, что вы порекомендуете наш сервис другим командам?',
        type: 'answer_rating',
      },
    ],
  },
  responses: {},
});

export { PollQuestion };
