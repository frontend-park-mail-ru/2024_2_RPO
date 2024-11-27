import { ComponentInstance } from './core';
import { RefsMap } from './types';
import { markDirty } from './updateQueue';

let stateNum: number = 0;
let activeInstance: ComponentInstance<any> | undefined;

export function _setUpdatedInstance(instance: ComponentInstance<any>) {
  stateNum = 0;
  activeInstance = instance;
}
export function _unsetUpdatedInstance() {
  activeInstance = undefined;
  stateNum = -1;
}

export function useState<S>(
  initialValue: S
): [state: S, setState: (newState: S) => void] {
  if (activeInstance === undefined) {
    throw new Error(
      'Active instance is undefined; maybe wrongly used useState'
    );
  }
  const currentInstance = activeInstance;
  const idx = stateNum;
  const setState = (newState: S): void => {
    currentInstance.state[idx] = newState;
    markDirty(currentInstance);
  };
  let value: S = initialValue;
  if (activeInstance.state.length <= stateNum) {
    activeInstance.state.push(initialValue);
  } else {
    value = currentInstance.state[idx];
  }
  stateNum++;
  return [value, setState];
}

export function useEffectRefs(cb: (refs: RefsMap) => void): void {
  if (activeInstance === undefined) {
    throw new Error(
      'Active instance is undefined; maybe wrongly used useEffectRefs'
    );
  }
  activeInstance.refEffects.push(cb);
}

export function useEffect(cb: () => void): void {
  if (activeInstance === undefined) {
    throw new Error(
      'Active instance is undefined; maybe wrongly used useEffect'
    );
  }
  activeInstance.effects.push(cb);
}

const storeMap: Map<string, any> = new Map();
const storeSubscribersIndex: Map<ComponentInstance, Set<string>> = new Map();
const storeSubscribers: Map<string, Set<ComponentInstance>> = new Map();

export function defineStore<S>(
  storeName: string,
  storeContent: S
): [useStore: () => S, setStore: (newStoreContent: S) => void] {
  storeMap.set(storeName, storeContent);
  storeSubscribers.set(storeName, new Set());
  const useStore = () => {
    if (activeInstance !== undefined) {
      // Подписать инстанс на store
      if (!storeSubscribersIndex.has(activeInstance)) {
        storeSubscribersIndex.set(activeInstance, new Set());
      }
      if (!storeSubscribersIndex.get(activeInstance)?.has(storeName)) {
        storeSubscribersIndex.get(activeInstance)?.add(storeName);
        storeSubscribers.get(storeName)?.add(activeInstance);
      }
    }
    console.log(storeName, activeInstance);
    console.log(storeSubscribers);
    return storeMap.get(storeName);
  };
  const setStore = (newStoreContent: S) => {
    storeMap.set(storeName, newStoreContent);
    storeSubscribers.get(storeName)?.forEach((instance) => {
      markDirty(instance);
    });
  };
  return [useStore, setStore];
}

export function _unsubscribeFromStores(instance: ComponentInstance<any>) {
  if (storeSubscribersIndex.has(instance)) {
    storeSubscribersIndex.get(instance)?.forEach((storeName) => {
      const storeSubs = storeSubscribers.get(storeName);
      if (storeSubs !== undefined) {
        storeSubs.delete(instance);
      }
    });
    storeSubscribersIndex.delete(instance);
  }
}
