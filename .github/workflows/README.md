# Vercel GitHub Workflow Setup

Bu klasör, Vercel'e otomatik deployment için GitHub Actions workflow'larını içerir.

## Kurulum

### 1. Vercel Project ID ve Org ID'yi Alın

Vercel projenizi CLI ile bağlayın:

```bash
vercel link --token YOUR_VERCEL_TOKEN --yes
```

Bu komut `.vercel/project.json` dosyasını oluşturacak. İçeriğini okuyun:

```bash
cat .vercel/project.json
```

`projectId` ve `orgId` değerlerini not edin.

### 2. GitHub Repository Secrets Ekleyin

GitHub repository'nize gidin:
`Settings > Secrets and variables > Actions > New repository secret`

Aşağıdaki secrets'ları ekleyin:

- **VERCEL_TOKEN**: Vercel API token'ınız
- **VERCEL_ORG_ID**: `.vercel/project.json` dosyasındaki `orgId`
- **VERCEL_PROJECT_ID**: `.vercel/project.json` dosyasındaki `projectId`

### 3. Workflow'ları Test Edin

```bash
# Main branch'e push yapın
git push origin main

# Veya PR oluşturun
git checkout -b feature/test
git push origin feature/test
gh pr create --title "Test PR" --body "Testing Vercel deployment"
```

## Workflow'lar

### vercel-production.yml

- **Trigger**: `main` branch'e push
- **Action**: Production deployment
- **URL**: `https://kafkasder-panel.vercel.app` (veya custom domain)

### vercel-preview.yml

- **Trigger**: Pull Request açıldığında
- **Action**: Preview deployment
- **URL**: Her PR için unique preview URL

## Troubleshooting

### Secret Bulunamıyor Hatası

GitHub Actions'da secrets doğru şekilde ayarlanmış mı kontrol edin.

### Vercel Build Hatası

Local'de build çalışıyor mu test edin:

```bash
npm run build
```

### Environment Variables Eksik

Vercel dashboard'dan environment variables'ları kontrol edin:
https://vercel.com/chedevlooper-creator/kafkasder-panel/settings/environment-variables

## Manuel Deployment

Workflow'ları kullanmadan manuel deploy:

```bash
vercel --prod --token YOUR_VERCEL_TOKEN
```
