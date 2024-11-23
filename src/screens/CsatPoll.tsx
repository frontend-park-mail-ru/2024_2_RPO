import { useCsatStore, setCsatStore, PollQuestion } from '@/stores/csatStore';

export const CSATPoll = () => {
  const csat = useCsatStore();
  const questions = csat.questions[csat.currentSurvey];

  const handleAnswer = (questionId: string, answer: string | number) => {
    setCsatStore({
      ...csat,
      responses: {
        ...csat.responses,
        [questionId]: answer,
      },
    });
  };

  const handleNext = () => {
    if (csat.currentSurvey < 4) {
      setCsatStore({ ...csat, currentSurvey: csat.currentSurvey + 1 });
    } else {
      // Завершение опроса
      setCsatStore({
        ...csat,
        isOpened: false,
        currentSurvey: 1,
        responses: {},
      });
      alert('Спасибо за участие в нашем опросе!');
    }
  };

  return (
    <div class="form-container">
      <form class="form">
        <h2 class="title">Опрос №{csat.currentSurvey}</h2>
        {questions.map((question: PollQuestion) => (
          <div key={question.id} class="question">
            <p>{question.text}</p>
            {question.type === 'answer_rating' && (
              <div class="rating">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    class="rating-button"
                    onclick={() => handleAnswer(question.id, rating)}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            )}
            {question.type === 'answer_text' && (
              <textarea
                class="textarea-input"
                placeholder="Ваш ответ"
                oninput={(e: Event) => {
                  const target = e.target as HTMLTextAreaElement;
                  handleAnswer(question.id, target.value);
                }}
              ></textarea>
            )}
          </div>
        ))}
        <button type="button" class="submit-button" onclick={handleNext}>
          {csat.currentSurvey < 4 ? 'К следующему опросу' : 'Завершить опрос'}
        </button>
      </form>
    </div>
  );
};
