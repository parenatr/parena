import { useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { AuthShell } from "../../../components/auth/AuthShell";
import { AuthField } from "../../../components/auth/AuthField";

export default function LoginResetPassword(
    props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>
) {
    const { kcContext } = props;
    const { url, realm, auth, messagesPerField } = kcContext;

    const [isSubmitting, setIsSubmitting] = useState(false);

    const usernameLabel = !realm.loginWithEmailAllowed
        ? "Kullanıcı adı"
        : !realm.registrationEmailAsUsername
            ? "E-posta veya kullanıcı adı"
            : "E-posta adresi";

    const hasUsernameError = messagesPerField.existsError("username");
    const usernameErrorHtml = hasUsernameError ? kcSanitize(messagesPerField.get("username")) : undefined;

    return (
        <AuthShell
            kcContext={kcContext}
            sideTitle="Parolanı sıfırlamak birkaç saniye sürer."
            sideText="E-posta adresini gir; hesabın varsa sıfırlama bağlantısını gönderelim."
            proof={[
                { no: "01", text: "Bağlantı 60 dakika geçerlidir" },
                { no: "02", text: "Sıfırlama sonrası tüm oturumlar kapanır" },
                { no: "03", text: "Talep etmediysen bir işlem yapmana gerek yok" },
            ]}
        >
            <div className="card-top">
                <p className="eyebrow">Parola sıfırlama</p>
                <h1>Parolanı mı unuttun?</h1>
                <p className="sub">
                    E-posta adresini gir, sıfırlama bağlantısını gönderelim.{" "}
                    <a href={url.loginUrl}>Giriş sayfasına dön</a>
                </p>
            </div>

            <form
                id="kc-reset-password-form"
                action={url.loginAction}
                method="post"
                noValidate
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
            >
                <AuthField
                    id="username"
                    name="username"
                    label={usernameLabel}
                    type="text"
                    autoFocus
                    defaultValue={auth.attemptedUsername ?? ""}
                    aria-invalid={hasUsernameError}
                    error={hasUsernameError ? " " : undefined}
                />

                {hasUsernameError && (
                    <p className="err on" role="alert" dangerouslySetInnerHTML={{ __html: usernameErrorHtml! }} />
                )}

                <button type="submit" className="btn" disabled={isSubmitting}>
                    {isSubmitting ? "Gönderiliyor…" : "Sıfırlama bağlantısı gönder"}
                </button>
            </form>

            <p className="foot">
                E-posta birkaç dakika içinde gelmezse gereksiz (spam) klasörünü kontrol et.
                <br />
                Sorun sürerse <a href="mailto:destek@parena.com.tr">destek@parena.com.tr</a> adresine yaz.
            </p>
        </AuthShell>
    );
}