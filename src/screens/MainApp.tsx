import { LeftPanel } from '@/containers/LeftPanel';
import { NavBar } from '@/containers/NavBar';
import { Button } from '@/components/Button';
import { ModalDialog } from '@/components/ModalDialog';
import { interfaceStateStore } from '@/stores/interfaceStateStore';
import { getApiUrl } from '@/api/apiHelper';

export const MainApp = () => {
  return [
    'MainApp',
    <>
      {interfaceStateStore.appState.isNewBoardDialogOpened
        ? ModalDialog({
            key: '228',
            title: 'Название новой доски',
            closeCallback: () => {
              interfaceStateStore.appState.isNewBoardDialogOpened = false;
              interfaceStateStore?.update();
            },
            children: (
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
                            interfaceStateStore.appState.isNewBoardDialogOpened =
                              false;
                          })
                          .catch(() => {
                            alert('Неизвестная ошибка на бэке');
                            interfaceStateStore.appState.isNewBoardDialogOpened =
                              false;
                          });
                      }
                    }
                  }}
                ></input>
              </div>
            ),
          })
        : undefined}
      {interfaceStateStore.appState.isBoardDeleteDialogOpened
        ? ModalDialog({
            key: '228',
            title: 'Вы точно хотите удалить доску?',
            children: (
              <div>
                <Button
                  key="yes_btn"
                  text="Да"
                  callback={() => {
                    const cb =
                      interfaceStateStore.appState.boardDeleteDialogCallback;
                    if (cb !== undefined) cb();
                    interfaceStateStore.appState.isBoardDeleteDialogOpened =
                      false;
                    interfaceStateStore?.update();
                  }}
                />
                <Button
                  key="no_btn"
                  text="Нет"
                  callback={() => {
                    interfaceStateStore.appState.isBoardDeleteDialogOpened =
                      false;
                    interfaceStateStore?.update();
                  }}
                />
              </div>
            ),
          })
        : undefined}
      <header>
        <NavBar key="navbar" />
      </header>

      {interfaceStateStore.appState.isLeftPanelOpened ? (
        <LeftPanel key="left_panel" />
      ) : undefined}

      <main>
        <img
          src="/static/backgroundPicture.png"
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
    </>,
  ];
};
