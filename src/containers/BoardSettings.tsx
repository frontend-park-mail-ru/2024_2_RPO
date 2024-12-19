import { ModalDialog } from '@/components/ModalDialog';
import { closeBoardSettingsModalDialog } from '@/stores/modalDialogsStore';
import { Button } from '@/components/Button';
import { SelectBox, SelectBoxOption } from '@/components/SelectBox';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { Input } from '@/components/Input';
import { createInviteLink, removeMember, updateMember } from '@/api/members';
import { setMembersStore, useMembersStore } from '@/stores/members';
import { showToast } from '@/stores/toastNotificationStore';
import { useMeStore } from '@/stores/meStore';
import { ActiveBoard, User } from '@/types/types';
import { goToUrl } from '@/stores/routerStore';
import { deleteBoard, setBoardBackgroundImage } from '@/api/boards';
import './boardSettings.scss';

// На будущее
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const modeOptions: SelectBoxOption[] = [
  { title: 'Все задачи', icon: 'bi-bell' },
  { title: 'Только мои задачи', icon: 'bi-person-badge' },
  { title: 'Нет уведомлений', icon: 'bi-bell-slash' },
];

const modeOptionsRedactor: SelectBoxOption[] = [
  { title: 'Зритель', icon: 'bi-eye' },
  { title: 'Редактор', icon: 'bi-pencil' },
  { title: 'Редактор-организатор', icon: 'bi-person-add' },
  { title: 'Администратор', icon: 'bi-flag' },
];

export const BoardSettings = () => {
  const activeBoard = useActiveBoardStore() as ActiveBoard;
  const me = useMeStore() as User;
  const members = useMembersStore();
  return (
    <ModalDialog
      key="modal_dialog"
      title="Настройки доски"
      isOpened={true}
      closeCallback={closeBoardSettingsModalDialog}
    >
      <div class="board-settings">
        <div class="board-settings__upper-section">
          <div class="board-settings__left">
            <img
              class="board-settings__background-image"
              src={activeBoard.board.backgroundImageUrl}
              alt="Задний фон доски"
            />
            <input
              id="uploadbg"
              type="file"
              style="display:none"
              accept="image/*"
              ON_change={(event: InputEvent) => {
                const files = (event.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  setBoardBackgroundImage(activeBoard.board.id, files[0]).then(
                    (resp) => {
                      activeBoard.board.backgroundImageUrl =
                        resp.body.backgroundImageUrl;
                      setActiveBoardStore(activeBoard);
                      showToast('Успешно изменён фон!', 'success');
                    }
                  );
                }
              }}
            />
            {activeBoard.myRole !== 'viewer' &&
              activeBoard.myRole !== 'editor' && (
                <Button
                  key="change_background_btn"
                  fullWidth
                  text="Сменить фон"
                  variant="accent"
                  icon="bi-card-image"
                  callback={() => {
                    const el = document.getElementById(
                      'uploadbg'
                    ) as HTMLInputElement;
                    el.click();
                  }}
                />
              )}
            {/* <Button
              key="leave_btn"
              fullWidth
              text="Выйти из доски"
              icon="bi-box-arrow-right"
              variant="negative"
              callback={() => {
                removeMember(activeBoard.id, me.id).then(() => {
                  showToast('Вы вышли из этой доски!', 'success');
                  closeBoardSettingsModalDialog();
                  goToUrl('/app');
                });
              }}
            /> */}
            {activeBoard.myRole === 'admin' && (
              <Button
                key="delete_btn"
                fullWidth
                text="Удалить доску"
                icon="bi-trash"
                variant="negative"
                callback={() => {
                  deleteBoard(activeBoard.board.id).then(() => {
                    showToast('Доска успешно удалена', 'success');
                    closeBoardSettingsModalDialog();
                    goToUrl('/app');
                  });
                }}
              />
            )}
          </div>
          <div class="board-settings__add-participants">
            <div class="add-participiants__main">
              {activeBoard.board.myInviteLinkUuid ? (
                <div>
                  <h1>Ссылка-приглашение</h1>
                  <div style="height: 10px" />
                  <Input
                    key="invite_link_input"
                    initialValue={`${window.location.origin}/inviteBoard/${activeBoard.board.myInviteLinkUuid}`}
                  />
                  <Button
                    key="copy_invite_link_button"
                    variant="accent"
                    fullWidth
                    text="Скопировать"
                    icon="bi-copy"
                    callback={() => {
                      navigator.clipboard
                        .writeText(
                          `${window.location.origin}/inviteBoard/${activeBoard.board.myInviteLinkUuid}`
                        )
                        .then(() => {
                          showToast('Ссылка успешно скопирована!', 'success');
                        });
                    }}
                  />
                </div>
              ) : (
                <div>
                  <Button
                    key="create_invite_link"
                    text="Создать ссылку-приглашение"
                    icon="bi-link-45deg"
                    callback={() => {
                      createInviteLink(activeBoard.board.id).then(
                        (linkUuid) => {
                          if (linkUuid !== undefined) {
                            showToast(
                              'Успешно задана ссылка-приглашение!',
                              'success'
                            );
                            activeBoard.board.myInviteLinkUuid = linkUuid;
                            setActiveBoardStore(activeBoard);
                          }
                        }
                      );
                    }}
                  />
                </div>
              )}

              {/* На будущее - настройки уведомлений */
              /* <div class="main__notifications-text">Уведомления:</div>
              <div class="main__notificatons">
                <div class="main__notifications-input">
                  <SelectBox
                    key="mode_select"
                    options={modeOptions}
                    currentIndex={0}
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div class="permissions-table">
          <hr class="mb-16px" />
          <div class="permissions-table__title">Права пользователей</div>
          <div class="permissions-table__table">
            <div class="permissions-table__table__headers">Имя</div>
            <div class="permissions-table__table__headers">Добавил</div>
            <div class="permissions-table__table__headers">Роль</div>
            {members.map((user) => {
              return (
                <>
                  <div class="permissions-table__table__user">
                    <img
                      src={user.user.avatarImageUrl}
                      alt=""
                      class="navbar__profile-picture"
                    />
                    <div style="font-weight: bold">{user.user.name}</div>
                  </div>
                  <div class="permissions-table__table__user-add">
                    {user.addedBy.name}
                  </div>
                  <div class="permissions-table__table__editor">
                    <SelectBox
                      key={`edit_member_${user.user.id}`}
                      options={modeOptionsRedactor}
                      widthRem={12}
                      readOnly={
                        !(
                          activeBoard.myRole === 'admin' ||
                          (activeBoard.myRole === 'editor_chief' &&
                            user.role !== 'admin' &&
                            user.role !== 'editor_chief')
                        ) || user.user.id === me.id
                      }
                      currentIndex={[
                        'viewer',
                        'editor',
                        'editor_chief',
                        'admin',
                      ].indexOf(user.role)}
                      onChange={(newIndex) => {
                        if (user.user.id === me.id) {
                          return;
                        }
                        updateMember(
                          activeBoard.board.id,
                          user.user.id,
                          ['viewer', 'editor', 'editor_chief', 'admin'][
                            newIndex
                          ]
                        ).then((patch) => {
                          showToast('Успешно обновлена роль', 'success');
                          setMembersStore(
                            members.map((e) => {
                              return e.user.id !== user.user.id ? e : patch;
                            })
                          );
                        });
                      }}
                    />
                  </div>
                  {user.user.id === me.id ||
                  !(
                    activeBoard.myRole === 'admin' ||
                    (activeBoard.myRole === 'editor_chief' &&
                      user.role !== 'admin' &&
                      user.role !== 'editor_chief')
                  ) ||
                  user.user.id === me.id ? (
                    <div></div>
                  ) : (
                    <div class="permissions-table__kick-member-button">
                      <Button
                        key={`remove_member_${user.user.id}`}
                        icon="bi-x-lg"
                        variant="default"
                        callback={() => {
                          if (user.user.id === me.id) {
                            return;
                          }
                          removeMember(activeBoard.board.id, user.user.id).then(
                            () => {
                              showToast(
                                'Пользователь успешно удален',
                                'success'
                              );
                              setMembersStore(
                                members.filter((a) => {
                                  return a.user.id !== user.user.id;
                                })
                              );
                            }
                          );
                        }}
                      />
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </ModalDialog>
  );
};
