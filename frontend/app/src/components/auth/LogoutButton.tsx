import { logout } from "@/features/auth/auth.api";

export function LogoutButton() {
  return (
    <button onClick={logout} className="btn-ghost">
      Çıkış yap
    </button>
  );
}