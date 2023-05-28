import { Module } from '@nestjs/common'
import { PlaycountService } from './playcount.service'
import { Playcount } from './playcount.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PlaycountController } from './playcount.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Playcount])],
  providers: [PlaycountService],
  controllers: [PlaycountController],
})
export class PlaycountModule {}
