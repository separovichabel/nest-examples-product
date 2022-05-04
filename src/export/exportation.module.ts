import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { ExportationController } from './exportation.controller';
import { ExportationService } from './exportation.service';
import { FileSerivce } from './file.service';

@Module({
  controllers: [ExportationController],
  imports: [ProductModule],
  providers: [ExportationService, FileSerivce],
})
export class ExportationModule {}