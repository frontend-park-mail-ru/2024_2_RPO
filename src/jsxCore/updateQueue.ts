import { ComponentInstance } from '@/jsxCore/core.js';

const queue: Set<ComponentInstance<any>>[] = [];
let isUpdateTaskExists: boolean = false;

/**
 * Пометить инстанс как требующий обновления
 * @param instance Инстанс, который надо пометить как требующий обновления
 */
export function markDirty(instance: ComponentInstance<any>) {
  while (queue.length <= instance.depth) {
    queue.push(new Set());
  }
  queue[instance.depth].add(instance);
  scheduleUpdate();
}

function updateNow() {
  const updatee = popDirty();
  if (updatee !== null) {
    updatee.update();
  }
}

/**
 * Создать задачу по обновлению
 */
function scheduleUpdate() {
  if (isUpdateTaskExists === false) {
    isUpdateTaskExists = true;
    setTimeout(() => {
      isUpdateTaskExists = false;
      updateNow();
    }, 0);
  }
}

/**
 * Получить инстанс, требующий обновления
 * @returns Самый близкий к корневому инстанс, который требует обновления (или null, если очередь пуста)
 */
export function popDirty(): ComponentInstance<any> | null {
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].size > 0) {
      let ret: ComponentInstance | undefined = undefined;
      for (const instance of queue[i]) {
        ret = instance;
        break;
      }
      if (ret !== undefined) {
        queue[i].delete(ret);
        scheduleUpdate();
        return ret;
      } else {
        return null;
      }
    }
  }
  return null;
}

export function _removeFromUpdateQueue(instance: ComponentInstance<any>) {
  if (queue.length > instance.depth) {
    queue[instance.depth].delete(instance);
  }
}
