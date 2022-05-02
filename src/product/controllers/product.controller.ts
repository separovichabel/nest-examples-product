import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from '../dtos/create-product.dto';
import { QueryProductDto } from '../dtos/query-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { NotFoundInterceptor } from '../interceptors/notFound.interceptor';
import { ProductService } from '../services/product.service';
import { JoiValidationPipe } from '../validation/joiValidation.pipe';
import { queryProductSchema } from '../validation/query-product.schema';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query(new JoiValidationPipe(queryProductSchema)) query?: QueryProductDto,
  ) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @UseInterceptors(NotFoundInterceptor)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(NotFoundInterceptor)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseInterceptors(NotFoundInterceptor)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
