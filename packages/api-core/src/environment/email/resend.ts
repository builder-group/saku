import { Resend } from 'resend';
import { emailConfig } from '../configs';

export const resend = new Resend(emailConfig.resend.apiKey);
