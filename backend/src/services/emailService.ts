import nodemailer from 'nodemailer';
import { EmailTemplateData } from '../types';

/**
 * Email service configuration and methods
 */

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: EmailTemplateData;
}

/**
 * Create nodemailer transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Email templates
 */
const emailTemplates = {
  emailVerification: (data: EmailTemplateData) => ({
    subject: 'Verify Your Email - Test School',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Test School!</h2>
        <p>Hello ${data.name},</p>
        <p>Thank you for registering with Test School. Please verify your email address by clicking the link below:</p>
        <p style="margin: 20px 0;">
          <a href="${data.verificationLink}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email Address
          </a>
        </p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <p>Best regards,<br>Test School Team</p>
      </div>
    `,
    text: `Welcome to Test School! Please verify your email address by visiting: ${data.verificationLink}`
  }),

  passwordReset: (data: EmailTemplateData) => ({
    subject: 'Password Reset - Test School',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${data.name},</p>
        <p>You requested a password reset for your Test School account. Click the link below to reset your password:</p>
        <p style="margin: 20px 0;">
          <a href="${data.resetLink}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 10 minutes. If you didn't request this reset, please ignore this email.</p>
        <p>Best regards,<br>Test School Team</p>
      </div>
    `,
    text: `Password reset requested. Please visit: ${data.resetLink}`
  }),

  otpCode: (data: EmailTemplateData) => ({
    subject: 'Your OTP Code - Test School',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your OTP Code</h2>
        <p>Hello ${data.name},</p>
        <p>Your One-Time Password (OTP) code is:</p>
        <div style="background-color: #f8f9fa; border: 2px solid #007bff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #007bff; margin: 0; font-size: 32px; letter-spacing: 5px;">${data.otpCode}</h1>
        </div>
        <p>This code will expire in 10 minutes. Do not share this code with anyone.</p>
        <p>Best regards,<br>Test School Team</p>
      </div>
    `,
    text: `Your OTP code is: ${data.otpCode}. This code will expire in 10 minutes.`
  }),

  certificateGenerated: (data: EmailTemplateData) => ({
    subject: `Congratulations! You've earned ${data.certificateLevel} certification`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>🎉 Congratulations!</h2>
        <p>Hello ${data.name},</p>
        <p>We're excited to inform you that you have successfully completed the Test School assessment and earned your <strong>${data.certificateLevel}</strong> certification!</p>
        <p>Your digital certificate is now available in your account dashboard.</p>
        <p style="margin: 20px 0;">
          <a href="${process.env.FRONTEND_URL}/dashboard" 
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Certificate
          </a>
        </p>
        <p>Keep up the great work on your digital competency journey!</p>
        <p>Best regards,<br>Test School Team</p>
      </div>
    `,
    text: `Congratulations! You've earned ${data.certificateLevel} certification. View your certificate at: ${process.env.FRONTEND_URL}/dashboard`
  })
};

/**
 * Send email using the specified template
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    // Get template
    const template = emailTemplates[options.template as keyof typeof emailTemplates];
    if (!template) {
      throw new Error(`Email template '${options.template}' not found`);
    }

    const templateData = template(options.data);

    // Email options
    const mailOptions = {
      from: `"Test School" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject || templateData.subject,
      html: templateData.html,
      text: templateData.text,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send plain text email (for simple notifications)
 */
export const sendPlainEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Test School" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Verify email configuration
 */
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};
