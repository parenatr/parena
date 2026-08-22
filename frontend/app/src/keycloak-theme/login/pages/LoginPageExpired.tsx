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
    const { kcContext, i18n } = props;
    const { url } = kcContext;
    const { msgStr } = i18n;

    return (
        <AuthErrorShell icon={<ClockIcon />} title={msgStr("pageExpiredTitle")}>
            <p>
                {msgStr("pageExpiredMsg1")}{" "}
                <a href={url.loginRestartFlowUrl}>{msgStr("doClickHere")}</a>.
            </p>
            <p style={{ marginTop: 8 }}>
                {msgStr("pageExpiredMsg2")}{" "}
                <a href={url.loginAction}>{msgStr("doClickHere")}</a>.
            </p>
        </AuthErrorShell>
    );
}