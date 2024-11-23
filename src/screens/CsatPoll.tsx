import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import './CsatPoll.scss';

interface Question {
  id: string;
  text: string;
  //type: 'text' | 'rating';
}

const questions: Question[] = [
  { id: '1', text: 'Насколько удобно пользоваться интерфейсом доски?' },
  {
    id: '2',
    text: 'Насколько понятен дизайн элементов (карточки, кнопки, меню)?',
  },
  { id: '3', text: 'Насколько логично расположены основные функции доски?' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CSATPoll = (props: ComponentProps) => {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});

  const handleStarClick = (questionId: string, value: number) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const handleStarHover = (questionId: string, value: number) => {
    setHoveredStars({
      ...hoveredStars,
      [questionId]: value,
    });
  };

  const handleStarHoverLeave = (questionId: string) => {
    setHoveredStars({
      ...hoveredStars,
      [questionId]: 0,
    });
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Submitted Responses: ', responses);
    alert('Спасибо за заполнение опроса!');
  };

  return (
    <div class="form-container">
      <form onsubmit={handleSubmit} class="form">
        <h2 class="title">Оцените удобство использования Канбан-досок</h2>

        {questions.map((question) => (
          <div class="question">
            <p>{question.text}</p>

            <div class="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  class={`bi bi-star star ${
                    hoveredStars[question.id] >= star ||
                    responses[question.id] >= star
                      ? 'active'
                      : ''
                  }`}
                  onmouseenter={() => handleStarHover(question.id, star)}
                  onmouseleave={() => handleStarHoverLeave(question.id)}
                  onclick={() => handleStarClick(question.id, star)}
                ></i>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" class="submit-button">
          Отправить
        </button>
      </form>
    </div>
  );
};
