<#--
  This file has been claimed for ownership from @keycloakify/email-native version 260007.0.0.
  To relinquish ownership and restore this file to its original content, run the following command:
  
  $ npx keycloakify own --path "email/html/template.ftl" --revert
-->

<#macro emailLayout>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
</head>
<body style="margin:0; padding:0; background-color:#F4F5F7; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F5F7; padding: 32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border-radius:12px; overflow:hidden; max-width:600px;">

          <#-- Header -->
          <tr>
            <td align="center" bgcolor="#13294B" style="background-color:#13294B; padding: 32px 0;">
              <img src="${url.resourcesUrl}/logo.png" width="44" height="44" alt="Parena" style="display:block; border:0;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;">
                <tr>
                  <td style="font-size:20px; font-weight:bold; letter-spacing:0.5px; color:#FFFFFF !important;">
                    PAR<span style="color:#E0B54E !important;">ENA</span>
                  </td>
                </tr>
             </table>
            </td>
          </tr>

          <#-- Body -->
          <tr>
            <td style="padding: 36px 40px; color:#1F2937; font-size:15px; line-height:1.6;">
              <#nested>
            </td>
          </tr>

          <#-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top:1px solid #EEEEEE; font-size:12px; color:#9CA3AF; text-align:center;">
              <p style="margin:0 0 8px 0;">Bu e-postayı Parena hesabınla ilgili bir işlem nedeniyle aldın.</p>
              <p style="margin:0;">© ${.now?string("yyyy")} Parena — Portföy Arena</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
</#macro>