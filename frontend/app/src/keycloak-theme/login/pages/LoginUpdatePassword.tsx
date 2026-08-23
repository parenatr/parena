import { useEffect, useState } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { AuthShell } from "../../../components/auth/AuthShell";
import { AuthPasswordField } from "../../../components/auth/AuthField";
import { getPasswordRuleError, scorePasswordStrength, STRENGTH_LABELS } from "@/lib/password-policy";

//Yeni Parola Belirle -> new Password 
export default function LoginUpdatePassword(props: PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { msg, msgStr } = i18n;
    const { url, messagesPerField, isAppInitiatedAction, auth } = kcContext;

    useEffect(() => {
        document.title = "Yeni Parola Belirle | Parena";
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordNew, setPasswordNew] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [clientError, setClientError] = useState<string | undefined>();

    const hasFieldError = messagesPerField.existsError("password", "password-confirm");

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        const ruleError = getPasswordRuleError(passwordNew, auth?.attemptedUsername);
        if (ruleError) {
            e.preventDefault();
            setClientError(ruleError);
            return;
        }
        if (passwordNew !== passwordConfirm) {
            e.preventDefault();
            setClientError("Parolalar eşleşmiyor.");
            return;
        }
        setClientError(undefined);
        setIsSubmitting(true);
    }
    return (
        <AuthShell
            sideTitle="Son adım: yeni parolanı belirle."
            sideText="Güçlü bir parola seç, hesabını güvende tut. Kaydettikten sonra doğrudan hesabına yönlendirileceksin."
            proof={[
                { no: "01", text: "En az 10 karakter, büyük/küçük harf, rakam, özel karakter" },
                { no: "02", text: "Güncelleme sonrası tüm oturumlar kapanır" },
                { no: "03", text: "Parolanı kimseyle paylaşma" }
            ]}
        >
            <div className="card-top">
                <p className="eyebrow">Parola güncelle</p>
                <h1>Yeni parolanı belirle</h1>
                <p className="sub">Hesabının güvenliği için yeni bir parola oluştur.</p>
            </div>

            <form
                id="kc-passwd-update-form"
                onSubmit={handleSubmit}
                action={url.loginAction}
                method="post"
                noValidate
            >
                <AuthPasswordField
                    id="password-new"
                    name="password-new"
                    label={msg("passwordNew")}
                    placeholder="En az 10 karakter"
                    autoFocus
                    autoComplete="new-password"
                    value={passwordNew}
                    onChange={e => setPasswordNew(e.target.value)}
                    aria-invalid={hasFieldError}
                    error={
                        clientError ??
                        (messagesPerField.existsError("password") ? messagesPerField.get("password") : undefined)
                    }
                >
                    <PasswordStrengthMeter password={passwordNew} />
                </AuthPasswordField>

                <AuthPasswordField
                    id="password-confirm"
                    name="password-confirm"
                    label={msg("passwordConfirm")}
                    placeholder="Parolanı tekrar gir"
                    autoComplete="new-password"
                    value={passwordConfirm}
                    onChange={e => setPasswordConfirm(e.target.value)}
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

            <p className="foot">Bu parolayı başka hiçbir yerde kullanma.</p>
        </AuthShell>
    );
}


function PasswordStrengthMeter({ password }: { password: string }) {
    const score = password ? Math.max(scorePasswordStrength(password), 1) : 0;

    return (
        <>
            <div className={`meter${score ? ` s${score}` : ""}`}>
                <i></i><i></i><i></i><i></i>
            </div>
            <p className="meter-txt">{password ? STRENGTH_LABELS[score] : STRENGTH_LABELS[0]}</p>
        </>
    );
}