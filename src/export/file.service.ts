import { Injectable, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { appendFile, mkdir, readdir, writeFile } from 'fs/promises';

@Injectable()
export class FileSerivce implements OnModuleInit {

  private path = 'temp';

  async onModuleInit() {
    await this.createDefaultPaths()
  }

  private async createDefaultPaths() {
    const tempPathImportExists = (await readdir('.')).includes(this.path)
    
    if (!tempPathImportExists) {
      await mkdir(this.path)
    }
  }

  async createFile(): Promise<string> {
    const newFilename = `${this.path}/${randomUUID()}.json`;
    await writeFile(newFilename, '[\n');
    return newFilename;
  }

  closeFile(filename: string) {
    return this.appendFile(filename, ']');
  }

  appendFile(fileName: string, content: string) {
    return appendFile(fileName, content + '\n')
  }
}
