import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/services/product.service';
import { ExportationService } from './exportation.service';

@ApiTags('export / import')
@Controller()
export class ExportationController {
  constructor(
    private readonly exportation: ExportationService<Product>,
    private readonly productService: ProductService,
  ) {}

  @Get('category/:categoryId/export-products')
  async create(@Param('categoryId') categoryId: string, @Res() res: Response) {
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="export-categoryId-${categoryId}.ejson"`,
    });
    await this.exportation.exportData(
      { categoryId: +categoryId },
      res,
      this.productService,
    );
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.exportation.importData(file.path, this.productService);
  }
}
