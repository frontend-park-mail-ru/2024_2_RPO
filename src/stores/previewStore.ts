import { getCardByLink } from '@/api/cardDetails';
import { decodeBoard, decodeCardDetails } from '@/api/decode';
import { fetchInviteLink } from '@/api/members';
import { defineStore } from '@/jsxCore/hooks';
import { Board, CardDetails } from '@/types/types';

type PreviewStore = CardPreviewStore | BoardPreviewStore;

interface CardPreviewStore {
  type: 'card';
  board: Board;
  cardDetails: CardDetails;
}
interface BoardPreviewStore {
  type: 'board';
  board: Board;
}

export const [usePreviewStore, setPreviewStore] = defineStore<
  PreviewStore | undefined
>('previewStore', undefined);

export const loadBoardInvitePreview = (inviteLinkUuid: string) => {
  fetchInviteLink(inviteLinkUuid).then((result) => {
    if (result !== undefined) {
      setPreviewStore({ type: 'board', board: result });
    }
  });
};

export const loadCardPreview = (cardUuid: string) => {
  getCardByLink(cardUuid).then((card) => {
    if (card !== undefined) {
      if (card.type === 'foreign') {
        setPreviewStore({
          type: 'card',
          board: decodeBoard(card.board),
          cardDetails: decodeCardDetails(card.card),
        });
      }
    }
  });
};
