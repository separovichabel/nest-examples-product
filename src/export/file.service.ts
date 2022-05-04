import { Injectable, OnModuleInit } from '@nestjs/common';
import { mkdir, readdir } from 'fs/promises';

@Injectable()
export class FileSerivce implements OnModuleInit {
  private path = 'temp';

  async onModuleInit() {
    await this.createDefaultPaths();
  }

  private async createDefaultPaths() {
    const tempPathImportExists = (await readdir('.')).includes(this.path);

    if (!tempPathImportExists) {
      await mkdir(this.path);
    }
  }
}
