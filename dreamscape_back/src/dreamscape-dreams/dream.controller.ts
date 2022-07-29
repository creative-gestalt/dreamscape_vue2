import {
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Headers,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { AddDreamDto } from './dto/add-dream.dto';
import { Dream } from './interfaces/dream.interface';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';

@Controller()
export class DreamController {
  constructor(private readonly dreamsService: DreamsService) {}

  @Get('getDreamsCount')
  async getDreamsCount(@Res() res, @Headers('requested-from') user) {
    const dreams = await this.dreamsService.getAllDreams(user);
    const count = dreams.length;
    return res.status(HttpStatus.OK).json(count);
  }

  @Get('getDreams/:params')
  async getDreams(
    @Res() res,
    @Param('params') params,
    @Headers('requested-from') user,
  ) {
    const skip = Number(params.split('-')[0]);
    const limit = Number(params.split('-')[1]);
    const dreams = await this.dreamsService.getDreams(user, skip, limit);
    return res.status(HttpStatus.OK).json(dreams);
  }

  @Get('getDream/:dreamID')
  async getDream(
    @Res() res,
    @Param('dreamID', new ValidateObjectId()) dreamID,
    @Headers('requested-from') user,
  ) {
    const dream = await this.dreamsService.getDream(user, dreamID);
    if (!dream) throw new NotFoundException('Dream does not exist!');
    return res.status(HttpStatus.OK).json(dream);
  }

  @Get('searchDreams')
  async searchDreams(
    @Res() res,
    @Query('target') target,
    @Headers('requested-from') user,
  ) {
    const search = await this.dreamsService.searchDreams(user, target);
    const response = { count: search.length, dreams: search };
    return res.status(HttpStatus.OK).json(response);
  }

  @Get('getDreamDates')
  async getDreamDates(@Res() res, @Headers('requested-from') user) {
    const dreams = await this.dreamsService.getAllDreams(user);
    const dates = dreams.map((dream) => dream.date);
    return res.status(HttpStatus.OK).json(dates);
  }

  @Post('addDream')
  async addDream(
    @Res() res,
    @Body() addDreamDto: AddDreamDto,
    @Headers('requested-from') user,
  ) {
    const dream = await this.dreamsService.addDream(user, addDreamDto);
    return res.status(HttpStatus.OK).json({
      message: 'Dream added successfully.',
      dream: dream[0],
    });
  }

  @Post('deleteDreams')
  async deleteDreams(
    @Res() res,
    @Body() dreams: Dream[],
    @Headers('requested-from') user,
  ) {
    const deletedDreams = await this.dreamsService.deleteDreams(user, dreams);
    return res.status(HttpStatus.OK).json({
      message: 'Dreams have been deleted.',
      dreams: deletedDreams,
    });
  }

  @Put('updateDream')
  async updateDream(
    @Res() res,
    @Query('dreamID', new ValidateObjectId()) dreamID,
    @Body() addDreamDto: AddDreamDto,
    @Headers('requested-from') user,
  ) {
    const dream = await this.dreamsService.updateDream(
      user,
      dreamID,
      addDreamDto,
    );
    return res.status(HttpStatus.OK).json(dream);
  }
}
