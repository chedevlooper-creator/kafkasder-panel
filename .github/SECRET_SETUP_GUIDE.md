# GitHub Secrets Manuel Kurulum Rehberi

## Adımlar

1. **GitHub Repository'ye gidin:**
   - https://github.com/chedevlooper-creator/Panel-1

2. **Settings sekmesine tıklayın**

3. **Sol menüden "Secrets and variables" > "Actions" seçin**

4. **"New repository secret" butonuna tıklayın**

5. **Aşağıdaki secret'ları tek tek ekleyin:**

### Secret 1: NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Secret: https://idsiiayyvygcgegmqcov.supabase.co
```

### Secret 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkc2lpYXl5dnlnY2dlZ21xY292Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNDg4NjMsImV4cCI6MjA4MTkyNDg2M30.blDE-L_aRNSwoawUCD3esFt_CMk2fhy8TpShsgyshZQ
```

### Secret 3: SUPABASE_SERVICE_ROLE_KEY (⚠️ Admin Access)
```
Name: SUPABASE_SERVICE_ROLE_KEY
Secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlkc2lpYXl5dnlnY2dlZ21xY292Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjM0ODg2MywiZXhwIjoyMDgxOTI0ODYzfQ.Wv-s1d65uagiS6d0SCnfZKL3AGKQJelVWo13x5B4SZ4
```
**🔒 GÜVENLİK UYARISI:** Bu anahtar admin yetkilerine sahiptir. Sadece server-side API route'larda ve background job'larda kullanın. Asla client-side kodda veya NEXT_PUBLIC_ prefix'iyle kullanmayın!

## Opsiyonel Secret'lar

### Vercel Deployment için (ileride gerekirse):
- `VERCEL_TOKEN`: Vercel hesabınızdan alın (https://vercel.com/account/tokens)
- `VERCEL_ORG_ID`: `.vercel/project.json` dosyasından
- `VERCEL_PROJECT_ID`: `.vercel/project.json` dosyasından

### Code Coverage için:
- `CODECOV_TOKEN`: Codecov hesabınızdan alın (https://codecov.io)

## Doğrulama

Secret'lar eklendikten sonra:
1. Repository'nin "Actions" sekmesine gidin
2. Son commit'e ait workflow'ların başarıyla çalıştığını kontrol edin
3. Yeşil ✓ işaretlerini görmelisiniz

## Not

`.env.local` dosyası yerel development için otomatik olarak oluşturuldu ve `.gitignore` tarafından ignore ediliyor (güvenlik için).
