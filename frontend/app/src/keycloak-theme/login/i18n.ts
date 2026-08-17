/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        tr: {
            // Tam olarak Keycloak'ın fırlattığı Türkçe mesajın karşılığı
            emailSentMessage: "E-posta adresiniz sistemde kayıtlıysa sıfırlama bağlantısı gönderilmiştir. Lütfen gelen kutunuzu kontrol edin."
        },
        en: {
            emailSentMessage: "You should receive an email shortly with further instructions."
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };