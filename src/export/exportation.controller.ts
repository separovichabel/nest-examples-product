import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { ExportationService } from './exportation.service';

@ApiTags('export / import')
@Controller()
export class ExportationController {
  constructor(private readonly exportation: ExportationService) {}

  @Get('category/:categoryId/export-products')
  async create(@Param('categoryId') categoryId: string, @Res() res: Response) {
    const fileName = await this.exportation.exportProductsByCategoryId(+categoryId);
    const file = createReadStream(join(process.cwd(), fileName));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    file.pipe(res);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
