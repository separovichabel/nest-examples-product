import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ProductModule } from 'src/product/product.module';
import { ExportationController } from './exportation.controller';
import { ExportationService } from './exportation.service';
import { FileSerivce } from './file.service';

@Module({
  controllers: [ExportationController],
  imports: [
    ProductModule,
    MulterModule.register({
      dest: './temp',
    }),
  ],
  providers: [ExportationService, FileSerivce],
})
export class ExportationModule {}
