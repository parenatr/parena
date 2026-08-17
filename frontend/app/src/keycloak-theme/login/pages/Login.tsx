import { useEffect, useState } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useScript } from "keycloakify/login/pages/Login.useScript";

import { AuthShell } from "../../../components/auth/AuthShell";
import { AuthField, AuthPasswordField } from "../../../components/auth/AuthField";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext } = props;
    const FRONTEND_REGISTER_URL = `${kcContext.properties.APP_URL}/uye-ol`;

    useEffect(() => {
        document.title = "Giriş Yap | Parena";
    }, []);

    const { realm, url, usernameHidden, login, auth, messagesPerField, message, enableWebAuthnConditionalUI, authenticators } =
        kcContext;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    const webAuthnButtonId = "authenticateWebAuthnButton";

    useScript({
        webAuthnButtonId,
        kcContext,
        i18n: props.i18n
    });

    const usernameLabel = !realm.loginWithEmailAllowed
        ? "Kullanıcı adı"
        : !realm.registrationEmailAsUsername
            ? "E-posta veya kullanıcı adı"
            : "E-posta adresi";

    const hasFieldError = messagesPerField.existsError("username", "password");
    const fieldErrorHtml = hasFieldError ? kcSanitize(messagesPerField.getFirstError("username", "password")) : undefined;

    return (
        <AuthShell
            kcContext={kcContext}
            sideTitle="Bugünün karnesi seni bekliyor."
            sideText="Günlük, haftalık, model portföy ve kısa vadeli önerilerin tamamı, her birinin kâr/zararıyla birlikte."
        >
            <div className="card-top">
                <p className="eyebrow">Giriş</p>
                <h1>Hesabına giriş yap</h1>
                <p className="sub">
                    Hesabın yok mu? <a href={FRONTEND_REGISTER_URL}>Ücretsiz oluştur</a>
                </p>
            </div>

            {/* Keycloak'ın kendi ürettiği durum mesajları — örn. reset-password
                sonrası "E-postana talimatlar gönderildi" bildirimi buradan geliyor.
                messagesPerField (alan hataları) ile ayrı, çakışmaları test ederken izleyin. */}
            {message !== undefined && (
                <p className={`notice notice-${message.type}`} role="status">
                    {message.summary}
                </p>
            )}

            {realm.password && (
                <form
                    id="kc-form-login"
                    onSubmit={() => {
                        setIsLoginButtonDisabled(true);
                        return true;
                    }}
                    action={url.loginAction}
                    method="post"
                    noValidate
                >
                    {!usernameHidden && (
                        <AuthField
                            id="username"
                            name="username"
                            label={usernameLabel}
                            type="text"
                            defaultValue={login.username ?? ""}
                            autoFocus
                            autoComplete={enableWebAuthnConditionalUI ? "username webauthn" : "username"}
                            aria-invalid={hasFieldError}
                            error={usernameHidden ? undefined : hasFieldError ? " " : undefined}
                        />
                    )}

                    <AuthPasswordField
                        id="password"
                        name="password"
                        label="Parola"
                        autoComplete="current-password"
                        aria-invalid={hasFieldError}
                        error={usernameHidden && hasFieldError ? " " : undefined}
                    />

                    {hasFieldError && (
                        <p className="err on" role="alert" dangerouslySetInnerHTML={{ __html: fieldErrorHtml! }} />
                    )}

                    <div className="row">
                        {realm.rememberMe && !usernameHidden && (
                            <label className="check">
                                <input type="checkbox" id="rememberMe" name="rememberMe" defaultChecked={!!login.rememberMe} />
                                <span>Beni hatırla</span>
                            </label>
                        )}
                        {realm.resetPasswordAllowed && (
                            <a className="link-sm" href={url.loginResetCredentialsUrl}>
                                Parolamı unuttum
                            </a>
                        )}
                    </div>

                    <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                    <button type="submit" className="btn" disabled={isLoginButtonDisabled} name="login" id="kc-login">
                        {isLoginButtonDisabled ? "Giriş yapılıyor…" : "Giriş yap"}
                    </button>
                </form>
            )}

            {enableWebAuthnConditionalUI && (
                <>
                    <form id="webauth" action={url.loginAction} method="post">
                        <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                        <input type="hidden" id="authenticatorData" name="authenticatorData" />
                        <input type="hidden" id="signature" name="signature" />
                        <input type="hidden" id="credentialId" name="credentialId" />
                        <input type="hidden" id="userHandle" name="userHandle" />
                        <input type="hidden" id="error" name="error" />
                    </form>

                    {authenticators !== undefined && authenticators.authenticators.length !== 0 && (
                        <form id="authn_select">
                            {authenticators.authenticators.map((authenticator, i) => (
                                <input key={i} type="hidden" name="authn_use_chk" readOnly value={authenticator.credentialId} />
                            ))}
                        </form>
                    )}

                    <input id={webAuthnButtonId} type="button" className="btn btn-ghost" value="Passkey ile giriş yap" />
                </>
            )}

            <p className="foot">
                Tek aktif oturum kuralı geçerlidir: yeni bir cihazdan giriş yaptığında önceki oturumun kapanır.
            </p>
        </AuthShell>
    );
}