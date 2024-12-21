import { defineStore } from '@/jsxCore/hooks';

export interface SearchRes {
  cardUuid: string;
  text: string;
}

export const [useSearchResultStore, setSearchResultStore] = defineStore<
  SearchRes[] | undefined
>('searchResult', undefined);
