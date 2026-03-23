import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListingsQueryDto } from './dto/listings-query-dto';
import { ListingsService } from './listings.service';
import { IsAdmin } from '../common/decorators/is-admin.decorator';
import { ListingResults } from './types/listing-response.type';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  findAll(
    @Query() query: ListingsQueryDto,
    @IsAdmin() isAdmin: boolean,
  ): Promise<ListingResults> {
    return this.listingsService.findAll(query, isAdmin);
  }

  @Get(':id')
  findById(@Param('id') id: string, @IsAdmin() isAdmin: boolean) {
    return this.listingsService.findById(id, isAdmin);
  }
}
