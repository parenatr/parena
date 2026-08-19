import { useEffect, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { AuthShell } from "../../../components/auth/AuthShell";
import { AuthPasswordField } from "../../../components/auth/AuthField";

export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { msg, msgStr } = i18n;

    const { url, messagesPerField, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = "Yeni Şifre Belirle | Parena";
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordNew, setPasswordNew] = useState("");

    const hasFieldError = messagesPerField.existsError("password", "password-confirm");

    return (
        <AuthShell
            kcContext={kcContext}
            sideTitle="Son adım: yeni şifreni belirle."
            sideText="Güçlü bir şifre seç, hesabını güvende tut. Kaydettikten sonra doğrudan hesabına yönlendirileceksin."
            proof={[
                { no: "01", text: "En az 8 karakter, harf ve rakam içermeli" },
                { no: "02", text: "Güncelleme sonrası tüm oturumlar kapanır" },
                { no: "03", text: "Şifreni kimseyle paylaşma" }
            ]}
        >
            <div className="card-top">
                <p className="eyebrow">Şifre güncelle</p>
                <h1>Yeni şifreni belirle</h1>
                <p className="sub">Hesabının güvenliği için yeni bir şifre oluştur.</p>
            </div>

            <form
                id="kc-passwd-update-form"
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
                action={url.loginAction}
                method="post"
                noValidate
            >
                <AuthPasswordField
                    id="password-new"
                    name="password-new"
                    label={msg("passwordNew")}
                    placeholder="En az 8 karakter"
                    autoFocus
                    autoComplete="new-password"
                    value={passwordNew}
                    onChange={e => setPasswordNew(e.target.value)}
                    aria-invalid={hasFieldError}
                    error={messagesPerField.existsError("password") ? messagesPerField.get("password") : undefined}
                >
                    <PasswordStrengthMeter password={passwordNew} />
                </AuthPasswordField>

                <AuthPasswordField
                    id="password-confirm"
                    name="password-confirm"
                    label={msg("passwordConfirm")}
                    placeholder="Şifreni tekrar gir"
                    autoComplete="new-password"
                    aria-invalid={hasFieldError}
                    error={messagesPerField.existsError("password-confirm") ? messagesPerField.get("password-confirm") : undefined}
                />

                <div className="row">
                    <label className="check">
                        <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked />
                        <span>{msg("logoutOtherSessions")}</span>
                    </label>
                </div>

                <div id="kc-form-buttons">
                    <button type="submit" className="btn" disabled={isSubmitting} id="kc-login">
                        {isSubmitting ? "Güncelleniyor…" : msgStr("doSubmit")}
                    </button>
                    {isAppInitiatedAction && (
                        <button type="submit" className="btn btn-ghost" name="cancel-aia" value="true" style={{ marginTop: 10 }}>
                            {msg("doCancel")}
                        </button>
                    )}
                </div>
            </form>

            <p className="foot">Bu şifreyi başka hiçbir yerde kullanma.</p>
        </AuthShell>
    );
}

function passScore(v: string) {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v) && v.length >= 10) s++;
    return Math.min(s, 4);
}

const METER_TXT = ["Çok zayıf", "Zayıf", "Orta", "İyi", "Güçlü"];

/** `.field` içine, input ile hata satırı arasına yerleşen şifre gücü göstergesi. */
function PasswordStrengthMeter({ password }: { password: string }) {
    const score = password ? Math.max(passScore(password), 1) : 0;

    return (
        <>
            <div className={`meter${score ? ` s${score}` : ""}`}>
                <i></i>
                <i></i>
                <i></i>
                <i></i>
            </div>
            <p className="meter-txt">{password ? METER_TXT[score] : "En az 8 karakter, harf ve rakam kullan."}</p>
        </>
    );
}
