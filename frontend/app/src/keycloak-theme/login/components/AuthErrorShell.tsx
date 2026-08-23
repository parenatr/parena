import { useEffect, type ReactNode } from "react";
import "../../../components/auth/auth-shell.css";

type AuthErrorShellProps = {
    icon?: ReactNode;
    title: string;
    docTitle: string;
    children: ReactNode;
    actions?: ReactNode;
};

export function AuthErrorShell({ icon, title, docTitle, children, actions }: AuthErrorShellProps) {
    useEffect(() => {
        document.title = docTitle;
    }, [docTitle]);

    return (
        <div className="auth-page">
            <main className="main" style={{ minHeight: "100vh" }}>
                <div className="card" style={{ textAlign: "center" }}>
                    {icon && <div className="done-ico" style={{ margin: "0 auto 18px" }}>{icon}</div>}
                    <h1>{title}</h1>
                    <div className="sub" style={{ marginTop: 12 }}>{children}</div>
                    {actions && (
                        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 10 }}>
                            {actions}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}