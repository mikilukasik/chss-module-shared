import { WorkerApi } from "./workerApi.js";

export class WorkerPool {
  private workerAvaiters: ((value: WorkerApi) => void)[] = [];
  public workers;
  public availableWorkers: WorkerApi[] = [];

  constructor({
    WorkerClass,
    workerCount,
    workerSource,
  }: {
    WorkerClass: any;
    workerCount: number;
    workerSource: string;
  }) {
    this.workers = new Array(workerCount).fill(null).map(() => {
      const worker = new WorkerClass(workerSource);
      const workerApi = new WorkerApi({ nodeWorker: worker });

      return workerApi;
    });

    this.availableWorkers = this.workers.slice();
  }

  public async getAvailableWorker(): Promise<WorkerApi> {
    const readyWorker = this.availableWorkers.pop();
    if (readyWorker) return readyWorker;

    return new Promise((r) => this.workerAvaiters.push(r));
  }

  public doOnAll(...args: [string, any]) {
    return this.workers.map((w) => w.do(...args));
  }

  public async doOnAvailable(...args: [string, any]) {
    const worker = await this.getAvailableWorker();

    const result: any = await worker.do(...args);

    const workerAwaiter = this.workerAvaiters.shift();
    if (workerAwaiter) {
      workerAwaiter(worker);
      return result;
    }

    this.availableWorkers.push(worker);
    return result;
  }
}
