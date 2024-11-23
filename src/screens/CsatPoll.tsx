import { useState } from '@/jsxCore/hooks';
import './CsatPoll.scss';

interface Question {
  id: string;
  text: string;
  type: 'rating' | 'checkbox' | 'textarea';
  options?: string[];
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

export const CSATPoll = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [responses, setResponses] = useState<
    Record<string, number | string[] | string>
  >({});

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
                {[1, 2, 3, 4, 5].map(() => (
                  <i class="bi bi-star-fill star"></i>
                ))}
              </div>
            )}
            {question.type === 'checkbox' && (
              <div class="checkbox-group">
                {question.options?.map((option) => (
                  <label class="checkbox-option">
                    <input type="checkbox" /> {option}
                  </label>
                ))}
              </div>
            )}
            {question.type === 'textarea' && (
              <textarea
                class="textarea-input"
                placeholder="Ваши предложения..."
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
