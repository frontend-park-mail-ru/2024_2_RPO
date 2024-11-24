import { defineStore } from '@/jsxCore/hooks';
import { CardDetails } from '@/types/card';

export const [useCardDetailsStore, setCardDetailsStore] = defineStore<
  CardDetails | undefined
>('card_details', undefined);
