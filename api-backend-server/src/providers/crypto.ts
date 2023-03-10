import * as crypto from 'crypto';
import envConfig from '../config/config';
import { logger } from './logger';

export const encrypt = (textToEncrypt:string) => {
  try {
    const iv = Buffer.from(envConfig.APP_SALT, 'hex');
    // this.iv = this.crypto.randomBytes(16);
    const key = Buffer.from(envConfig.APP_KEY, 'hex');
    const algorithm:string = 'aes-256-cbc';
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(textToEncrypt);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Failed to encrypt ${textToEncrypt}`,
      error: err
    });
    throw new Error('Failed to encrypt');
  }
};

export const decrypt = (textToDecrypt:string) => {
  try {
    const iv = Buffer.from(envConfig.APP_SALT, 'hex');
    // this.iv = this.crypto.randomBytes(16);
    const key = Buffer.from(envConfig.APP_KEY, 'hex');
    const algorithm = 'aes-256-cbc';
    const encryptedText = Buffer.from(textToDecrypt, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    logger.log({
      level: 'error',
      message: `Failed to decrypt ${textToDecrypt}`,
      error: err
    });
    return false;
  }
};

const randomString = (size = 32) => crypto
  .randomBytes(size)
  .toString('base64')
  .slice(0, size);
