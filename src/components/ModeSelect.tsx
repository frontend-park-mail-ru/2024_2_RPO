/**
 * Компонент выбора режима отображения доски
 * @returns JSX выбора режима отображения доски
 */

import { ComponentProps } from '@/jsxCore/types';

interface ModeSelectProps extends ComponentProps {
  currentMode: 'kanban' | 'list';
}
export const ModeSelect = (props: ModeSelectProps) => {
  console.log(props);
  return (
    <div class="currentMode">
      <div class="mode">
        <i class="bi bi-kanban"></i>
      </div>
      <div style="padding-left: 5px;flex-grow:1">Канбан</div>
      <div>
        <i class="bi bi-chevron-down"></i>
      </div>
    </div>
  );
};
