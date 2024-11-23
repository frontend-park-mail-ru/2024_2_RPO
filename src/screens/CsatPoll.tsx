import { useState } from '@/jsxCore/hooks';
import './CsatPoll.scss';
import { ComponentProps } from '@/jsxCore/types';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { submitAnswer } from '@/api/poll';
import { Question } from '@/types/poll';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CSATPoll = (props: ComponentProps) => {
  const csat: Question[] = JSON.parse(
    localStorage.getItem('csat_questions') as string
  );
  // Состояние текущего индекса вопроса
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentText, setCurrentText] = useState('');

  const currentQuestion = csat[currentIndex];

  // Обработчик ответа на вопрос (для рейтинга)
  const handleResponse = (rating: number, text: string) => {
    const currentQuestion = csat[currentIndex];
    if (currentQuestion.type === 'answer_rating') {
      if (currentRating !== 0) {
        submitAnswer({ questionId: currentQuestion.id, rating: currentRating });
      }
    } else {
      if (currentText.length > 0) {
        submitAnswer({ questionId: currentQuestion.id, text: currentText });
      }
      console.log('USER ANSWER: qId=', currentQuestion.id, ', answer: ', text);
    }
  };

  return (
    <div class="form-container">
      <div class="form">
        <h2 class="title">Оцените наш сервис</h2>

        <div class="question">
          <p>{currentQuestion.text}</p>

          {currentQuestion.type === 'answer_rating' && (
            <div class="rating">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div ON_click={() => setCurrentRating(rating)}>
                  <i
                    class={rating > currentRating ? 'bi-star' : 'bi-star-fill'}
                    style={
                      rating > currentRating ? 'color: black' : 'color: yellow'
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {currentQuestion.type === 'answer_text' && (
            <Input
              key="answer_question"
              onChanged={(newValue) => setCurrentText(newValue)}
            />
          )}
        </div>

        <Button
          key="next_button"
          callback={() => {
            console.log('next');
            handleResponse(currentRating, currentText);
            setCurrentRating(0);
            setCurrentText('');
            setCurrentIndex(currentIndex + 1);
          }}
          text={
            currentIndex < csat.length - 1 ? 'Следующий вопрос' : 'Завершить'
          }
        ></Button>
      </div>
    </div>
  );
};
