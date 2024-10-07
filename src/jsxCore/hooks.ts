import { IComponentInstance } from './types/instanceTypes';
import { markDirty } from './updateQueue';

let stateNum: number = 0;
let activeInstance: IComponentInstance | undefined;

export function _setUpdatedInstance(instance: IComponentInstance) {
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
  const currentInstance = activeInstance as IComponentInstance;
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
