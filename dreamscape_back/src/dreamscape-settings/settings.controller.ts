import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Headers,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Controller()
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('getSettings')
  async getSettings(@Res() res, @Headers('requested-from') user) {
    const settings = await this.settingsService.getSettings(user);
    return res.status(HttpStatus.OK).json(settings);
  }

  @Put('updateSettings/:settingsID')
  async updateSettings(
    @Res() res,
    @Param('settingsID', new ValidateObjectId()) settingsID,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    const settings = await this.settingsService.updateSettings(
      settingsID,
      updateSettingsDto,
    );
    return res.status(HttpStatus.OK).json(settings);
  }

  @Post('createSettings')
  async createSettings(
    @Res() res,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    const settings = await this.settingsService.createSettings(
      updateSettingsDto,
    );
    return res.status(HttpStatus.OK).json(settings);
  }
}
