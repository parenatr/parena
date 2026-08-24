<#--
  This file has been claimed for ownership from @keycloakify/email-native version 260007.0.0.
  To relinquish ownership and restore this file to its original content, run the following command:
  
  $ npx keycloakify own --path "email/html/email-verification.ftl" --revert
-->

<#import "template.ftl" as layout>
<@layout.emailLayout>
  <h1 style="font-size:20px; color:#13294B; margin:0 0 16px 0;">${msg("emailVerificationTitle")}</h1>
  <p style="margin:0 0 24px 0;">${msg("emailVerificationIntro", realmName)}</p>
  <table role="presentation" cellpadding="0" cellspacing="0">
    <tr>
      <td style="border-radius:8px; background-color:#13294B;">
        <a href="${link}" target="_blank" style="display:inline-block; padding:12px 28px; font-size:15px; font-weight:bold; color:#FFFFFF; text-decoration:none;">
          ${msg("emailVerificationButton")}
        </a>
      </td>
    </tr>
  </table>
  <p style="margin:24px 0 0 0; font-size:13px; color:#6B7280;">
    ${msg("emailVerificationExpiry", linkExpirationFormatter(linkExpiration))}
  </p>
</@layout.emailLayout>