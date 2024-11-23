import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import './CsatPoll.scss';

interface Question {
  id: string;
  text: string;
  type: 'rating' | 'checkbox' | 'textarea'; // Добавляем новый тип: textarea
  options?: string[]; // Варианты для чекбоксов (если type === 'checkbox')
}

const questions: Question[] = [
  {
    id: '1',
    text: 'Насколько удобно пользоваться интерфейсом доски?',
    type: 'rating',
  },
  {
    id: '2',
    text: 'Насколько понятен дизайн элементов (карточки, кнопки, меню)?',
    type: 'rating',
  },
  {
    id: '3',
    text: 'Насколько логично расположены основные функции доски?',
    type: 'rating',
  },
  {
    id: '4',
    text: 'Какие улучшения нужны в сервисе?',
    type: 'checkbox',
    options: [
      'Улучшить дизайн',
      'Добавить GIF',
      'Добавить проверку регистрации по почте',
    ],
  },
  {
    id: '5',
    text: 'Какие изменения вы хотели бы увидеть в нашем сервисе?',
    type: 'textarea',
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CSATPoll = (props: ComponentProps) => {
  const [responses, setResponses] = useState<
    Record<string, number | string[] | string>
  >({});
  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});

  const handleStarClick = (questionId: string, value: number) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
    setHoveredStars({
      ...hoveredStars,
      [questionId]: 0,
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

  const handleCheckboxChange = (questionId: string, option: string) => {
    const currentResponses = (responses[questionId] as string[]) || [];
    const updatedResponses = currentResponses.includes(option)
      ? currentResponses.filter((item) => item !== option)
      : [...currentResponses, option];

    setResponses({
      ...responses,
      [questionId]: updatedResponses,
    });
  };

  const handleTextareaChange = (questionId: string, value: string) => {
    setResponses({
      ...responses,
      [questionId]: value,
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

            {question.type === 'rating' && (
              <div class="rating">
                {[1, 2, 3, 4, 5].map((star) => {
                  const response = responses[question.id];
                  const isActive =
                    typeof response === 'number' &&
                    (hoveredStars[question.id] >= star || response >= star);

                  return (
                    <i
                      class={`bi bi-star-fill star ${isActive ? 'active' : ''}`}
                      onmouseenter={() => handleStarHover(question.id, star)}
                      onmouseleave={() => handleStarHoverLeave(question.id)}
                      onclick={() => handleStarClick(question.id, star)}
                    ></i>
                  );
                })}
              </div>
            )}

            {question.type === 'checkbox' && (
              <div class="checkbox-group">
                {question.options?.map((option) => (
                  <label class="checkbox-option">
                    <input
                      type="checkbox"
                      onchange={() => handleCheckboxChange(question.id, option)}
                      checked={(
                        (responses[question.id] as string[]) || []
                      ).includes(option)}
                    />
                    {option}
                  </label>
                ))}
                <input
                  type="text"
                  class="custom-input"
                  placeholder="Введите свой вариант..."
                  oninput={(e: { target: HTMLInputElement }) =>
                    handleCheckboxChange(
                      question.id,
                      (e.target as HTMLInputElement).value
                    )
                  }
                />
              </div>
            )}

            {question.type === 'textarea' && (
              <textarea
                class="textarea-input"
                placeholder="Напишите свой ответ здесь..."
                oninput={(e: { target: HTMLTextAreaElement }) =>
                  handleTextareaChange(
                    question.id,
                    (e.target as HTMLTextAreaElement).value
                  )
                }
                value={(responses[question.id] as string) || ''}
              ></textarea>
            )}
          </div>
        ))}

        <button type="submit" class="submit-button">
          Отправить
        </button>
      </form>
    </div>
  );
};
