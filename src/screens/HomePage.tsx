import { Button } from '@/components/Button';
import { LoginDialog } from '@/containers/LoginDialog';
import { RegistrationDialog } from '@/containers/RegistrationDialog';
import { useState } from '@/jsxCore/hooks';
import { ComponentProps } from '@/jsxCore/types';
import { useMeStore } from '@/stores/meStore';
import { goToUrl } from '@/stores/routerStore';

import './homePage.scss';

function scrollToSection(id: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' }); // Плавная прокрутка
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const HomePage = (props: ComponentProps) => {
  const [isRegistrationOpened, setIsRegistrationOpened] = useState(false);
  const [isLoginOpened, setIsLoginOpened] = useState(false);
  const userMe = useMeStore();

  return (
    <>
      <div class="homepage">
        <div className="homepage__top-section">
          <div className="top-section">
            <div className="top-section__left">
              <div className="top-section__logo">Pumpkin</div>
              <div className="top-section__comment">
                Облачный канбан со сверхспособностями
              </div>
              <div className="top-section__motto">Следи за своими делами!</div>
              <div className="top-section__buttons">
                {userMe === undefined && (
                  <Button
                    key="reg_button"
                    text="Зарегистрироваться"
                    callback={() => {
                      setIsRegistrationOpened(true);
                    }}
                  />
                )}

                {userMe === undefined && (
                  <Button
                    key="login_button"
                    text="Войти"
                    callback={() => {
                      setIsLoginOpened(true);
                    }}
                  />
                )}
                {userMe !== undefined && (
                  <Button
                    key="login_button"
                    text="Перейти в приложение"
                    variant="positive"
                    callback={() => {
                      goToUrl('/app');
                    }}
                  />
                )}
              </div>
            </div>
            <div className="top-section__right">
              <img src="static/img/logo_new.svg" class="home-page__logo" />
            </div>
          </div>

          <div className="homepage__scroll-indicator">
            <a
              href="#kanban-info"
              className="scroll-link"
              onclick={(e: MouseEvent) => {
                e.preventDefault(); // Предотвращаем стандартное поведение ссылки
                scrollToSection('kanban-info'); // Плавная прокрутка
              }}
            >
              <div className="homepage__scroll-text">Подробнее о Pumpkin</div>
              <i className="bi-arrow-down scroll-arrow homepage__scroll-text" />
            </a>
          </div>

          <img src="/static/img/wave.svg" class="homepage__wave" />
        </div>

        <div id="kanban-info" className="homepage__quote-section">
          <div className="homepage__quote">
            <strong>Канбан</strong> (яп. カンバン) - система организации задач,
            позволяющая придерживаться принципа "точно в срок"
          </div>
        </div>

        <div className="homepage__detail-section homepage__detail-section__odd">
          <img
            className="homepage__detail-image"
            src="/static/img/photo_desk.png"
          />

          <div className="homepage__detail-comment">
            <div className="homepage__detail-header">
              Каждому проекту - по доске
            </div>
            <div className="homepage__detail-text">
              Разложите задачи по полочкам, чтобы расставить приоритеты и
              уделить внимание важному
            </div>
          </div>
        </div>

        <div className="homepage__detail-section homepage__detail-section__even">
          <div className="homepage__detail-comment">
            <div className="homepage__detail-header">
              Размещайте задачи в колонках
            </div>
            <div className="homepage__detail-text">
              Создавайте карточки, чтобы наглядно видеть весь список задач - так
              вы точно ничего не забудете
            </div>
          </div>
          <img
            className="homepage__detail-image"
            src="/static/img/photo_columns.png"
            alt="Колонки задач"
          />
        </div>

        <div className="homepage__detail-section homepage__detail-section__odd">
          <img
            className="homepage__detail-image"
            src="/static/img/photo_desk_settings.png"
            alt="Работайте вместе"
          />
          <div className="homepage__detail-comment">
            <div className="homepage__detail-header">Работайте вместе</div>
            <div className="homepage__detail-text">
              Добавляйте коллег в проекты, чтобы вместе достигать поставленной
              цели, а также назначайте участникам права
            </div>
          </div>
        </div>

        <div className="homepage__video-frame">
          <iframe
            className="homepage__video-iframe"
            src="https://drive.google.com/file/d/1zIoGZ8QWQVdl0K3-tuuay9XfbQEbu47i/preview"
            width="854"
            height="480"
            frameborder="0"
            allowfullscreen
            title="Embedded Video"
          ></iframe>
        </div>

        <footer class="homepage__footer">
          (c) Team RPO, Texnopark Mail.ru, 2024
        </footer>
      </div>

      {isRegistrationOpened && (
        <RegistrationDialog
          key="reg_dialog"
          closeCallback={() => {
            setIsRegistrationOpened(false);
          }}
        />
      )}
      {isLoginOpened && (
        <LoginDialog
          key="login_dialog"
          closeCallback={() => {
            setIsLoginOpened(false);
          }}
        />
      )}
    </>
  );
};
