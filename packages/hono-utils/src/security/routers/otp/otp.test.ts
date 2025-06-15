import { describe, expect, it } from 'vitest';
import { generateOtp } from './otp';

describe('generateOtp', () => {
	it('generates a 6-digit base10 OTP', () => {
		const otp = generateOtp(6, 'base10');
		expect(otp).toMatch(/^\d{6}$/);
	});

	it('generates a 7-digit base10 OTP', () => {
		const otp = generateOtp(7, 'base10');
		expect(otp).toMatch(/^\d{7}$/);
	});

	it('generates an 8-digit base10 OTP', () => {
		const otp = generateOtp(8, 'base10');
		expect(otp).toMatch(/^\d{8}$/);
	});

	it('generates a fixed 6-character base36 OTP', () => {
		const otp = generateOtp(6, 'base36');
		expect(otp).toMatch(/^[a-z0-9]{6}$/);
		expect(otp.length).toBe(6);
	});

	it('generates a fixed 8-character base36 OTP', () => {
		const otp = generateOtp(8, 'base36');
		expect(otp).toMatch(/^[a-z0-9]{8}$/);
		expect(otp.length).toBe(8);
	});
});
