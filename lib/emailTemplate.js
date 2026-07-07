export const DEFAULT_EMAIL_BRANDING = {
  companyName: 'Kag Premium Homes',
  companyDomainName: 'kagpremiumhomes.com',
  email: 'care.kagpremiumhomes@gmail.com',
  address: 'Noida, Uttar Pradesh',
  logoUrl: 'https://kagpremiumhomes.com/logo.png',
  websiteUrl: 'https://kagpremiumhomes.com/',
}

function resolveDomainName(branding = {}) {
  if (branding.companyDomainName) {
    return branding.companyDomainName
  }

  if (branding.websiteUrl) {
    try {
      return new URL(branding.websiteUrl).hostname
    } catch {
      return branding.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    }
  }

  return DEFAULT_EMAIL_BRANDING.companyDomainName
}

function resolveEmailBranding(branding = {}) {
  return {
    ...DEFAULT_EMAIL_BRANDING,
    ...branding,
    domainName: resolveDomainName(branding),
  }
}

export function buildEmailHeader({ branding, title, accentColor = '#0EA5E9' }) {
  const resolvedBranding = resolveEmailBranding(branding)

  return `
    <tr>
      <td align="center" style="padding: 30px 24px; background-color: ${accentColor}; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <a href="${resolvedBranding.websiteUrl}" class="header" style="display: inline-block; text-decoration: none;">
          <img src="${resolvedBranding.logoUrl}" alt="${resolvedBranding.companyName} Logo" style="max-width: 220px; width: 100%; height: auto; display: block; margin: 0 auto;" />
        </a>
        <h1 style="color: #ffffff; margin: 16px 0 0 0; font-size: 24px; line-height: 1.3;">${title}</h1>
      </td>
    </tr>
  `
}

export function buildEmailFooter({ branding, year = new Date().getFullYear() }) {
  const resolvedBranding = resolveEmailBranding(branding)

  return `
    <tr>
      <td style="padding: 20px 30px; text-align: center; background-color: #f8f9fa; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <div class="footer">
          <p style="margin: 0;">If you have any questions, feel free to contact: <a href="mailto:${resolvedBranding.email}">${resolvedBranding.email}</a>.</p>
          <p style="margin: 8px 0 0 0;">Website: <a href="${resolvedBranding.websiteUrl}">${resolvedBranding.domainName}</a></p>
          <p style="margin: 8px 0 0 0;">${resolvedBranding.address}</p>
          <p style="margin: 8px 0 0 0;">&copy; ${year} ${resolvedBranding.companyName}. All rights reserved.</p>
        </div>
      </td>
    </tr>
  `
}

export function wrapEmailTemplate({ bodyContent, title, branding, accentColor = '#0EA5E9' }) {
  const resolvedBranding = resolveEmailBranding(branding)

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
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .content {
        padding: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="container" role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          ${buildEmailHeader({ branding: resolvedBranding, title, accentColor })}
          <tr>
            <td class="content" style="padding: 40px 30px;">
              ${bodyContent}
            </td>
          </tr>
          ${buildEmailFooter({ branding: resolvedBranding })}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}