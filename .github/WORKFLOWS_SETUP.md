# GitHub Secrets Yapılandırması

Workflow'ların düzgün çalışması için aşağıdaki GitHub Secrets'ları repository ayarlarından ekleyin:

## Repository Settings > Secrets and variables > Actions

### Vercel Deployment Secrets
- `VERCEL_TOKEN`: Vercel deployment için token ([vercel.com/account/tokens](https://vercel.com/account/tokens))
- `VERCEL_ORG_ID`: Vercel organizasyon ID'si
- `VERCEL_PROJECT_ID`: Vercel proje ID'si

### Supabase Secrets
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase proje URL'si
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

### Optional Secrets
- `CODECOV_TOKEN`: Code coverage raporları için ([codecov.io](https://codecov.io))

## Vercel Token Alma

1. [vercel.com/account/tokens](https://vercel.com/account/tokens) adresine gidin
2. "Create Token" butonuna tıklayın
3. Token'a bir isim verin (örn: "GitHub Actions")
4. Scope olarak "Full Account" seçin
5. Token'ı kopyalayıp GitHub Secrets'a ekleyin

## Vercel Project ID ve Org ID Alma

Proje dizininde:
```bash
vercel link
```

Ardından `.vercel/project.json` dosyasından ID'leri alın.

## Workflow'ları Aktif Etme

1. GitHub repository > Settings > Actions > General
2. "Allow all actions and reusable workflows" seçeneğini aktif edin
3. "Read and write permissions" seçeneğini aktif edin (deployment için)

## Workflow Durumunu Kontrol Etme

- Repository'nin "Actions" sekmesinden workflow durumlarını görebilirsiniz
- Her commit ve PR için otomatik olarak çalışacaklar
