export class AppState {
    isBoardDeleteDialogOpened: boolean;
    isLeftPanelOpened: boolean;
    isNewBoardDialogOpened: boolean;
    boardDeleteDialogCallback: (() => void) | undefined;
    constructor() {
      this.isBoardDeleteDialogOpened = false;
      this.isLeftPanelOpened = false;
      this.isNewBoardDialogOpened = false;
      this.boardDeleteDialogCallback = undefined;
    }
  }
