import { Controller, Get, Render } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  /**
   * Render change logs page
   */
  @Get('changelogs')
  @ApiExcludeEndpoint()
  @Render('api/change-logs')
  getChangeLogs() {
    return null;
  }
}
