import { Button } from '@/components/Button';
import { interfaceStateStore } from '@/stores/interfaceStateStore';
import { logout } from '@/api/users';
import { ModeSelect } from '@/components/ModeSelect';
import { ComponentProps } from '@/jsxCore/types';

type NavBarProps = ComponentProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const NavBar = (props: NavBarProps) => {
  const openMenuBtn = (
    <div
      class="button pt-0"
      ON_click={() => {
        interfaceStateStore.appState.isLeftPanelOpened =
          !interfaceStateStore.appState.isLeftPanelOpened;
        interfaceStateStore?.update();
      }}
    >
      <i
        class={[
          interfaceStateStore.appState.isLeftPanelOpened
            ? 'bi-x-lg'
            : 'bi-list',
        ]}
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
            <div draggable="false" class="navbar__logo__pumpkin">
              Pumpkin
            </div>
          </div>
        </a>
      </div>
      <div class="navbar__rest">
        <div class="borderNameWithGear">
          <ModeSelect key="mode_select" currentMode="kanban" />

          <div class="borderName" style="font-size: 18px; font-weight: 600">
            Моя доска
          </div>
          <Button key="settings" icon="bi-gear" />
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
          <Button key="notification_btn" icon="bi-bell" />
          <Button
            key="logout_btn"
            icon="bi-box-arrow-right"
            callback={() => {
              logout();
            }}
          />
          {interfaceStateStore?.me?.name}
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
