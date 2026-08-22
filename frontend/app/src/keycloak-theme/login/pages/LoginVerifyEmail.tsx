import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

import { AuthShell } from "../../../components/auth/AuthShell";

export default function LoginVerifyEmail(
    props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>
) {
    const { kcContext } = props;
    const { url, user } = kcContext;

    return (
        <AuthShell
            sideTitle="Neredeyse tamamlandı."
            sideText="Hesabını doğrulayınca 68 kurumun günlük önerilerine anında erişebileceksin."
            proof={[
                { no: "01", text: "Bağlantı hesabınla ilişkili mail kutusuna gitti" },
                { no: "02", text: "Doğrulamadan sonra tekrar giriş yapman gerekmez" },
                { no: "03", text: "Mail gelmezse aşağıdan tekrar gönderebilirsin" },
            ]}
        >
            <div className="done on">
                <div className="done-ico">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="M3 7l9 6 9-6" />
                    </svg>
                </div>
                <h2>E-postanı doğrula</h2>
                <p>
                    {user?.email ? (
                        <>
                            <span className="mail">{user.email}</span> adresine bir doğrulama
                            bağlantısı gönderdik. Devam etmek için gelen kutunu kontrol et.
                        </>
                    ) : (
                        "Hesabınla ilişkili e-posta adresine bir doğrulama bağlantısı gönderdik."
                    )}
                </p>
                <a className="btn btn-ghost" href={url.loginAction}>
                    Bağlantıyı tekrar gönder
                </a>
            </div>

            <p className="foot">
                E-posta birkaç dakika içinde gelmezse gereksiz (spam) klasörünü kontrol et.
                <br />
                Sorun sürerse <a href="mailto:destek@parena.com.tr">destek@parena.com.tr</a> adresine yaz.
            </p>
        </AuthShell>
    );
}