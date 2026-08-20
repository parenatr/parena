/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        tr: {
            // Tam olarak Keycloak'ın fırlattığı Türkçe mesajın karşılığı
            emailSentMessage: "E-posta adresiniz sistemde kayıtlıysa sıfırlama bağlantısı gönderilmiştir. Lütfen gelen kutunuzu kontrol edin.",
            logoutOtherSessions: "Diğer tüm oturumları kapat",
            backToApplication: "Uygulamaya Dön",
            proceedWithAction: "Devam etmek için buraya tıklayın",
            confirmExecutionOfActions: "Aşağıdaki eylemleri gerçekleştirin",
        },
        en: {
            emailSentMessage: "You should receive an email shortly with further instructions.",
            logoutOtherSessions: "Sign out from other devices",
            backToApplication: "Back to Application",
            proceedWithAction: "Click here to proceed",
            confirmExecutionOfActions: "Perform the following action(s)",
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };