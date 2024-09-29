import { ButtonComponent } from '/components/Button.js';
import { getAppISS, interfaceStateStore } from '/stores/interfaceStateStore.js';
import { ModeSelect } from '/components/ModeSelect.js';

export const NavBar = () => {
  const openMenuBtn = (
    <div
      class="button"
      ON_click={() => {
        getAppISS().isLeftPanelOpened = true;
        interfaceStateStore?.update();
      }}
    >
      <i class="bi bi-list" style="font-size: 22px"></i>
    </div>
  );
  return (
    <nav class="navbar" style="position: fixed; border:#000000">
      <div class="navbar__logo">
        {openMenuBtn}
        <div
          class="logo"
          style="user-select: none; display: flex; align-items: center;"
        >
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
          <div class="profilePicture" style="height: 40px; width: 40px;">
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
