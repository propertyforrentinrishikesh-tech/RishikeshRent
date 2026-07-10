import connectDB from '@/lib/connectDB'
import CompanyBasicInfo from '@/models/CompanyBasicInfo'

const DEFAULT_BRANDING = {
  companyName: 'Rishikesh Rent',
  companyDomainName: 'rishikeshrent.com',
  email: 'care.rishikeshrent@gmail.com',
  address: 'Jai Ram Ashram Complex, First Floor Rishikesh 249201',
  logoUrl: 'https://rishikeshrent.com/logo.png',
  websiteUrl: 'https://rishikeshrent.com/',
}

export async function getEmailBranding() {
  try {
    await connectDB()

    const company = await CompanyBasicInfo.findOne().sort({ updatedAt: -1 }).lean()

    if (!company) {
      return DEFAULT_BRANDING
    }

    const primaryEmail = Array.isArray(company.emails) ? company.emails.find(Boolean) : ''
    const address = Array.isArray(company.officeAddresses) && company.officeAddresses.length > 0
      ? company.officeAddresses[0]
      : company.googleAddress || DEFAULT_BRANDING.address

    return {
      companyName: company.companyName || DEFAULT_BRANDING.companyName,
      companyDomainName: company.companyDomainName || DEFAULT_BRANDING.companyDomainName,
      email: primaryEmail || DEFAULT_BRANDING.email,
      address,
      logoUrl:
        company.mainLogo?.url ||
        company.footerLogo?.url ||
        company.mobileUiLogo?.url ||
        DEFAULT_BRANDING.logoUrl,
      websiteUrl: company.websiteUrl || DEFAULT_BRANDING.websiteUrl,
    }
  } catch (error) {
    console.error('Failed to load email branding:', error)
    return DEFAULT_BRANDING
  }
}

export function buildEmailHeader({ branding, title, accentColor = '#4F46E5' }) {
  return `
    <tr>
        <td style="padding: 30px 0; text-align: center; background-color: ${accentColor}; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <a href="${branding.websiteUrl || DEFAULT_BRANDING.websiteUrl}" class="header">
                <img src="${branding.logoUrl}" alt="${branding.companyName} Logo" style="max-width: 300px; width: 100%; height: auto;" />
            </a>
            <h1 style="color: #ffffff; margin: 0; margin-top:12px; font-size: 24px;">${title}</h1>
        </td>
    </tr>
  `
}

export function buildEmailFooter({ branding, year = new Date().getFullYear() }) {
  return `
    <tr>
        <td style="padding: 20px 30px; text-align: center; background-color: #f8f9fa; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
            <div class="footer">
                <p>If you have any questions, feel free to contact: <a href="mailto:${branding.email}">${branding.email}</a>.</p>
          <p style="margin: 8px 0 0 0;">Website: <a href="${branding.websiteUrl || DEFAULT_BRANDING.websiteUrl}">${branding.companyDomainName || DEFAULT_BRANDING.companyDomainName}</a></p>
                <p style="margin: 8px 0 0 0;">${branding.address}</p>
                <p>&copy; ${year} ${branding.companyName}. All rights reserved.</p>
            </div>
        </td>
    </tr>
  `
}

export function wrapEmailTemplate({ bodyContent, title, branding, accentColor = '#4F46E5' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style type="text/css">
    .header {
            text-align: center;
            padding: 20px 0;
        }
        .header img {
            max-width: 300px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #777777;
            border-top: 1px solid #eeeeee;
            margin-top: 20px;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table class="container" role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                    ${buildEmailHeader({ branding, title, accentColor })}
                    <tr>
                        <td class="content" style="padding: 40px 30px;">
                            ${bodyContent}
                        </td>
                    </tr>
                    ${buildEmailFooter({ branding })}
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
}