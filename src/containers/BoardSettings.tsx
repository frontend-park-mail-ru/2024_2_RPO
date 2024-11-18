import { ModalDialog } from '@/components/ModalDialog';
import { closeBoardSettingsModalDialog } from '@/stores/modalDialogsStore';
import { Button } from '@/components/Button';
import { SelectBox, SelectBoxOption } from '@/components/SelectBox';
import {
  setActiveBoardStore,
  useActiveBoardStore,
} from '@/stores/activeBoardStore';
import { Input } from '@/components/Input';
import { addMember, removeMember, updateMember } from '@/api/members';
import { ActiveBoard } from '@/types/activeBoard';
import { setMembersStore, useMembersStore } from '@/stores/members';
import { showToast } from '@/stores/toastNotificationStore';
import { useMeStore } from '@/stores/meStore';
import { User } from '@/types/user';
import { goToUrl } from '@/stores/routerStore';
import { deleteBoard, setBoardBackgroundImage } from '@/api/boards';
import { useState } from '@/jsxCore/hooks';
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
  const [memberNickname, setMemberNickname] = useState('');
  const submitMember = (nickname: string) => {
    if (memberNickname.length === 0) {
      return;
    }
    addMember(activeBoard.id, nickname).then((newMember) => {
      showToast('Успешно добавлен пользователь', 'success');
      members.push(newMember);
      setMembersStore(members);
    });
  };
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
              src={activeBoard?.backgroundImageUrl}
              alt="Задний фон доски"
            />
            <input
              id="uploadbg"
              type="file"
              style="display:none"
              ON_change={(event: InputEvent) => {
                const files = (event.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  setBoardBackgroundImage(activeBoard.id, files[0]).then(
                    (resp) => {
                      showToast('Успешно изменён фон!', 'success');
                      activeBoard.backgroundImageUrl =
                        resp.body.backgroundImageUrl;
                      setActiveBoardStore(activeBoard);
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
            <Button
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
            />
            {activeBoard.myRole === 'admin' && (
              <Button
                key="delete_btn"
                fullWidth
                text="Удалить доску"
                icon="bi-trash"
                variant="negative"
                callback={() => {
                  deleteBoard(activeBoard.id).then(() => {
                    showToast('Доска успешно удалена', 'success');
                    closeBoardSettingsModalDialog();
                    goToUrl('/app');
                  });
                }}
              />
            )}
          </div>
          <div class="board-settings__add-participants">
            <div class="add-participiants__text">Добавить участников</div>
            <div class="add-participiants__main">
              {/*На будущее - приглашение по ссылке*/
              /* <div class="main__link-text">Моя ссылка:</div>
              <div class="main__link-input">
                <Input
                  key="board-settings-link"
                  initialValue="https://pumpkin.com/board/228/join_by_invite/9992"
                  readOnly
                  copyOnClick
                />
              </div>
              <div class="main__link-input__btn">
                <Button key="copy-link" icon="bi-copy" variant="accent" />
                <Button
                  key="delete-link"
                  text="Удалить ссылку"
                  icon="bi-x-lg"
                  variant="default"
                />
              </div> */}
              <div class="main__add-collaborator-text">Добавить зрителя:</div>
              <div class="main__add-collaborator-input">
                <Input
                  key="add_member_inp"
                  placeholder="Введите никнейм"
                  onChanged={setMemberNickname}
                  onEnter={() => {
                    submitMember(memberNickname);
                  }}
                />
              </div>
              <Button
                key="add_member"
                icon="bi-plus-square"
                variant={memberNickname.length ? 'positive' : 'default'}
                callback={() => {
                  submitMember(memberNickname);
                }}
              />
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
          <div class="permissions-table__title">Права пользователей</div>
          <hr class="mb-16px" />
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
                    <div class="permissions-table__table__user-title">
                      {user.user.name}
                    </div>
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
                          activeBoard.id,
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
                          removeMember(activeBoard.id, user.user.id).then(
                            () => {
                              showToast(
                                'Успешно изгнан пользователь',
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
