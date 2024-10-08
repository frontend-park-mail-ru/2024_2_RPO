import { LeftPanel } from '/containers/LeftPanel.js';
import { NavBar } from '/containers/NavBar.js';
import { ButtonComponent } from '/components/Button.js';
import { ModalDialog } from '/components/ModalDialog.js';
import { getAppISS, interfaceStateStore } from '/stores/interfaceStateStore.js';
import { getApiUrl } from '../api/apiHelper.js';

export const MainApp = () => {
  return (
    <>
      {getAppISS().isNewBoardDialogOpened
        ? ModalDialog({
            title: 'Название новой доски',
            closeCallback: () => {
              getAppISS().isNewBoardDialogOpened = false;
              interfaceStateStore?.update();
            },
            content: (
              <div>
                <input
                  ON_keydown={(event: KeyboardEvent) => {
                    if (event.key === 'Enter') {
                      const src = event.target;

                      if (src instanceof HTMLInputElement) {
                        fetch(getApiUrl('/boards'), {
                          method: 'POST',
                          credentials: 'include',
                          body: JSON.stringify({
                            name: src.value,
                            description: 'Generic desc',
                          }),
                          headers: { 'Content-Type': 'application/json' },
                        })
                          .then(() => {
                            interfaceStateStore?.updateRegAndApp();
                            getAppISS().isNewBoardDialogOpened = false;
                          })
                          .catch(() => {
                            alert('Неизвестная ошибка на бэке');
                            getAppISS().isNewBoardDialogOpened = false;
                          });
                      }
                    }
                  }}
                ></input>
              </div>
            ),
          })
        : undefined}
      {getAppISS().isBoardDeleteDialogOpened
        ? ModalDialog({
            title: 'Вы точно хотите удалить доску?',
            content: (
              <div>
                {ButtonComponent({
                  text: 'Да',
                  callback: () => {
                    const cb = getAppISS().boardDeleteDialogCallback;
                    if (cb !== undefined) cb();
                    getAppISS().isBoardDeleteDialogOpened = false;
                    interfaceStateStore?.update();
                  },
                })}
                {ButtonComponent({
                  text: 'Нет',
                  callback: () => {
                    getAppISS().isBoardDeleteDialogOpened = false;
                    interfaceStateStore?.update();
                  },
                })}
              </div>
            ),
          })
        : undefined}
      <header>{NavBar()}</header>

      {getAppISS().isLeftPanelOpened ? LeftPanel() : undefined}

      <main>
        <img
          src="/static/backgroundPicture.png"
          class="backgroundPicture"
          alt=""
        />

        <div class="board">
          <div class="board__column">
            <div class="board__column__header">
              <div class="board__column__title">Апокалипсис</div>
              <div class="board__column__dots-button">
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
