import { ModalDialog } from '@/components/ModalDialog';
import { ComponentProps } from '@/jsxCore/types';
import { closeBoardSettingsModalDialog } from '@/stores/modalDialogsStore';
import { Button } from '@/components/Button';
import { SelectBox, SelectBoxOption } from '@/components/SelectBox';
// import { User } from '@/types/user';
import { useActiveBoardStore } from '@/stores/activeBoardStore';

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

// interface Users {
//   user: User;
//   addedBy: User | 'creatorItself';
//   addedWhen: string;
//   iCanEdit: boolean;
// }

const users = [
  {
    title: 'zhugeo',
    avatar: 'static/img/KarlMarks.jpg',
    add: 'marks_k (10 д)',
  },
  {
    title: 'marks_k',
    avatar: 'static/img/KarlMarks.jpg',
    add: 'Сам создал (15 д)',
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const BoardSettings = (props: ComponentProps) => {
  const activeBoard = useActiveBoardStore();
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
              {/* <div class="main__link-text">Моя ссылка:</div>
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
              <div class="main__add-collaborator-text">
                Добавить коллаборатора:
              </div>
              <div class="main__add-collaborator-input">
                <input type="text" placeholder="Введите Pull-токен" />
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
            {users.map((user) => {
              return (
                <>
                  <div class="permissions-table__table__user">
                    <img
                      src={user.avatar}
                      alt=""
                      class="navbar__profile-picture"
                    />
                    <div class="permissions-table__table__user-title">
                      {user.title}
                    </div>
                  </div>
                  <div class="permissions-table__table__user-add">
                    {user.add}
                  </div>
                </>
              );
            })}
            <div class="permissions-table__table__editor">
              <SelectBox
                key="mode_select-redactor"
                options={modeOptionsRedactor}
                currentIndex={0}
              />
            </div>
            <div class="permissions-table__kick-member-button">
              <Button key="cross-redactor" icon="bi-x-lg" variant="default" />
            </div>
          </div>
          <div class="permissions-table__save">
            <Button
              key="board-settings-save"
              text="Сохранить настройки прав"
              icon="bi-floppy"
              variant="positive"
            />
          </div>
        </div>
      </div>
    </ModalDialog>
  );
};
