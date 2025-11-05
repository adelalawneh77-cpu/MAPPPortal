# دليل نشر المشروع على GitHub Pages

## المشكلة الحالية
الخطأ الذي تواجهه متعلق بإعدادات DNS للنطاق المخصص `www.mirqabtoturial.com`. GitHub Pages لا يمكنه التحقق من سجلات DNS.

## الحلول المطلوبة

### 1. إعداد DNS للنطاق المخصص

لإصلاح مشكلة DNS، يجب إضافة السجلات التالية في إعدادات DNS للنطاق `mirqabtoturial.com`:

#### في لوحة تحكم DNS (مثل GoDaddy, Namecheap, etc.):

**لنطاق www:**
- **Type**: `CNAME`
- **Name**: `www`
- **Value**: `adelalawneh77-cpu.github.io`
- **TTL**: 3600 (أو Default)

**لنطاق الجذر (apex domain):**
- **Type**: `A`
- **Name**: `@` (أو اتركه فارغاً)
- **Value**: أحد عناوين IP التالية:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- **TTL**: 3600 (أو Default)

**ملاحظة**: أضف جميع عناوين IP الأربعة كسجلات A منفصلة.

### 2. إعدادات GitHub Pages

1. اذهب إلى **Settings** > **Pages** في مستودع GitHub
2. في قسم **Custom domain**:
   - أدخل `www.mirqabtoturial.com`
   - اضغط **Save**
3. انتظر حتى يتم التحقق من DNS (قد يستغرق بضع دقائق إلى 24 ساعة)
4. بعد التحقق، يمكنك تفعيل **Enforce HTTPS**

### 3. تحديث إعدادات Backend API

يجب تحديث `environment.prod.ts` لاستخدام URL حقيقي للـ backend:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-api-url.com'  // استبدل هذا بـ URL الـ backend الحقيقي
};
```

**ملاحظة مهمة**: GitHub Pages يستضيف فقط ملفات static (HTML, CSS, JS). يجب نشر الـ Backend (ASP.NET Core) على منصة أخرى مثل:
- Azure App Service
- Heroku
- Railway
- Render
- أو أي hosting يدعم .NET

### 4. خطوات النشر

1. **تأكد من أن الكود موجود على branch `main`** (أو `master`)

2. **قم ببناء المشروع محلياً للتأكد من عدم وجود أخطاء**:
   ```bash
   cd mappportal.client
   npm install
   npm run build -- --configuration production
   ```

3. **ارفع التغييرات إلى GitHub**:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

4. **GitHub Actions سيقوم تلقائياً بنشر المشروع** عند push إلى main

5. **بعد النشر، انتظر بضع دقائق** ثم تحقق من:
   - `https://adelalawneh77-cpu.github.io/MAPPPortal/` (بدون نطاق مخصص)
   - أو `https://www.mirqabtoturial.com` (بعد إصلاح DNS)

### 5. استكشاف الأخطاء

إذا استمرت مشكلة DNS:

1. **تحقق من سجلات DNS** باستخدام أدوات مثل:
   - https://dnschecker.org
   - `nslookup www.mirqabtoturial.com`
   - `dig www.mirqabtoturial.com`

2. **تأكد من أن السجلات نشطة** (قد يستغرق DNS propagation حتى 48 ساعة)

3. **حاول إزالة النطاق المخصص مؤقتاً** من GitHub Pages والتحقق من أن الموقع يعمل بدون نطاق مخصص

4. **أعد إضافة النطاق** بعد التأكد من صحة سجلات DNS

### 6. ملاحظات إضافية

- **CORS**: تأكد من إضافة نطاق GitHub Pages في إعدادات CORS في الـ Backend
- **HTTPS**: لا يمكن تفعيل HTTPS حتى يتم التحقق من DNS بنجاح
- **Routing**: تم إضافة ملف `404.html` للتعامل مع Angular routing بشكل صحيح

## روابط مفيدة

- [GitHub Pages Custom Domain Documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Troubleshooting Custom Domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages)

