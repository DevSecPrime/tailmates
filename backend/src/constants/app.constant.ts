import dotenv from 'dotenv';
dotenv.config();

export const BASE_URL = process.env.APP_URL;
export const STORAGE_PATH = 'public/storage';
export const IMAGE_EXTENSIONS = 'jpg|jpeg|png|gif|heic';
export const AUDIO_EXTENSIONS = 'mp3|m4a';

export const DEFAULT_COUNT = 0;
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 15;

export enum DeviceTypes {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
}

export enum Languages {
  EN = 'en',
}

export enum MessageType {
  TEXT = 'text',
  AUDIO = 'audio',
  IMAGE = 'image',
}

export enum AppVersionsStatus {
  UP_TO_DATE = 0,
  OUTDATED = 1,
  OPTIONAL = 2,
}
