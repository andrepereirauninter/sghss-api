import { Injectable } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
  private readonly MEMORYHEAP_THRESHOLD: number;
  private readonly MEMORYRSS_THRESHOLD: number;

  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {
    this.MEMORYHEAP_THRESHOLD = 150 * 1024 * 1024;
    this.MEMORYRSS_THRESHOLD = 300 * 1024 * 1024;
  }

  async checkHealth() {
    return this.health.check([
      this.databaseCheck,
      this.memoryHeapCheck,
      this.memoryRSSCheck,
      this.storageCheck,
    ]);
  }

  private readonly databaseCheck = async () =>
    this.db.pingCheck('database', { timeout: 300 });

  private readonly memoryHeapCheck = async () =>
    this.memory.checkHeap('memory_heap', this.MEMORYHEAP_THRESHOLD);

  private readonly memoryRSSCheck = async () =>
    this.memory.checkRSS('memory_rss', this.MEMORYRSS_THRESHOLD);

  private readonly storageCheck = async () =>
    this.disk.checkStorage('storage', { thresholdPercent: 0.9, path: '/' });
}
