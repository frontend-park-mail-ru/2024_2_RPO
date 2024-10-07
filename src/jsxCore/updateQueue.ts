import { ComponentInstance } from '/jsx_core/core.js';

const queue: Set<ComponentInstance>[] = [];

/**
 * Пометить инстанс как требующий обновления
 * @param instance Инстанс, который надо пометить как требующий обновления
 */
export function markDirty(instance: ComponentInstance) {
  while (queue.length <= instance.depth) {
    queue.push(new Set());
  }
  queue[instance.depth].add(instance);
}

/**
 * Получить инстанс, требующий обновления
 * @returns Самый близкий к корневому инстанс, который требует обновления (или null, если очередь пуста)
 */
export function popDirty(): ComponentInstance | null {
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].size > 0) {
      let ret: ComponentInstance | undefined = undefined;
      for (const instance of queue[i]) {
        ret = instance;
        break;
      }
      if (ret !== undefined) {
        queue[i].delete(ret);
        return ret;
      } else {
        return null;
      }
    }
  }
  return null;
}
