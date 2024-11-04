import { ModalDialog } from '@/components/ModalDialog';
import { closeBoardSettingsModalDialog } from '@/stores/modalDialogsStore';
import { Button } from '@/components/Button';
import { SelectBox, SelectBoxOption } from '@/components/SelectBox';
import { useActiveBoardStore } from '@/stores/activeBoardStore';
import { Input } from '@/components/Input';
import { addMember, removeMember, updateMember } from '@/api/members';
import { ActiveBoard } from '@/types/activeBoard';
import { setMembersStore, useMembersStore } from '@/stores/members';
import { showToast } from '@/stores/toastNotificationStore';

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
              src={activeBoard?.backgroundImageUrl}
              alt="Задний фон доски"
            />
            <Button
              key="change_background_btn"
              text="Сменить фон"
              icon="bi-card-image"
              variant="default"
            />
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
                  key="add_member"
                  placeholder="Введите никнейм"
                  onEnter={(nickname) => {
                    addMember(activeBoard.id, nickname).then((newMember) => {
                      showToast('Успешно добавлен пользователь', 'success');
                      members.push(newMember);
                      setMembersStore(members);
                    });
                  }}
                />
              </div>
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
                      currentIndex={[
                        'viewer',
                        'editor',
                        'editor_chief',
                        'admin',
                      ].indexOf(user.role)}
                      onChange={(newIndex) => {
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
                  <div class="permissions-table__kick-member-button">
                    <Button
                      key={`remove_member_${user.user.id}`}
                      icon="bi-x-lg"
                      variant="default"
                      callback={() => {
                        removeMember(activeBoard.id, user.user.id).then(() => {
                          showToast('Успешно изгнан пользователь', 'success');
                          setMembersStore(
                            members.filter((a) => {
                              return a.user.id !== user.user.id;
                            })
                          );
                        });
                      }}
                    />
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </ModalDialog>
  );
};
