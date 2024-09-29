import { ButtonComponent } from '/components/Button.js';
import { getAppISS, interfaceStateStore } from '/stores/interfaceStateStore.js';

export const LeftPanel = () => {
  return (
    <div class="left_menu">
      <div
        class="left__menu__header"
        style="width: 100%; height: 58px; display: flex;  align-items: center; gap: 10px;"
      >
        <div
          class="left__menu__left__elements"
          style="display: flex; align-items: center; justify-content: center; gap: 10px;"
        >
          <div
            class="x-lg"
            ON_click={() => {
              getAppISS().isLeftPanelOpened = false;
              interfaceStateStore?.update();
            }}
          >
            <i class="bi bi-x-lg" style="cursor:pointer"></i>
          </div>
          <div
            class="logo__left__menu_header"
            style="user-select: none; display: flex; align-items: center; gap: 10px;"
          ></div>
        </div>
      </div>
      <div
        class="left__menu__body"
        style="overflow-y: auto; max-height: 500px; padding-bottom: 80px;"
      >
        <div
          class="first-level"
          style="display: flex; align-items:center; gap: 50px; margin-left: 14px; margin-top: 30px"
        >
          <div
            class="left__menu__body__name"
            style="font-size: 22px; font-weight: 600"
          >
            Мои доски
          </div>
          <div class="star">
            <div
              class="bi-star"
              style="margin-right: auto; margin-left: auto;height: 16px; margin-bottom: 7px"
            ></div>
          </div>
        </div>
        <div class="cards" style="flex-direction: column;">
          <div
            class="left__menu__card__1"
            style="display: flex; flex-direction: column; height: 177px; width: 195px;margin-left: 14px; margin-top: 30px;"
          >
            <div class="left__menu__card__picture" style="position: relative;">
              <div
                class="star-fill"
                style="position: absolute; display: flex; justify-content: flex-end; top: 10px; right: 10px;"
              >
                <div class="bi-star-fill"></div>
              </div>
              <img
                src="/static/backgroundPicture.png"
                alt=""
                style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"
              />
            </div>
            <div class=" left__menu__card__info">
              <div
                class="left__menu__card__name__title"
                style="font-size: 18px; font-weight: bold"
              >
                Communism Enjoyers
              </div>
              <div class="left__menu__card__name__text" style="font-size:12px;">
                Последнее посещение: 10 ч
              </div>
              <div
                class="left__menu__card__name__subtext"
                style="font-size:12px;"
              >
                Последнее обновление: 1 ч
              </div>
            </div>
          </div>
          <div
            class="left__menu__card__2"
            style="display: flex; flex-direction: column; height: 177px; width: 195px;margin-left: 14px; margin-top: 30px;"
          >
            <div class="left__menu__card__picture" style="position: relative;">
              <div
                class="star-fill"
                style="position: absolute; display: flex; justify-content: flex-end; top: 10px; right: 10px;"
              >
                <div class="bi-star-fill"></div>
              </div>
              <img
                src="/static/backgroundPicture.png"
                alt=""
                style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;"
              />
            </div>
            <div class=" left__menu__card__info">
              <div
                class="left__menu__card__name__title"
                style="font-size: 18px; font-weight: bold"
              >
                Communism Enjoyers
              </div>
              <div class="left__menu__card__name__text" style="font-size:12px;">
                Последнее посещение: 10 ч
              </div>
              <div
                class="left__menu__card__name__subtext"
                style="font-size:12px;"
              >
                Последнее обновление: 1 ч
              </div>
            </div>
          </div>
        </div>
        {ButtonComponent({
          icon: 'bi-plus-square',
          text: 'Добавить доску',
          callback: () => {
            getAppISS().isNewBoardDialogOpened = true;
            interfaceStateStore?.update();
          },
        })}
      </div>
    </div>
  );
};
