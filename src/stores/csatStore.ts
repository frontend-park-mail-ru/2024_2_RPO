import { defineStore } from '@/jsxCore/hooks';

interface PollQuestion {
  id: number;
  text: string;
  type: 'answer_text' | 'answer_rating';
}

interface CsatStore {
  isOpened: boolean;
  currentSurvey: number;
  currentQuestionIndex: number;
  questions: PollQuestion[];
}

export const [useCsatStore, setCsatStore] = defineStore<CsatStore>('csat', {
  isOpened: true,
  currentSurvey: 1,
  currentQuestionIndex: 0,
  questions: [
    {
      id: 1,
      text: 'Насколько удобно пользоваться интерфейсом доски?',
      type: 'answer_rating',
    },
    {
      id: 2,
      text: 'Насколько понятен дизайн элементов (карточки, кнопки, меню)?',
      type: 'answer_rating',
    },
    {
      id: 3,
      text: 'Насколько логично расположены основные функции доски?',
      type: 'answer_rating',
    },
    {
      id: 4,
      text: 'Насколько удобно создавать и редактировать карточки?',
      type: 'answer_rating',
    },
    {
      id: 5,
      text: 'Оцените быстродействие сервиса при работе с большим количеством карточек.',
      type: 'answer_rating',
    },
    {
      id: 6,
      text: 'Насколько удобно пользоваться функциями поиска и фильтрации?',
      type: 'answer_rating',
    },
    {
      id: 7,
      text: 'Насколько удобно делиться досками и карточками с коллегами?',
      type: 'answer_rating',
    },
    {
      id: 8,
      text: 'Насколько эффективно работают уведомления о событиях?',
      type: 'answer_rating',
    },
    {
      id: 9,
      text: 'Оцените удобство ведения комментариев и обсуждений в карточках.',
      type: 'answer_rating',
    },
    {
      id: 10,
      text: 'Насколько вероятно, что вы порекомендуете наш сервис другим командам?',
      type: 'answer_rating',
    },
  ],
});

// Логика записи ответа и перехода к следующему вопросу
export const logResponse = (response: string | number) => {
  const store = useCsatStore(); // Получение текущего состояния
  const { currentQuestionIndex, questions } = store;

  const currentQuestion = questions[currentQuestionIndex];
  console.log(
    `Response recorded: Question ID=${currentQuestion.id}, Response=${response}`
  );

  if (currentQuestionIndex < questions.length - 1) {
    // Переход к следующему вопросу
    setCsatStore({
      ...store,
      currentQuestionIndex: currentQuestionIndex + 1,
    });
  } else {
    // Завершение опроса
    console.log('Survey completed!');
    setCsatStore({
      ...store,
      isOpened: false,
    });
  }
};

// Получение строки с прогрессом опроса
export const getSurveyProgress = (): string => {
  const store = useCsatStore();
  const { currentQuestionIndex, questions } = store;

  return `Вопрос ${currentQuestionIndex + 1} из ${questions.length}`;
};

export { PollQuestion };
