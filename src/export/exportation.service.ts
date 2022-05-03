import { Injectable } from '@nestjs/common';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from '../product/services/product.service';
import { FileSerivce } from './file.service';

@Injectable()
export class ExportationService {
    constructor(
        private productService: ProductService,
        private fileSerivce: FileSerivce,
    ) {}

    async exportProductsByCategoryId(categoryId: number) {
        const fileName = await this.fileSerivce.createFile()

        let page = 1;
        let products: Product[] = []

        while (true) {
            products = await this.productService.findAll({categoryId, page})

            if (products.length === 0) {
                break
            }

            const formatedContent = this.formatContent(products, page !== 1)

            await this.fileSerivce.appendFile(fileName, formatedContent)
            page++

        }

        this.fileSerivce.closeFile(fileName)

        return fileName;
    }

    
  private formatContent(contentRaw: any[], addBeginnigComma: boolean = false): string {
    const contentString = JSON.stringify(contentRaw)

    // removing square brackets
    const formatedContent = contentString.slice(0, contentString.length -1).slice(1)

    return addBeginnigComma ? ',' + formatedContent : formatedContent;
  }
}
