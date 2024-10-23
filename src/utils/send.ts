import useBLE from '@hooks/useBLE';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import { useRef } from 'react';

class Queue<T> {
  private items: T[] = [];

  // 填充数据到队列中
  enqueue(item: T) {
    this.items.push(item);
  }

  // 消费队列中的数据
  dequeue(): T | undefined {
    return this.items.shift();
  }

  // 判断队列是否为空
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear() {
    this.items = [];
  }
}

class Consumer<T> {
  private queue: Queue<T>;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(queue: Queue<T>) {
    this.queue = queue;
  }

  // 开始消费数据，每300ms消费一个
  startConsuming(cb: any) {
    this.intervalId = setInterval(() => {
      if (!this.queue.isEmpty()) {
        const item = this.queue.dequeue();
        console.log('queue', item);
        cb(item);
      } else {
        this.stopConsuming();
      }
    }, 300);
  }

  // 停止消费数据
  stopConsuming() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.queue.clear();
    }
  }
}
const useSend = () => {
  const queue = useRef(new Queue());
  const consumer = useRef(new Consumer(queue.current));
  const { bleWrite } = useBLE();
  const cb = useMemoizedFn(async (data: string) => {
    await bleWrite(data);
  });

  useMount(() => {
    consumer.current.startConsuming(cb);
  });

  useUnmount(() => {
    consumer.current.stopConsuming();
  });
  return { queue: queue.current, consumer: consumer.current };
};
export { useSend };
