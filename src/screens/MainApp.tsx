import { LeftPanel } from '@/containers/LeftPanel';
import { NavBar } from '@/containers/NavBar';
import { ComponentProps } from '@/jsxCore/types';
import { useState } from '@/jsxCore/hooks';
import { UserProfile } from '@/containers/UserProfile';
import { KanbanBoard } from '@/containers/KanbanBoard';
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
