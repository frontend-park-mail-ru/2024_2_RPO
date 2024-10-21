import { LeftPanel } from '@/containers/LeftPanel';
import { NavBar } from '@/containers/NavBar';
import { ComponentProps } from '@/jsxCore/types';
import { useState } from '@/jsxCore/hooks';
import { UserProfile } from '@/containers/UserProfile';
import { KanbanBoard } from '@/containers/KanbanBoard';
import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { useModalDialogsStore } from '@/stores/modalDialogsStore';

type MainAppProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MainApp = (props: MainAppProps) => {
  const [leftPanelOpened, setLeftPanelOpened] = useState(false);
  const modalDialogsStore = useModalDialogsStore();

  return (
    <>
      <NavBar
        leftPanelOpened={leftPanelOpened}
        setLeftPanelOpened={setLeftPanelOpened}
        key="nav_bar"
      />
      {modalDialogsStore.isUserProfileOpened ? (
        <UserProfile key="user_profile" />
      ) : undefined}

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

      {leftPanelOpened ? <LeftPanel key="left_panel" /> : undefined}

      <main>
        <img
          src="/static/img/backgroundPicture.png"
          class="app__background-image"
          alt=""
        />

        <KanbanBoard key="kanban-board" />
      </main>
    </>
  );
};
