import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { useEffect } from "react";

import { ParenaMark } from "@/components/brand/ParenaMark";
import "./info.css";


export default function Info(props: PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { msgStr } = i18n;
    const { message, messageHeader, requiredActions, skipLink, pageRedirectUri, actionUri, client, locale, properties } = kcContext;

    const appUrl = properties?.APP_URL; // runtime'da Keycloak container'ından gelir

    useEffect(() => {
        document.title = "Hesabını Güncelle | Parena";
    }, []);

    const header = messageHeader ?? message.summary;

    const instructionHtml =
        kcSanitize(message.summary) +
        (requiredActions
            ? `: <b>${requiredActions.map(action => kcSanitize(msgStr(`requiredAction.${action}` as Parameters<typeof msgStr>[0]))).join(", ")}</b>`
            : "");

    const showLink = skipLink === undefined;
    const link = pageRedirectUri
        ? { href: pageRedirectUri, label: msgStr("backToApplication") }
        : actionUri
            ? { href: actionUri, label: msgStr("proceedWithAction") }
            : client.baseUrl
                ? { href: client.baseUrl, label: msgStr("backToApplication") }
                : appUrl
                    ? { href: appUrl, label: "Anasayfaya dön" }
                    : undefined;

    return (
        <div className="info-page">
            <a className="info-wordmark" href={appUrl ?? "/"} aria-label="PARENA ana sayfa">
                <ParenaMark size={30} />
                <span>
                    PAR<em>ENA</em>
                </span>
            </a>

            <div className="info-card">
                {locale && locale.supported.length > 1 && (
                    <div className="info-lang">
                        <select
                            aria-label={msgStr("languages")}
                            value={locale.supported.find(l => l.languageTag === locale.currentLanguageTag)?.url}
                            onChange={e => {
                                window.location.href = e.target.value;
                            }}
                        >
                            {locale.supported.map(l => (
                                <option key={l.languageTag} value={l.url}>
                                    {l.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <h1>{header}</h1>

                <p className="info-instruction" dangerouslySetInnerHTML={{ __html: instructionHtml }} />

                {showLink && link && (
                    <a className="btn" href={link.href}>
                        {link.label}
                    </a>
                )}
            </div>
        </div>
    );
}
