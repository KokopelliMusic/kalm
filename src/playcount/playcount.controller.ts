import { Controller, Get, Param } from '@nestjs/common'
import { PlaycountService } from './playcount.service'

@Controller('playcount')
export class PlaycountController {
  constructor(private playcountService: PlaycountService) {}

  @Get('all')
  async findAll() {
    return await this.playcountService.findAll()
  }

  @Get(':client')
  async findByClient(@Param() params: any) {
    return await this.playcountService.findByClient(params.client)
  }
}
