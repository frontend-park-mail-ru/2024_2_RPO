import { ModalDialog } from '@/components/ModalDialog';
import { ComponentProps } from '@/jsxCore/types';
import { closeBoardSettingsModalDialog } from '@/stores/modalDialogsStore';
import { Button } from '@/components/Button';
import { SelectBox, SelectBoxOption } from '@/components/SelectBox';

const modeOptions: SelectBoxOption[] = [
  { title: 'Только мои задачи', icon: 'bi-person-badge' },
];

const modeOptionsRedactor: SelectBoxOption[] = [
  { title: 'Редактор', icon: 'bi-pencil' },
];

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
  return (
    <ModalDialog
      key="modal_dialog"
      title="Настройки доски"
      isOpened={true}
      closeCallback={closeBoardSettingsModalDialog}
    >
      <div class="board-settings">
        <div class="board-settings__firstpart">
          <div class="board-settings__left">
            <img
              class="board-settings__image"
              src="static/img/KarlMarks.jpg"
              alt=""
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
              <div class="main__link-text">Моя ссылка:</div>
              <input
                class="main__link-input"
                type="text"
                value="https://pumpkin.com/board/228/join_by_invite/9992"
                readonly
              />
              <div class="main__link-input__btn">
                <Button key="copy-link" icon="bi-copy" variant="accent" />
                <Button
                  key="delete-link"
                  text="Удалить ссылку"
                  icon="bi-x-lg"
                  variant="default"
                />
              </div>
              <div class="main__add-collaborator-text">
                Добавить коллаборатора:
              </div>
              <div class="main__add-collaborator-input">
                <input type="text" placeholder="Введите Pull-токен" />
              </div>
              <div class="main__notifications-text">Уведомления:</div>
              <div class="main__notificatons">
                <div class="main__notifications-input">
                  <SelectBox
                    key="mode_select"
                    options={modeOptions}
                    currentIndex={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="board-settings__secondpart">
          <div class="secondpart-title">Права пользователей</div>
          <hr class="mb-16px" />
          <div class="board-settings__secondpart-main">
            <div class="secondpart-name">Имя</div>
            <div class="secondpart-add">Добавил</div>
            {users.map((user) => {
              return (
                <>
                  <div class="secondpart-user">
                    <img
                      src={user.avatar}
                      alt=""
                      class="navbar__profile-picture"
                    />
                    <div class="secondpart__user-title">{user.title}</div>
                  </div>
                  <div class="secondpart__user-add">{user.add}</div>
                </>
              );
            })}
            <div class="secondpart-editor">
              <SelectBox
                key="mode_select-redactor"
                options={modeOptionsRedactor}
                currentIndex={0}
              />
            </div>
            <div class="button__cross-redactor">
              <Button key="cross-redactor" icon="bi-x-lg" variant="default" />
            </div>
          </div>
          <div class="board-settings_secondpart-save">
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
