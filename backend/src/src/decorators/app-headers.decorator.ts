import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { DeviceTypes, Languages } from 'src/constants/app.constant';

export function AppHeaders() {
  return applyDecorators(
    // Accept Language
    ApiHeader({
      name: 'Accept-Language',
      description: 'User\'s language',
      schema: {
        type: 'string',
        enum: Object.values(Languages),
        example: Languages.EN,
      },
      required: true,
    }),

    // App Versions
    ApiHeader({
      name: 'App-Version',
      description: 'Version of the user application',
      schema: {
        type: 'string',
        example: '1.0.0',
      },
      required: true,
    }),

    // Device Types
    ApiHeader({
      name: 'Device-Type',
      description: 'Type of device making the request',
      required: true,
      schema: {
        type: 'string',
        enum: Object.values(DeviceTypes),
        example: DeviceTypes.ANDROID,
      },
      enum: Object.values(DeviceTypes),
    }),

    //Timezone
    ApiHeader({
      name: 'timezone',
      description: 'Please pass user timezone',
      required: true,
      schema: {
        type: 'string',
        example: 'Asia/Kolkata',
      },
    }),
  );
}
