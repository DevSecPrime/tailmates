import { storagePath } from 'src/config/app.config';

/**
 * Cast file to storage path
 * @param file
 * @returns
 */
export const castToStorage = (file: string | null) => {
  return file ? storagePath(file) : file;
};
