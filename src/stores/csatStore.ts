import { pollMock } from '@/api/mocks/poll';
import { defineStore } from '@/jsxCore/hooks';
import { CsatQuestion } from '@/types/types';

interface CsatStore {
  isOpened: boolean;
  questions: CsatQuestion[];
}

export const [useCsatStore, setCsatStore] = defineStore<CsatStore>('csat_store', {
  isOpened: false,
  questions: pollMock,
});
