import { useState } from '@/jsxCore/hooks';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CSATSurvey = () => {
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [hoveredStars, setHoveredStars] = useState<{ [key: string]: number }>(
    {}
  );

  const handleStarClick = (questionId: string, value: number) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleStarHover = (questionId: string, value: number) => {
    setHoveredStars((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleStarHoverLeave = (questionId: string) => {
    setHoveredStars((prev) => ({
      ...prev,
      [questionId]: 0,
    }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Submitted Responses: ', responses);
    alert('Спасибо за заполнение опроса!');
  };

  return (
    <div style={formContainerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={titleStyle}>Оцените удобство использования Канбан-досок</h2>

        {questions.map((question) => (
          <div key={question.id} style={questionStyle}>
            <p>{question.text}</p>

            <div style={ratingStyle}>
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className="bi bi-star"
                  style={{
                    ...starStyle,
                    ...(hoveredStars[question.id] >= star ||
                    responses[question.id] >= star
                      ? activeStarStyle
                      : {}),
                  }}
                  onMouseEnter={() => handleStarHover(question.id, star)}
                  onMouseLeave={() => handleStarHoverLeave(question.id)}
                  onClick={() => handleStarClick(question.id, star)}
                ></i>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" style={submitButtonStyle}>
          Отправить
        </button>
      </form>
    </div>
  );
};
