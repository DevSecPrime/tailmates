import { Controller } from '@nestjs/common';
import { DeviceTokenService } from './device-token.service';

@Controller('device-token')
export class DeviceTokenController {
  constructor(private readonly deviceTokenService: DeviceTokenService) {}
}
