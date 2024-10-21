import { ComponentProps } from '@/jsxCore/types';

interface KanbanCardProps extends ComponentProps {
  text: string;
  coverUrl?: string;
}

export const KanbanCard = (props: KanbanCardProps) => {
  return <div class="kanban-card">{props.text}</div>;
};
