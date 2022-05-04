import { Injectable } from '@nestjs/common';
import { QueryInterface } from 'src/product/dtos/query.interface';
import * as readline from 'readline';
import { Writable } from 'stream';
import { ExportServiceInterface } from 'src/product/services/ExportService.interface';
import { createReadStream } from 'fs';

@Injectable()
export class ExportationService<T> {
  async exportData(
    query: QueryInterface,
    writable: Writable,
    exportService: ExportServiceInterface<T>,
  ) {
    query.page = 1;
    let data: T[] = [];

    while (true) {
      data = await exportService.findAll(query);

      if (data.length === 0) {
        break;
      }

      data.forEach((c) => writable.write(JSON.stringify(c) + '\n'));
      query.page++;
    }

    writable.end();
    return;
  }

  async importData(fileName: string, exportService: ExportServiceInterface<T>) {
    let totalReads = 0;
    let totalFinished = 0;

    // Awaits until the process ends
    const resp = new Promise((resolve, reject) => {
      const readable = createReadStream('./' + fileName);
      const rl = readline.createInterface(readable);

      // read Each line to insert into database
      rl.on('line', async (input: string) => {
        totalReads++;

        try {
          const object = JSON.parse(input);
          delete object.id;
          await exportService.create(object);
        } catch (err) {
          rl.close();
          reject(err);
        }

        totalFinished++;
        if (readable.readableEnded && totalReads === totalFinished) {
          resolve(true);
        }
      });
    });

    return resp;
  }
}
