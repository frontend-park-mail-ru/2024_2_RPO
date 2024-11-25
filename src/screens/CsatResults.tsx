import { getPollResults } from '@/api/poll';
import { defineStore } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { PollResults } from '@/types/poll';

const [useResStore, setResStore] = defineStore<PollResults | undefined>(
  'resstorecsat228',
  undefined
);
let a = false;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const CsatResults = (props: ComponentProps) => {
  const ddd = useResStore();
  if (!a) {
    a = true;
    getPollResults().then((res) => {
      setResStore(res);
    });
  }
  console.log('RERENDER');
  if (ddd === undefined) {
    return <div>Загрузка результатов....</div>;
  }
  ddd.ratingResults = ddd.ratingResults ? ddd.ratingResults : [];
  ddd.textResults = ddd.textResults ? ddd.textResults : [];
  ddd.textResults.forEach((rrr) => {
    rrr.text = rrr.text ? rrr.text : [];
  });
  return (
    <div style="display: flex; flex-direction:column">
      <h1>Результаты опроса на рейтинг</h1>
      {ddd.ratingResults.map((res) => {
        return (
          <div>
            <h3>{res.question.toString()}</h3>
            <div>Средний рейтинг: {res.rating.toString()}</div>
          </div>
        );
      })}

      <h1>Результаты опроса на текст</h1>

      {ddd.textResults.map((res) => {
        return (
          <div>
            <h3>Q: {res.question}</h3>
            <div>{res.text.map((text)=>{
              return <div>-{text}</div>
            })}</div>
          </div>
        );
      })}
    </div>
  );
};
