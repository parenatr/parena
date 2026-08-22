import type { ReactNode } from "react";
import "../../../components/auth/auth-shell.css";

type AuthErrorShellProps = {
    icon?: ReactNode;
    title: string;
    children: ReactNode;
};

/**
 * Hata/süre-dolumu sayfaları için sade kabuk — AuthShell'in iki panelli,
 * pazarlama odaklı tasarımı bu bağlamda uygun değil. auth-shell.css'teki
 * genel .card/.btn sınıflarını yeniden kullanıyor, .shell/.side grid'ine
 * bağlı değil.
 */
export function AuthErrorShell({ icon, title, children }: AuthErrorShellProps) {
    return (
        <div className="auth-page">
            <main className="main" style={{ minHeight: "100vh" }}>
                <div className="card" style={{ textAlign: "center" }}>
                    {icon && <div className="done-ico" style={{ margin: "0 auto 18px" }}>{icon}</div>}
                    <h1>{title}</h1>
                    <div className="sub" style={{ marginTop: 12 }}>{children}</div>
                </div>
            </main>
        </div>
    );
}