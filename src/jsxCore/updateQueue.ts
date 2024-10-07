import { IComponentInstance } from './types/instanceTypes';

const queue: IComponentInstance[][] = [];

/**
 * Пометить инстанс как требующий обновления
 * @param instance Инстанс, который надо пометить как требующий обновления
 */
export function markDirty(instance: IComponentInstance) {
  while (queue.length <= instance.depth) {
    queue.push([]);
  }
  queue[instance.depth].push(instance);
}

/**
 * Получить инстанс, требующий обновления
 * @returns Самый близкий к корневому инстанс, который требует обновления (или null, если очередь пуста)
 */
export function popDirty(): IComponentInstance | null {
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].length > 0) {
      const ret = queue[i][queue[i].length - 1];
      queue[i].splice(queue[i].length - 1, 1);
      return ret;
    }
  }
  return null;
}
