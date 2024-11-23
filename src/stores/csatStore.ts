import { pollMock } from '@/api/mocks/poll';
import { defineStore } from '@/jsxCore/hooks';

interface PollQuestion {
  id: number;
  text: string;
  type: 'answer_text' | 'answer_rating';
}

interface CsatStore {
  isOpened: boolean;
  currentQuestionIndex: number;
  questions: PollQuestion[];
}

export const [useCsatStore, setCsatStore] = defineStore<CsatStore>('csat', {
  isOpened: false,
  questions: pollMock,
  currentQuestionIndex: 0,
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
