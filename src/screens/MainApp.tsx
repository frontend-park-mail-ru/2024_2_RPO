import { LeftPanel } from '@/containers/LeftPanel';
import { NavBar } from '@/containers/NavBar';
import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { interfaceStateStore } from '@/stores/interfaceStateStore';
import { ComponentProps } from '@/jsxCore/types';
import { useState } from '@/jsxCore/hooks';
// import { UserProfile } from '@/containers/UserProfile';

// import { UserPopup } from '@/containers/UserPopup';
import { UserPopup } from '@/containers/UserPopup';
import { UserProfile } from '@/containers/UserProfile';

type MainAppProps = ComponentProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MainApp = (props: MainAppProps) => {
  const [leftPanelOpened, setLeftPanelOpened] = useState(false);
  const [dialogOpened, setDialogOpened] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dialogTitle, setDialogTitle] = useState('Unset');
  return (
    <>
      <UserPopup key="usr_popup" isOpened={true} />
      <UserProfile key="user_profile" />

      <ModalDialog
        key="modal_dialog"
        title={dialogTitle}
        isOpened={dialogOpened}
        closeCallback={() => {
          setDialogOpened(false);
        }}
      >
        <div>
          <Button
            key="yes_btn"
            text="Да"
            callback={() => {
              const cb = interfaceStateStore.appState.boardDeleteDialogCallback;
              if (cb !== undefined) cb();
              interfaceStateStore.appState.isBoardDeleteDialogOpened = false;
              interfaceStateStore?.update();
            }}
          />
          <Button
            key="no_btn"
            text="Нет"
            callback={() => {
              interfaceStateStore.appState.isBoardDeleteDialogOpened = false;
              interfaceStateStore?.update();
            }}
          />
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

        <div class="board">
          <div class="kanban-column">
            <div class="kanban-column__header">
              <div class="kanban-column__title">Апокалипсис</div>
              <div class="kanban-column__dots-button">
                <i
                  class="bi-three-dots"
                  style="margin-left: 3px; margin-top: 3px;"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
