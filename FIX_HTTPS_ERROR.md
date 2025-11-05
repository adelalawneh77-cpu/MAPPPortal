# حل مشكلة "Domain is not eligible for HTTPS"

## المشكلة
GitHub Pages يعرض رسالة: **"Domain www.mirqabtutorial.com is not eligible for HTTPS at this time"**

## الحل السريع (خطوة بخطوة)

### الخطوة 1: تنظيف DNS في لوحة التحكم

1. **اذهب إلى لوحة تحكم DNS** (GoDaddy, Namecheap, etc.)
2. **احذف جميع السجلات** المتعلقة بـ `mirqabtutorial.com`:
   - احذف أي سجلات "park" أو "forwarding"
   - احذف أي سجلات A أو CNAME قديمة
3. **انتظر 5-10 دقائق** بعد الحذف

### الخطوة 2: إضافة سجلات DNS الصحيحة

#### أ) سجل CNAME لـ www:
- **Type**: `CNAME`
- **Name**: `www`
- **Value**: `adelalawneh77-cpu.github.io`
- **TTL**: 3600

#### ب) سجلات A للنطاق الجذر (4 سجلات منفصلة):
- **Type**: `A`
- **Name**: `@` (أو اتركه فارغاً)
- **Value**: `185.199.108.153` ← **سجل منفصل**
- **TTL**: 3600

- **Type**: `A`
- **Name**: `@`
- **Value**: `185.199.109.153` ← **سجل منفصل**

- **Type**: `A`
- **Name**: `@`
- **Value**: `185.199.110.153` ← **سجل منفصل**

- **Type**: `A`
- **Name**: `@`
- **Value**: `185.199.111.153` ← **سجل منفصل**

### الخطوة 3: التحقق من DNS

1. **انتظر 5-10 دقائق** بعد إضافة السجلات
2. **استخدم https://dnschecker.org** للتحقق:
   - ابحث عن `www.mirqabtutorial.com` → يجب أن يظهر `adelalawneh77-cpu.github.io`
   - ابحث عن `mirqabtutorial.com` → يجب أن تظهر عناوين IP الأربعة

### الخطوة 4: تحديث GitHub Pages

1. **في GitHub**: Settings > Pages
2. **احذف النطاق المخصص** (إذا كان موجوداً):
   - اضغط **Remove** على `www.mirqabtutorial.com`
   - انتظر 2-3 دقائق
3. **أعد إضافة النطاق**:
   - أدخل `www.mirqabtutorial.com` (تأكد من الإملاء الصحيح)
   - اضغط **Save**
4. **انتظر 5-10 دقائق**
5. **اضغط "Check again"** للتحقق من DNS
6. **بعد التحقق الناجح** (✓ خضراء)، يمكنك تفعيل **Enforce HTTPS**

## نصائح مهمة

✅ **تأكد من:**
- جميع عناوين IP الأربعة موجودة كسجلات A منفصلة
- CNAME يشير إلى `adelalawneh77-cpu.github.io` (بدون https://)
- لا توجد سجلات "park" أو "forwarding"
- الإملاء صحيح: `mirqabtutorial.com` (وليس mirqabtoturial)

❌ **تجنب:**
- استخدام CNAME للنطاق الجذر (apex domain)
- سجلات DNS متضاربة
- الانتظار أقل من 5 دقائق بعد التغييرات

## إذا استمرت المشكلة

1. **تحقق من DNS عالمياً**: https://dnschecker.org
2. **انتظر حتى 48 ساعة** لانتشار DNS بالكامل
3. **جرب استخدام النطاق بدون www**: `mirqabtutorial.com` (يحتاج فقط سجلات A)
4. **راجع**: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages

