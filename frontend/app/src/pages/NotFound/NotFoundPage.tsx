import { AppLink } from "@/components/ui/app-link";
import { ParenaMark } from "@/components/brand/ParenaMark";
import { ROUTES } from "@/router/routes";

import "./NotFoundPage.css";

export const notFoundPageMeta = {
  title: "Sayfa Bulunamadı | Parena",
  description: "Aradığınız sayfa bulunamadı. PARENA ana sayfasına dönebilirsiniz.",
  ogTitle: "Sayfa Bulunamadı | Parena",
  ogDescription: "Aradığınız sayfa bulunamadı. PARENA ana sayfasına dönebilirsiniz.",
};

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <ParenaMark size={48} />
      <p className="not-found-code">404</p>
      <h1>Sayfa bulunamadı</h1>
      <p>Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <AppLink className="btn btn-primary" href={ROUTES.home}>
        Ana sayfaya dön
      </AppLink>
    </div>
  );
}
