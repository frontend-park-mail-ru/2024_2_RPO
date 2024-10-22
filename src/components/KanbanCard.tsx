import { ComponentProps } from '@/jsxCore/types';

interface KanbanCardProps extends ComponentProps {
  text: string;
  coverUrl?: string;
}

export const KanbanCard = (props: KanbanCardProps) => {
  return (
    <div class="kanban-card">
      {props.coverUrl !== undefined ? (
        <img src={props.coverUrl} class="kanban-card__cover"></img>
      ) : undefined}
      {props.text}
    </div>
  );
};
