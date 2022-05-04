import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryInterface } from './query.interface';

export class QueryProductDto implements QueryInterface {
  [key: string]: number;
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  categoryId?: number;
}
