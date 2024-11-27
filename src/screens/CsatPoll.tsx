import { useState } from '@/jsxCore/hooks';
import './CsatPoll.scss';
import { ComponentProps } from '@/jsxCore/types';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { submitAnswer } from '@/api/poll';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CsatPoll = (props: ComponentProps) => {
  const csat: {
    questionText: string;
    questionId: number;
    questionType: 'answer_rating' | 'answer_text';
  }[] = JSON.parse(localStorage.getItem('csat_questions') as string);
  console.log('CSAT from local storage: ', csat);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentText, setCurrentText] = useState('');

  const currentQuestion = csat[currentIndex];
  console.log('Current Question: ', currentQuestion);

  // Обработчик ответа на вопрос (для рейтинга)
  const handleResponse = () => {
    if (currentQuestion.questionType === 'answer_rating') {
      if (currentRating !== 0) {
        submitAnswer({
          questionId: currentQuestion.questionId,
          rating: currentRating,
        });
      }
    } else {
      if (currentText.length > 0) {
        submitAnswer({
          questionId: currentQuestion.questionId,
          text: currentText,
        });
      }
    }
  };

  return (
    <div class="csat-poll__form">
      {currentIndex < csat.length && (
        <div class="csat-poll__question">
          <p>{currentQuestion.questionText}</p>

          {currentQuestion.questionType === 'answer_rating' && (
            <div class="rating">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div ON_click={() => setCurrentRating(rating)}>
                  <i
                    className={[
                      'csat-poll__star',
                      rating > currentRating
                        ? 'bi-star csat-poll__star__inactive'
                        : 'bi-star-fill csat-poll__star__active',
                    ]}
                  />
                </div>
              ))}
            </div>
          )}

          {currentQuestion.questionType === 'answer_text' && (
            <Input
              key="answer_question"
              onChanged={(newValue) => setCurrentText(newValue)}
            />
          )}
          <Button
            key="next_button"
            callback={() => {
              console.log('next');
              handleResponse();
              setCurrentRating(0);
              setCurrentText('');
              setCurrentIndex(currentIndex + 1);
            }}
            text={
              currentIndex < csat.length - 1 ? 'Следующий вопрос' : 'Завершить'
            }
            variant={
              currentRating > 0 || currentText.length > 0 ? 'accent' : 'default'
            }
          ></Button>
        </div>
      )}
      {currentIndex === csat.length && (
        <div>
          Спасибо за Ваши ответы! Мы становимся лучше благодаря Вам!
          <Button
            key="close_window"
            text="Закрыть"
            variant="accent"
            callback={() => {
              postMessage('close_csat');
            }}
          />
        </div>
      )}
    </div>
  );
};
