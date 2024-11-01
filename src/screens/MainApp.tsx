import { LeftPanel } from '@/containers/LeftPanel';
import { NavBar } from '@/containers/NavBar';
import { ComponentProps } from '@/jsxCore/types';
import { useState } from '@/jsxCore/hooks';
import { UserProfile } from '@/containers/UserProfile';
import { KanbanBoard } from '@/containers/KanbanBoard';
import { useModalDialogsStore } from '@/stores/modalDialogsStore';
import { BoardSettings } from '@/containers/BoardSettings';
import { useActiveBoardStore } from '@/stores/activeBoardStore';
import { setBoardsStore, useBoardsStore } from '@/stores/boardsStore';
import { getBoards } from '@/api/boards';
import { Board } from '@/types/board';

type MainAppProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MainApp = (props: MainAppProps) => {
  const [leftPanelOpened, setLeftPanelOpened] = useState(false);
  const modalDialogsStore = useModalDialogsStore();
  const activeBoard = useActiveBoardStore();
  const boards=useBoardsStore()
  if(boards===undefined){
    getBoards().then((newBoards: Board[]) => {
      setBoardsStore(newBoards);
    });
  }

  return (
    <>
      <NavBar
        leftPanelOpened={leftPanelOpened}
        setLeftPanelOpened={setLeftPanelOpened}
        key="nav_bar"
      />
      {modalDialogsStore.isUserProfileOpened && (
        <UserProfile key="user_profile" />
      )}
      {modalDialogsStore.isBoardSettingsOpened && (
        <BoardSettings key="board_settings" />
      )}

      {leftPanelOpened && <LeftPanel key="left_panel" />}

      <main>
        <img
          src="/static/img/backgroundPicture.png"
          class="app__background-image"
          alt=""
        />

        {activeBoard !== undefined && <KanbanBoard key="kanban-board" />}
      </main>
    </>
  );
};
