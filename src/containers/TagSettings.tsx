import { ComponentProps } from '@/jsxCore/types';
import './tagSettings.scss';
import { useActiveBoardStore } from '@/stores/activeBoardStore';
import { useState } from '@/jsxCore/hooks';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { addTag, removeTag } from '@/api/tags';
import { showToast } from '@/stores/toastNotificationStore';
import { reloadContent } from './CardDetails';

const pleasantColors = [
  '#FF5733', // Яркий апельсиновый
  '#33FF57', // Ярко-зелёный
  '#3357FF', // Ярко-синий
  '#F1C40F', // Солнечный жёлтый
  '#8E44AD', // Лиловый
  '#2ECC71', // Изумрудный
  '#E74C3C', // Красный Алый
  '#3498DB', // Голубой
  '#1ABC9C', // Бирюзовый
  '#9B59B6', // Аметистовый
  '#34495E', // Тёмно-синий
  '#16A085', // Морской чай
  '#27AE60', // Лесной зелёный
  '#2980B9', // Среднее синее
  '#D35400', // Тыквенный
  '#C0392B', // Пунцовый
  '#BDC3C7', // Серебристый
  '#7F8C8D', // Бетонный серый
  '#F39C12', // Оранжевый
  '#E67E22', // Морковный
  '#ECF0F1', // Облачный белый
  '#95A5A6', // Конкретный серый
  '#D68910', // Золотисто-оранжевый
  '#BA4A00', // Горчично-коричневый
  '#A04000', // Рыжий
  '#F4D03F', // Урожайный жёлтый
  '#884EA0', // Тёмный Орхидея
  '#2E86C1', // Голубой ленточный
  '#28B463', // Клеверный зелёный
  '#239B56', // Морской зелёный
  '#FF6F61', // Коралловый
  '#6B5B95', // Индиго
  '#88B04B', // Папоротниковый зелёный
  '#F7CAC9', // Розовый кварц
  '#92A8D1', // Пастельно-голубой
  '#955251', // Малиновый
  '#B565A7', // Сливовый
  '#009B77', // Бирюзовый
  '#DD4124', // Ржаво-красный
  '#45B8AC', // Карибский зелёный
  '#EFC050', // Золотое сияние
  '#5B5EA6', // Ирисовый
  '#9B2335', // Клюквенный
  '#F7B7A3', // Персиковый
  '#C5D86D', // Светло-оливковый
  '#FFB5E8', // Нежно-розовый
  '#A8E6CE', // Мятный
  '#DCEDC1', // Бледно-зелёный
  '#FFD3B6', // Светло-оранжевый
  '#FFAAA5', // Лососевый
  '#FF8C42', // Жжёный оранжевый
  '#CDB4DB', // Лавандовый
  '#FFC75F', // Шафрановый
  '#F9F871', // Лимонный
  '#D4A5A5', // Пыльно-розовый
  '#A7C5BD', // Мягкий бирюзовый
  '#EFECCA', // Бежевый
  '#B2E1F0', // Пудрово-голубой
  '#FFC9DE', // Нежно-розовый
  '#C9CCD5', // Светло-серый
  '#FFA384', // Светлый коралловый
  '#BEE3DB', // Пудрово-голубой
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TagSettings = (props: ComponentProps) => {
  const activeBoard = useActiveBoardStore();

  const [isInput, setIsInput] = useState(false);
  const [content, setContent] = useState('');

  if (activeBoard === undefined) {
    return <div>Ошибка!</div>;
  }

  const addNewTag = () => {
    if (content.length < 3) {
      showToast('Название тега не меньше 3 символов', 'error');
      return;
    }
    if (content.length > 30) {
      showToast('Название тега не больше 30 символов', 'error');
      return;
    }
    addTag(
      activeBoard.board.id,
      pleasantColors[Math.floor(Math.random() * pleasantColors.length)],
      content
    ).then((newTag) => {
      if (newTag !== undefined) {
        showToast('Успешно добавлен тег!', 'success');
        reloadContent();
      }
    });
  };

  return (
    <div class="tag-settings">
      {activeBoard.tags.length > 0 ? (
        <div>
          {activeBoard.tags.map((tag) => {
            return (
              <div class="tag__entry">
                <div
                  class="tag__circle"
                  style={`background-color: ${tag.color}`}
                ></div>
                <div style="flex-grow:1">{tag.text}</div>
                {activeBoard.myRole !== 'viewer' && (
                  <div
                    class="tag__remove"
                    ON_click={() => {
                      removeTag(tag.id).then((ok) => {
                        if (ok) {
                          showToast('Успешно удалён тег!', 'success');
                          reloadContent();
                        }
                      });
                    }}
                  >
                    <i class="bi-trash" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div>На доске нет тегов!</div>
      )}
      {isInput ? (
        <div>
          <Input
            focusOnInstance
            placeholder="Название тега"
            key="tag_name_input"
            onChanged={(newContent) => {
              setContent(newContent);
            }}
            onEscape={() => {
              setIsInput(false);
              setContent('');
            }}
            onEnter={addNewTag}
          />
          <Button
            key="add_tag"
            variant="accent"
            icon="bi-tag"
            text="Добавить"
            callback={addNewTag}
            fullWidth
          />
          <Button
            key="cancel_tag"
            icon="bi-x-lg"
            text="Отменить"
            fullWidth
            callback={() => {
              setIsInput(false);
              setContent('');
            }}
          />
        </div>
      ) : (
        <Button
          key="new_tag"
          variant={activeBoard.tags.length > 0 ? 'default' : 'accent'}
          fullWidth
          icon="bi-tag"
          text="Добавить тег"
          callback={() => {
            setIsInput(true);
          }}
        />
      )}
    </div>
  );
};
