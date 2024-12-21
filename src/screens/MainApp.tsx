import { LeftPanel } from '@/containers/LeftPanel';
import { NavBar } from '@/containers/NavBar';
import { ComponentProps } from '@/jsxCore/types';
import { useState } from '@/jsxCore/hooks';
import { UserProfile } from '@/containers/UserProfile';
import { KanbanBoard } from '@/containers/KanbanBoard';
import {
  closeTagsModalDialog,
  useModalDialogsStore,
} from '@/stores/modalDialogsStore';
import { BoardSettings } from '@/containers/BoardSettings';
import { useActiveBoardStore } from '@/stores/activeBoardStore';
import { setBoardsStore, useBoardsStore } from '@/stores/boardsStore';
import { getBoards } from '@/api/boards';
import { Board } from '@/types/types';
import { setCsatStore, useCsatStore } from '@/stores/csatStore';
import { ModalDialog } from '@/components/ModalDialog';
import {
  setCardDetailsStore,
  useCardDetailsStore,
} from '@/stores/cardDetailsStore';
import { CardDetailsContainer } from '@/containers/CardDetails';
import { setPreviewStore, usePreviewStore } from '@/stores/previewStore';
import { goToUrl, useRouterStore } from '@/stores/routerStore';
import { Button } from '@/components/Button';
import './mainApp.scss';
import { joinInviteLink } from '@/api/members';
import { useMeStore } from '@/stores/meStore';
import { ListBoard } from '@/containers/ListBoard';
import { TagSettings } from '@/containers/TagSettings';
import {
  setSearchResultStore,
  useSearchResultStore,
} from '@/stores/searchResultStore';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MainApp = (props: ComponentProps) => {
  const [leftPanelOpened, setLeftPanelOpened] = useState(false);
  const modalDialogsStore = useModalDialogsStore();
  const activeBoard = useActiveBoardStore();
  const preview = usePreviewStore();
  const boards = useBoardsStore();
  const csat = useCsatStore();
  const cardDetails = useCardDetailsStore();
  const me = useMeStore();
  const router = useRouterStore();
  const search = useSearchResultStore();

  if (boards === undefined) {
    getBoards().then((newBoards: Board[]) => {
      setBoardsStore(newBoards);
    });
  }
  if (csat.isOpened) {
    localStorage.setItem('csat_questions', JSON.stringify(csat.questions));
  }

  return (
    <>
      <NavBar
        leftPanelOpened={leftPanelOpened}
        setLeftPanelOpened={setLeftPanelOpened}
        key="nav_bar"
      />
      {modalDialogsStore.isUserProfileOpened && (
        <UserProfile key="user-profile" />
      )}

      {csat.isOpened && (
        <ModalDialog
          title="Оцените наш сервис"
          isOpened={true}
          closeCallback={() => {
            setCsatStore({ ...csat, isOpened: false });
          }}
          key="csat-modal"
        >
          <iframe
            id="iframe-root"
            src={`/csat_poll`}
            style="width: 100%; border: none;"
            ON_load={(ev: Event) => {
              const tgt = ev.target as HTMLIFrameElement;
              tgt.style.height =
                (tgt.contentWindow as Window).document.body.clientHeight +
                10 +
                'px';
              const interval = setInterval(() => {
                try {
                  tgt.style.height =
                    (tgt.contentWindow as Window).document.body.clientHeight +
                    20 +
                    'px';
                } catch {
                  clearInterval(interval);
                }
              }, 500);
            }}
          ></iframe>
        </ModalDialog>
      )}

      {modalDialogsStore.isBoardSettingsOpened && (
        <BoardSettings key="board_settings" />
      )}

      {leftPanelOpened && (
        <LeftPanel
          key="left_panel"
          closeCallback={() => {
            setLeftPanelOpened(false);
          }}
        />
      )}

      {cardDetails !== undefined && (
        <ModalDialog
          isOpened={true}
          title="Подробности карточки"
          key="card_details_modal_dialog"
          closeCallback={() => {
            if (preview) {
              setPreviewStore(undefined);
              setCardDetailsStore(undefined);
              if (me !== undefined) {
                goToUrl('/app');
              } else {
                goToUrl('/');
              }
              return;
            }
            setCardDetailsStore(undefined);
          }}
        >
          <CardDetailsContainer key="card_details"></CardDetailsContainer>
        </ModalDialog>
      )}

      {preview !== undefined && preview.type === 'board' && (
        <ModalDialog
          isOpened={true}
          title="Приглашение на доску"
          key="board_invite_modal_dialog"
          closeCallback={() => {
            setPreviewStore(undefined);
            if (me) {
              goToUrl('/app');
            } else {
              goToUrl('/');
            }
          }}
        >
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="board-invite__title">{preview.board.title}</div>
            <img
              class="board-invite__image"
              src={preview.board.backgroundImageUrl}
            />
            <div class="board-invite__buttons">
              <Button
                key="board_invite_reject_btn"
                variant="default"
                icon="bi-x-lg"
                fullWidth
                text="Отмена"
                callback={() => {
                  setPreviewStore(undefined);
                  if (me) {
                    goToUrl('/app');
                  } else {
                    goToUrl('/');
                  }
                }}
              />
              <Button
                key="board_invite_accept_btn"
                variant="accent"
                fullWidth
                icon="bi-rocket-takeoff"
                text={
                  me !== undefined
                    ? 'Присоединиться'
                    : 'Войдите, чтобы присоединиться'
                }
                callback={() => {
                  if (me === undefined) {
                    goToUrl('/');
                    return;
                  }
                  joinInviteLink(preview.uuid).then(() => {
                    goToUrl(`/app/board_${preview.board.id}/kanban`);
                    setPreviewStore(undefined);
                  });
                }}
              />
            </div>
          </div>
        </ModalDialog>
      )}

      <main>
        {activeBoard !== undefined && (
          <img
            src={activeBoard.board.backgroundImageUrl}
            class="app__background-image"
            alt=""
          />
        )}
        {preview !== undefined && (
          <img
            src={preview.board.backgroundImageUrl}
            class="app__background-image"
            alt=""
          />
        )}
        {modalDialogsStore.isTagSettingsOpened && (
          <ModalDialog
            key="tag_settings_modal_dialog"
            title="Настройки тегов"
            isOpened={true}
            closeCallback={closeTagsModalDialog}
          >
            <TagSettings key="real_tag_settings" />
          </ModalDialog>
        )}
        {search !== undefined && (
          <ModalDialog
            key="search_results"
            title="Результаты поиска"
            isOpened={true}
            closeCallback={() => {
              setSearchResultStore(undefined);
            }}
          >
            <div>{search.length === 0 && <div>Ничего не найдено!</div>}</div>
            <div>
              {search.length > 0 &&
                search.map((r) => {
                  return (
                    <div
                      class="assigned-user"
                      style="cursor: pointer"
                      ON_click={() => {
                        setSearchResultStore(undefined);
                        goToUrl(`${window.location.origin}/card/${r.cardUuid}`);
                      }}
                    >
                      {r.text}
                    </div>
                  );
                })}
            </div>
          </ModalDialog>
        )}
        {activeBoard === undefined && preview === undefined && (
          <div class="onboarding__wrapper-bg">
            {me === undefined ? (
              <div class="section__buttons">
                <img
                  class="onboarding__image"
                  src="/static/img/onboarding.svg"
                />
                <Button
                  text="Зарегистрироваться"
                  callback={() => goToUrl('/register')}
                  key="register-button"
                  variant="accent"
                />
                <Button
                  text="Войти"
                  callback={() => goToUrl('/login')}
                  key="login-button"
                  variant="default"
                />
              </div>
            ) : (
              <div class="onboarding__advice-container">
                <img
                  class="onboarding__image"
                  src="/static/img/onboarding.svg"
                />
                <span class="onboarding__text">
                  Чтобы приступить к работе, выберите доску в левом меню
                </span>
              </div>
            )}
          </div>
        )}

        {activeBoard !== undefined && router.isKanban && (
          <KanbanBoard key="kanban-board" />
        )}
        {activeBoard !== undefined && router.isList && (
          <ListBoard key="list-board" />
        )}
      </main>
    </>
  );
};
