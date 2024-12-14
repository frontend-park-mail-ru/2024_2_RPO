import { defineStore } from '@/jsxCore/hooks';
import { CardDetails } from '@/types/types';

export const [useCardDetailsStore, setCardDetailsStore] = defineStore<
  CardDetails | undefined
>('card_details', undefined);
