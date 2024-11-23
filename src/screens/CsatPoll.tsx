import { useState } from '@/jsxCore/hooks';
import './CsatPoll.scss';
import { ComponentProps } from '@/jsxCore/types';
// !!!!!!!!!!!!
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useCsatStore } from '@/stores/csatStore';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CSATPoll = (props: ComponentProps) => {
  const csat = JSON.parse(localStorage.getItem('csat_questions') as string);
  // Состояние текущего индекса вопроса
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = csat.questions[currentIndex];

  // Обработчик ответа на вопрос (для рейтинга)
  const handleResponse = (rating: number, text: string) => {
    const currentQuestion = csat.questions[currentIndex];
    if (currentQuestion.type === 'answer_rating') {
      console.log(
        'USER ANSWER: qId=',
        currentQuestion.id,
        ', answer: ',
        rating
      );
    } else {
      console.log('USER ANSWER: qId=', currentQuestion.id, ', answer: ', text);
    }
  };

  // Переход к следующему вопросу
  // const handleNext = () => {
  //   if (currentIndex < questions.length - 1) {
  //     setCurrentIndex(currentIndex + 1);
  //   } else {
  //     console.log('Опрос завершен. Ответы:', responses);
  //     // alert('Спасибо за участие в опросе!');
  //     window.parent.postMessage('close-iframe', '*'); // Закрытие iframe
  //   }
  // };

  // Текущий вопрос

  return (
    <div class="form-container">
      <div class="form">
        <h2 class="title">Оцените наш сервис</h2>

        <div class="question">
          <p>{currentQuestion.text}</p>

          {currentQuestion.type === 'answer_rating' && (
            <div class="rating">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  type="button"
                  class="star"
                  onClick={() => handleResponse(rating, '')}
                >
                  {rating}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'answer_text' && (
            <textarea
              class="textarea-input"
              placeholder="Ваш ответ"
              onInput={(e: Event) => {
                const target = e.target as HTMLTextAreaElement;
                handleResponse(0, target.value);
              }}
            />
          )}
        </div>

        <button
          type="button"
          class="submit-button"
          onClick={() => {
            setCurrentIndex(currentIndex + 1);
          }}
        >
          {currentIndex < csat.questions.length - 1
            ? 'Следующий вопрос'
            : 'Завершить'}
        </button>
      </div>
    </div>
  );
};
