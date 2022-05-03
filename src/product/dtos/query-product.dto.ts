import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProductDto {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  limit?: number;

  @ApiPropertyOptional()
  categoryId?: number;
}
