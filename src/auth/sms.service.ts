import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async sendOtp(phone: string, otp: string): Promise<void> {
    console.log(`Sending OTP ${otp} to ${phone}`);
  }
}