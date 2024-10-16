/**
 * Компонент выбора режима отображения доски
 * @returns JSX выбора режима отображения доски
 */

import { ComponentProps } from '@/jsxCore/types';

interface ModeSelectProps extends ComponentProps {
  currentMode: 'kanban' | 'list';
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const ModeSelect = (props: ModeSelectProps) => {
  return (
    <div class="mode-select">
      <div>
        <i class="bi bi-kanban"></i>
      </div>
      <div style="padding-left: 5px;flex-grow:1">Канбан</div>
      <div class="mode-select__chevron-icon">
        <i class="bi-chevron-down"></i>
      </div>
    </div>
  );
};
