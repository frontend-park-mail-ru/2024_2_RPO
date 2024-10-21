import { LeftPanel } from '@/containers/LeftPanel';
import { NavBar } from '@/containers/NavBar';
import { ComponentProps } from '@/jsxCore/types';
import { useState } from '@/jsxCore/hooks';
import { UserProfile } from '@/containers/UserProfile';
import { KanbanBoard } from '@/containers/KanbanBoard';
import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';

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
      <UserProfile key="user_profile" />

      <ModalDialog
        key="modal_dialog"
        title="2232441324234142324"
        isOpened={false}
        closeCallback={() => {}}
      >
        <div>
          <Button key="yes_btn" text="Да" callback={() => {}} />
          <Button key="no_btn" text="Нет" callback={() => {}} />
        </div>
      </ModalDialog>
      <header>
        <NavBar
          leftPanelOpened={leftPanelOpened}
          setLeftPanelOpened={setLeftPanelOpened}
          key="nav_bar"
        />
      </header>

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
