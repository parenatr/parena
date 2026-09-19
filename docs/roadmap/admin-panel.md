# Admin Paneli / Konsolu — Roadmap (TODO)

**Durum:** Planlanıyor, henüz geliştirmeye başlanmadı. Dashboard'dan (kullanıcı-facing uygulama) bağımsız, ayrı bir iş — karıştırılmamalı.

## Amaç

Parena ekibinin kullanacağı, son kullanıcıya kapalı bir admin paneli/konsolu: kullanıcı yönetimi, SPK auditability kayıtlarının incelenmesi (bkz. `audit-kvkk-compliance.md` §4), içerik/kurum yönetimi gibi operasyonel admin işleri buradan yapılacak.

## Bilinen mimari kararlar (önceden `.claude/rules/security/` altında dokümante edilmiş)

- **Ayrı domain**: `admin.parena.com.tr` — `keycloak-realm-security.md` §3'te zaten "planned admin.parena.com.tr" olarak geçiyor.
- **Tailscale izolasyonu**: Public internete tamamen kapalı olacak, mevcut Keycloak admin endpoint izolasyon prensibiyle aynı (`keycloak-realm-security.md` §3 — `100.64.0.0/10` Tailscale IP aralığı).
- **Ayrı admin-bff**: Mevcut `bff-server`'dan bağımsız, kendi confidential client'ı, kendi PKCE akışı, kendi session namespace'i (`admin:session`) olacak — `bff-token-architecture.md` §4, §6 checklist'inde zaten "adding a new subdomain/service (e.g. admin-bff)" olarak genel kural halinde var.
- **Zorunlu OTP**: `bff-token-architecture.md` §6'da "the admin-bff plan also requires mandatory OTP" notu düşülmüş — henüz detaylandırılmamış.

## Kapsam dışı / henüz karar verilmemiş

- Admin panelinin frontend'i ayrı bir proje/deployment mi olacak, yoksa mevcut `frontend/app` içinde mi (ayrı bir Vite entry ile) yaşayacak — karar verilmedi.
- Hangi admin işlemlerinin (kullanıcı yönetimi, içerik/kurum onayı, audit log görüntüleme vb.) ilk sürümde yer alacağı netleşmedi.
- DNS/NPM tarafında `admin.parena.com.tr` için proxy host henüz tanımlı değil (bugün itibarıyla sadece `api.` ve `auth.` tanımlı — bkz. 2026-09-19 domain doğrulaması).

## Not

Bu doküman, 2026-09-19'da frontend routing/tasarım işi sırasında yapılan bir domain mimarisi netleştirmesi sonucunda, konunun unutulmaması için oluşturuldu. Dashboard'un gerçek geliştirmesi başladığında veya admin paneli işine geçilmeden önce bu doküman güncellenip detaylandırılmalı.
