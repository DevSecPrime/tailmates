import { HttpStatus } from '@nestjs/common';

const authentication = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG4uc25vdy5hZG1pbkBtYWlsaW5hdG9yLmNvbSIsInN1YiI6IjEiLCJqdGkiOiI2YzEzYmNhNTE5MGQ4YWQ3OTU1ZmM1MzRhNjY5MTM3NmYyZWY1NWI3MzRlMmExMjk5NzFlNDU1MzU2MmI4ZTVhIiwiaWF0IjoxNjc2NTM0Mjc0LCJleHAiOjE2Nzg5NTM0NzR9.GbKyURJOhxqScct4LWLt65xuxdJPphYHcFC1ooumH_s',
    },
    refreshToken: {
      type: 'string',
      example: 'DuAitjb1H/pnML7HTU9cnUruoOFT/K2hntcRNUKksaSBEugMyBu64ZPs+Ux8o3hd',
    },
    expiresAt: {
      type: 'number',
      example: 1678953474,
    },
  },
};

const user = {
  type: 'object',
  properties: {
    // id: { type: 'number', example: 1 },
    uid: {
      type: 'string',
      example: 'U65cv4nj76543e6d2gr',
    },
    language: { type: 'string', example: 'en' },
    role: { type: 'string', example: 'user' },
    adminRole: { type: 'string', example: null },
    email: { type: 'string', example: 'johndeo@mailinator.com' },
    verifiedAt: { type: 'number', example: 1676049232 },
    fullName: { type: 'string', example: 'john' },
    profilePic: {
      type: 'string',
      example: 'https://example.com/images/demo-image.jpg',
    },
    isNotificationOn: { type: 'boolean', example: true },
    isBlocked: { type: 'boolean', example: true },
    isProfileSet: { type: 'boolean', example: false },
    isFirstTimeUser: { type: 'boolean', example: false },
    isSocialLoggedIn: { type: 'boolean', example: false },
    providerType: { type: 'string', example: 'google' },
    createdAt: { type: 'number', example: 1676049232 },
  },
};

const deleteAccountReason = {
  type: 'object',
  properties: {
    id: { type: 'number', example: 1 },
    reason: {
      type: 'string',
      example: 'I’m concerned about my data/privacy',
    },
    type: { type: 'string', example: 'option' },
    createdAt: { type: 'number', example: 1746699797668 },
  },
};

// ---------------------------------Errors-----------------------------
export const BAD_REQUEST_RESPONSE = {
  status: HttpStatus.BAD_REQUEST,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: {
        type: 'number',
        example: HttpStatus.BAD_REQUEST,
      },
      message: {
        type: 'string',
        example: 'error message',
      },
      error: {
        type: 'string',
        example: 'Bad Request',
      },
    },
  },
};

export const UNAUTHORIZE_RESPONSE = {
  status: HttpStatus.UNAUTHORIZED,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.UNAUTHORIZED },
      message: {
        type: 'string',
        example: 'Unauthorized',
      },
    },
  },
};

// -----------------------------------------Success responses------------------------------------

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
            example: 'https://apps.apple.com/in/app/app-name/id1123496723?mt=92',
          },
        },
      },
    },
  },
};

export const SEND_OTP_EMAIL = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: {
        type: 'string',
        example:
          'A confirmation email has been sent to your registered email address. Please check it out.',
      },
    },
  },
};

export const USER_LOGIN_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: {
        type: 'string',
        example: 'Your verification code has been successfully verified.',
      },
      data: {
        type: 'object',
        properties: {
          ...user.properties,
          authentication,
        },
      },
    },
  },
};

export const USER_LOGOUT_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'You’ve logged out. See you again soon!' },
    },
  },
};

export const DELETE_ACCOUNT_REASONS_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'Success' },
      data: { type: 'array', items: deleteAccountReason },
    },
  },
};

export const USER_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: { type: 'string', example: 'Success' },
      data: user,
    },
  },
};

export const USER_DELETE_PROFILE_RESPONSE = {
  status: HttpStatus.OK,
  schema: {
    type: 'object',
    description: 'Response',
    properties: {
      statusCode: { type: 'number', example: HttpStatus.OK },
      message: {
        type: 'string',
        example: 'Your profile has been deleted successfully. We’re sad to see you go!',
      },
    },
  },
};
