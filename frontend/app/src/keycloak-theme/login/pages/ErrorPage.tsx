import type { PageProps } from "keycloakify/login/pages/PageProps";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { AuthErrorShell } from "../components/AuthErrorShell";

const ErrorIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export default function Error(props: PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { message, client, skipLink } = kcContext;
    const { msgStr } = i18n;

    return (
        <AuthErrorShell icon={<ErrorIcon />} title={msgStr("errorTitle")}>
            <p dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />
            {!skipLink && !!client?.baseUrl && (
                <a className="btn btn-ghost" href={client.baseUrl} style={{ marginTop: 16, display: "inline-flex" }}>
                    {msgStr("backToApplication")}
                </a>
            )}
        </AuthErrorShell>
    );
}