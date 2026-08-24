import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthErrorShell } from "../components/AuthErrorShell";

const ClockIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default function LoginPageExpired(
    props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>
) {
    const { kcContext } = props;
    const { url, properties } = kcContext;

    const appUrl = properties?.APP_URL ?? "/"; // runtime'da Keycloak container'ından gelir

    return (
        <AuthErrorShell
            icon={<ClockIcon />}
            title="Bağlantının süresi doldu"
            docTitle="Bağlantının süresi doldu | Parena"
            actions={
                <>
                    <a className="btn" href={url.loginRestartFlowUrl}>
                        Yeni bağlantı iste
                    </a>
                    <a className="btn btn-ghost" href={appUrl}>
                        Anasayfaya dön
                    </a>
                </>
            }
        >
            <p>
                Bu bağlantının geçerlilik süresi dolmuş. Güvenliğin için bağlantılar sınırlı
                süre geçerlidir — endişelenme, yeni bir tane isteyebilirsin.
            </p>
        </AuthErrorShell>
    );
}