// -----------------------------------------Success responses------------------------------------

import { HttpStatus } from '@nestjs/common';

export const CHECK_APP_VERSION_RESPONSE = {
  status: HttpStatus.CREATED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.CREATED },
      message: { type: 'string', example: 'Your app is up to date' },
      data: {
        type: 'object',
        properties: {
          status: { type: 'number', example: 0 },
          link: {
            type: 'string',
            example:
              'https://apps.apple.com/in/app/app-name/id1123496723?mt=92',
          },
        },
      },
    },
  },
};
