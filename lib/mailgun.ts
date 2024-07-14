import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || '',
});

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
}

export async function sendEmail({ to, subject, text }: EmailOptions) {
    try {
        return await mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
            from: 'Your App <no-reply@applicaai.com>',
            to,
            subject,
            text,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}
