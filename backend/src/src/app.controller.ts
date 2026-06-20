import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Render index page
   * @returns
   */
  @Get()
  @Render('pages/index')
  index() {
    return null;
  }

  /**
   * Render privacy policy page
   * @returns
   */
  @Get('privacy-policy')
  @Render('pages/privacy-policy')
  getPrivacyPolicy() {
    return null;
  }

  /**
   * Render terms and conditions page
   * @returns
   */
  @Get('terms-and-conditions')
  @Render('pages/terms-and-conditions')
  getTermsAndConditions() {
    return null;
  }

  /**
   * Render support page
   * @returns
   */
  @Get('support')
  @Render('pages/support')
  getSupport() {
    return null;
  }

  /**
   * Render delete account page
   * @returns
   */
  @Get('delete-account')
  @Render('pages/delete-account')
  getDeleteAccount() {
    return null;
  }
}
