import { Resend } from 'resend';
import { appConfig } from './app.config';

export const resend = new Resend(appConfig.resend.apiKey);
