import { ComponentInstance } from './core.js';
import { markDirty, scheduleUpdate } from './updateQueue';
import { RefsMap } from './types.js';

let stateNum: number = 0;
let activeInstance: ComponentInstance<any> | undefined;

export function _setUpdatedInstance(instance: ComponentInstance<any>) {
  stateNum = 0;
  activeInstance = instance;
}
export function _unsetUpdatedInstance() {
  activeInstance = undefined;
}

export function useState<S>(
  initialValue: S
): [state: S, setState: (newState: S) => void] {
  if (activeInstance === undefined) {
    throw new Error(
      'Active instance is undefined; maybe wrongly used useState'
    );
  }
  const currentInstance = activeInstance as ComponentInstance;
  const idx = stateNum;
  const setState = (newState: S): void => {
    currentInstance.state[idx] = newState;
    markDirty(currentInstance);
    scheduleUpdate();
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
