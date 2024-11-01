import { ComponentProps } from "@/jsxCore/types";

interface BoardCardProps extends ComponentProps {
  title?: string;
  lastVisit?: string;
  lastUpdate?: string;
  boardId: number;
}

/**
 * Компонент карточки доски для левого меню
 * @param props Пропсы карточки доски для левого меню
 * @returns JSX карточки доски для левого меню
 */
export const BoardCardComponent = (props: BoardCardProps) => {
  return (
    <div class="left-menu__card__info">
      {props.title !== undefined ? (
        <div class="left-menu__board-card__title">{props.title}</div>
      ) : undefined}

      {props.lastVisit !== undefined ? (
        <div class="left-menu__board-card__subtext">
          Последнее посещение: {props.lastVisit}
        </div>
      ) : undefined}

      {props.lastUpdate !== undefined ? (
        <div class="left-menu__board-card__subtext">
          Последнее обновление: {props.lastUpdate}
        </div>
      ) : undefined}
    </div>
  );
};
