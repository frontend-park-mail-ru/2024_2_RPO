import { LeftPanel } from '/chunks/LeftPanel.js';
import { NavBar } from '/chunks/NavBar.js';
import { getAppISS } from '/stores/interfaceStateStore.js';

export const MainApp = () => {
  return (
    <>
      <header>{NavBar()}</header>

      {getAppISS().isLeftPanelOpened?LeftPanel():undefined}

      <main>
        <img
          src="/static/backgroundPicture.png"
          class="backgroundPicture"
          style="width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; z-index: -1;"
          alt=""
        />

        <div class="board" style="display: flex; flex-direction: column;">
          <div
            class="board__card_1"
            style="display: flex; flex-direction: column; height: 427px; width: 272px; background-color:#F1F2F4; border-radius:12px; margin-top: 74px; margin-left: 14px;"
          >
            <div
              class="board__card__title"
              style="display: flex; align-items: center; position: relative;"
            >
              <div
                class="board__card__title__text"
                style="font-size: 14px; font-weight: 500; padding-left: 10px; padding-top: 6px;"
              >
                Апокалипсис
              </div>
              <div
                class="dots"
                style="cursor:pointer; position: absolute; right:10px; top: 6px; box-shadow: 0px 0px 10px 7px rgba(34, 60, 80, 0.05); "
              >
                <i
                  class="bi-three-dots"
                  style="margin-right: auto; margin-left: auto; height: 16px; margin-bottom: 7px;"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
