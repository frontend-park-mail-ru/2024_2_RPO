interface BoardCardProps {
    title?: string;
    lastVisit?: string;
    lastUpdate?: string;
  }
  
  export const BoardCardComponent = (props: BoardCardProps = {}) => {
    return (
      <div class="left__menu__card__info">
        {props.title !== undefined ? (
          <div
            class="left__menu__card__name__title"
            style="font-size: 18px; font-weight: bold"
          >
            {props.title}
          </div>
        ) : undefined}
        
        {props.lastVisit !== undefined ? (
          <div class="left__menu__card__name__text" style="font-size:12px;">
            Последнее посещение: {props.lastVisit}
          </div>
        ) : undefined}
  
        {props.lastUpdate !== undefined ? (
          <div class="left__menu__card__name__subtext" style="font-size:12px;">
            Последнее обновление: {props.lastUpdate}
          </div>
        ) : undefined}
      </div>
    );
  };
  