import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";
import moment from "moment";
import { I18nValidationException } from "nestjs-i18n";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] =
      "Oops! Something went wrong. Please try again later.";
    let error = "Internal Server Error";

    if (exception instanceof I18nValidationException) {
      const messages = exception.errors.flatMap((err) =>
        Object.values(err.constraints || {}),
      );
      message = messages.join(", ");
      error = "Validation Error";
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();

      if (typeof responseBody === "object" && responseBody !== null) {
        const res = responseBody as unknown as {
          message: string;
          error: string;
        };
        const extractedMessage = res.message;
        message = Array.isArray(extractedMessage)
          ? extractedMessage[0]
          : (extractedMessage ?? message);
        error = res.error ?? error;
      } else if (typeof responseBody === "string") {
        message = responseBody;
        error = exception.name;
      }
    } else {
      console.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: moment().toDate(),
      path: request.url,
    });
  }
}
