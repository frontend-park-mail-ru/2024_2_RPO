import { ButtonComponent } from '/components/Button.js';
import {
  getAppISS,
  interfaceStateStore,
  logout,
} from '/stores/interfaceStateStore.js';
import { ModeSelect } from '/components/ModeSelect.js';

export const NavBar = () => {
  const openMenuBtn = (
    <div
      class="button"
      style="padding-top:0"
      ON_click={() => {
        getAppISS().isLeftPanelOpened = !getAppISS().isLeftPanelOpened;
        interfaceStateStore?.update();
      }}
    >
      <i
        class={[getAppISS().isLeftPanelOpened ? 'bi-x-lg' : 'bi-list']}
        style="font-size: 22px"
      ></i>
    </div>
  );
  return (
    <nav class="navbar">
      <div class="navbar__logo">
        {openMenuBtn}
        <a class="logo__link" href="/">
          <div class="logo">
            <img
              draggable="false"
              src="/static/logo.svg"
              alt="Logo"
              style="margin-bottom: 8px;"
            />
            <div
              draggable="false"
              class="name"
              style="font-size: 24px; font-weight: bold"
            >
              Pumpkin
            </div>
          </div>
        </a>
      </div>
      <div class="navbar__rest">
        <div class="borderNameWithGear">
          {ModeSelect()}

          <div class="borderName" style="font-size: 18px ;font-weight: 600">
            Моя доска
          </div>
          {ButtonComponent({ icon: 'bi-gear' })}
        </div>
        <div class="flex-grow"></div>
        <div class="search">
          <input
            class="searchInput"
            type="text"
            placeholder="Поиск"
            style="padding-left: 36px"
          />
          <i class="bi-search" style="position: absolute;"></i>
          {ButtonComponent({ icon: 'bi-bell' })}
          {ButtonComponent({
            icon: 'bi-box-arrow-right',
            callback: () => {
              logout();
              interfaceStateStore?.update();
            },
          })}
          <div class="profilePicture">
            <img
              draggable="false"
              src="/static/avatar.svg"
              alt="ProfilePicture"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
