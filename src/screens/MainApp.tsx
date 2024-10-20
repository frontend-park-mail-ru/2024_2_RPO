import { LeftPanel } from '@/containers/LeftPanel';
import { NavBar } from '@/containers/NavBar';
import { ComponentProps } from '@/jsxCore/types';
import { useState } from '@/jsxCore/hooks';
import { KanbanBoard } from '@/containers/KanbanBoard';

type MainAppProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MainApp = (props: MainAppProps) => {
  const [leftPanelOpened, setLeftPanelOpened] = useState(false);
  return (
    <>
      <NavBar
        leftPanelOpened={leftPanelOpened}
        setLeftPanelOpened={setLeftPanelOpened}
        key="nav_bar"
      />

      {leftPanelOpened ? <LeftPanel key="left_panel" /> : undefined}

      <main>
        <img
          src="/static/img/backgroundPicture.png"
          class="backgroundPicture"
          alt=""
        />

        <KanbanBoard key="kanban-board" />
      </main>
    </>
  );
};
