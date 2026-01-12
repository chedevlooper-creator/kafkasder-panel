# Güvenlik Politikası

## 🛡️ Desteklenen Versiyonlar

Şu anda sadece en son versiyon için güvenlik güncellemeleri sağlanmaktadır.

| Version | Destekleniyor |
| ------- | ------------- |
| 0.1.x   | ✅            |
| < 0.1   | ❌            |

## 🚨 Güvenlik Açığı Bildirme

Projenizde bir güvenlik açığı bulduğunuzu düşünüyorsanız, lütfen **public issue açmayın**. Bunun yerine:

### 1. Private Reporting (Önerilen)

GitHub'ın Security Advisory özelliğini kullanın:

1. Repository'nin [Security](https://github.com/Kafkasportal/Portal/security) sekmesine gidin
2. "Report a vulnerability" butonuna tıklayın
3. Formun tamamını doldurun:
   - Açığın detaylı açıklaması
   - Etkilenen dosya/kod
   - Tekrarlama adımları
   - Potansiyel etkisi
   - Önerilen çözüm (varsa)

### 2. Email ile Bildirim

Alternatif olarak, güvenlik açıklarını şu adrese e-posta ile bildirebilirsiniz:

**security@kafkasder.org**

E-postanızda şunları belirtin:
- Açığın türü (örn: XSS, SQL Injection, CSRF)
- Etkilenen dosya/route
- Tekrarlama adımları
- PoC (Proof of Concept) kodu (varsa)
- Potansiyel etkisi

### 3. Response Time

- **İlk Yanıt**: 48 saat içinde
- **Durum Güncellemesi**: Her 7 günde bir
- **Düzeltme Süresi**: Kritik açıklar için 7 gün, diğerleri için 30 gün

## 🔒 Güvenlik Önlemleri

Projede alınan güvenlik önlemleri:

### Authentication & Authorization
- Supabase Auth ile güvenli kimlik doğrulama
- Row Level Security (RLS) politikaları
- JWT token tabanlı oturum yönetimi
- Role-based access control (RBAC)

### Input Validation
- Zod ile strict schema validation
- XSS koruması (DOMPurify kullanımı)
- SQL injection koruması (Supabase ORM)
- CSRF token koruması

### Data Security
- HTTPS enforced
- Environment variables ile hassas bilgi yönetimi
- Client-side'da API key'lerin saklanmaması
- Supabase RLS ile data isolation

### Code Security
- CodeQL security scanning (GitHub Actions)
- Dependabot security updates
- ESLint security rules
- Regular dependency audits (`npm audit`)

### Infrastructure
- Vercel edge network
- DDoS protection
- Rate limiting
- Automatic SSL/TLS certificates

## 🔍 Security Best Practices

Katkıda bulunurken lütfen şu güvenlik pratiklerini uygulayın:

### 1. Hassas Bilgiler
- ❌ API key'leri commit'lemeyin
- ❌ Şifreleri hardcode etmeyin
- ❌ .env dosyasını commit'lemeyin
- ✅ .env.example kullanın

### 2. Input Handling
- ✅ Tüm user input'ları validate edin
- ✅ Zod schemas kullanın
- ✅ Sanitize edin (XSS koruması)
- ✅ Type checking yapın

### 3. Authentication
- ✅ Token'ları güvenli saklayın
- ✅ Timeout/expiry ayarlayın
- ✅ HTTPS kullanın
- ✅ Sensitive routes'ları koruyun

### 4. Database
- ✅ RLS policies kullanın
- ✅ Prepared statements kullanın
- ✅ Minimum privilege principle
- ✅ Regular backups

### 5. Dependencies
- ✅ Dependencies'leri güncel tutun
- ✅ `npm audit` çalıştırın
- ✅ Known vulnerabilities'leri düzeltin
- ✅ Lock files commit'leyin

## 📋 Security Checklist

Pull request açmadan önce kontrol edin:

- [ ] Yeni dependency güvenli mi? (npm audit)
- [ ] Input validation var mı?
- [ ] XSS açığı yok mu?
- [ ] SQL injection açığı yok mu?
- [ ] Hassas bilgi commit'lenmemiş mi?
- [ ] Environment variables kullanılmış mı?
- [ ] Authentication/authorization doğru mu?
- [ ] Error messages hassas bilgi içermiyor mu?

## 🏆 Hall of Fame

Güvenlik açıklarını sorumlu bir şekilde bildiren kişilere teşekkürler:

<!-- Contributor isimleri buraya eklenecek -->

## 📚 Kaynaklar

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

## 📞 İletişim

Güvenlikle ilgili sorular için:
- **Email**: security@kafkasder.org
- **Security Advisory**: [GitHub Security](https://github.com/Kafkasportal/Portal/security)

---

Son Güncelleme: 10 Ocak 2026
