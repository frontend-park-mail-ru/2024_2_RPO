const app = (
  <>
    <header>
      <nav class="navbar" style="position: fixed; border:#000000">
        <div class="leftElements">
          <div class="list">
            <i class="bi bi-list" style="cursor:pointer"></i>
          </div>

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

        <div class="currentMode">
          <div class="mode">
            <i class="bi bi-kanban"></i>
          </div>
          <div style="padding-left: 5px;flex-grow:1">Канбан</div>
          <div>
            <i class="bi bi-chevron-down"></i>
          </div>
        </div>

        <div class="borderNameWithGear">
          <div class="borderName" style="font-size: 18px ;font-weight: 600">
            Моя доска
          </div>
          <div class="gear" style="cursor:pointer">
            <i
              class="bi-gear "
              style="margin-right: auto; margin-left: auto;height: 16px; margin-bottom: 7px;"
            ></i>
          </div>
        </div>
        <div class="search">
          <input
            class="searchInput"
            type="text"
            placeholder="Поиск"
            style="padding-left: 36px"
          />
          <i class="bi-search" style="position: absolute;"></i>
          <div class="bell" style="cursor:pointer; position: relative;">
            <i
              class="bi-bell"
              style="margin-right: auto; margin-left: auto;height: 16px; margin-bottom: 7px;"
            ></i>
          </div>
        </div>
        <div class="profilePicture" style="height: 40; width: 40;">
          <img
            draggable="false"
            src="/static/avatar.svg"
            alt="ProfilePicture"
          />
        </div>
      </nav>
    </header>

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
