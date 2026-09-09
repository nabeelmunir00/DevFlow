import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');

    this.from =
      this.configService.get<string>('EMAIL_FROM') ??
      'DevFlow <onboarding@resend.dev>';

    this.resend = new Resend(apiKey);
  }

  async sendOrganizationInvitation(params: {
    to: string;
    organizationName: string;
    inviterName: string;
    role: string;
    inviteUrl: string;
    expiresAt: Date;
  }) {
    const { to, organizationName, inviterName, role, inviteUrl, expiresAt } =
      params;

    const { data, error } = await this.resend.emails.send({
      from: this.from,

      to,

      subject: `You're invited to join ${organizationName}`,

      html: `
          <div
            style="
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 32px;
            "
          >
            <h1>
              Join ${organizationName}
            </h1>

            <p>
              ${inviterName} invited you to join
              <strong>${organizationName}</strong>
              on DevFlow.
            </p>

            <p>
              Your role:
              <strong>${role}</strong>
            </p>

            <p>
              <a
                href="${inviteUrl}"
                style="
                  display: inline-block;
                  padding: 12px 20px;
                  background: #000;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 6px;
                "
              >
                Accept Invitation
              </a>
            </p>

            <p>
              This invitation expires on
              ${expiresAt.toUTCString()}.
            </p>

            <p>
              If you weren't expecting this invitation,
              you can ignore this email.
            </p>
          </div>
        `,
    });

    if (error) {
      console.error('Failed to send invitation email:', error);

      throw new InternalServerErrorException('Failed to send invitation email');
    }

    return data;
  }
}
