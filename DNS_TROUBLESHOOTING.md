# حل مشكلة DNS - InvalidDNSError

## المشكلة الحالية
```
Both www.mirqabtutorial.com and its alternate name are improperly configured
Domain's DNS record could not be retrieved. (InvalidDNSError)
```

## الحلول التفصيلية

### الحل 1: التحقق من سجلات DNS الحالية

**استخدم هذه الأدوات للتحقق:**

1. **DNS Checker**: https://dnschecker.org
   - ابحث عن `www.mirqabtutorial.com`
   - ابحث عن `mirqabtutorial.com`

2. **من Terminal/Command Prompt:**
   ```bash
   nslookup www.mirqabtutorial.com
   nslookup mirqabtutorial.com
   ```

3. **من PowerShell:**
   ```powershell
   Resolve-DnsName www.mirqabtutorial.com
   Resolve-DnsName mirqabtutorial.com
   ```

### الحل 2: إعداد DNS بشكل صحيح (GoDaddy مثال)

#### في GoDaddy:

1. **اذهب إلى**: My Products > DNS > Manage DNS

2. **احذف جميع السجلات** الموجودة للنطاق (خاصة):
   - أي سجلات "Parked" أو "Forwarding"
   - أي سجلات A أو CNAME قديمة

3. **أضف السجلات التالية:**

   **سجل CNAME:**
   - Type: `CNAME`
   - Name: `www`
   - Value: `adelalawneh77-cpu.github.io`
   - TTL: `600 seconds` (أو Default)

   **سجلات A (4 سجلات منفصلة):**
   - Type: `A`
   - Name: `@` (أو اتركه فارغاً)
   - Value: `185.199.108.153`
   - TTL: `600 seconds`

   - Type: `A`
   - Name: `@`
   - Value: `185.199.109.153`
   - TTL: `600 seconds`

   - Type: `A`
   - Name: `@`
   - Value: `185.199.110.153`
   - TTL: `600 seconds`

   - Type: `A`
   - Name: `@`
   - Value: `185.199.111.153`
   - TTL: `600 seconds`

### الحل 3: إعداد DNS في Namecheap

1. **اذهب إلى**: Domain List > Manage > Advanced DNS

2. **احذف جميع السجلات** الموجودة

3. **أضف السجلات:**

   **CNAME Record:**
   - Type: `CNAME Record`
   - Host: `www`
   - Value: `adelalawneh77-cpu.github.io`
   - TTL: `Automatic`

   **A Records (4 records):**
   - Type: `A Record`
   - Host: `@`
   - Value: `185.199.108.153`
   - TTL: `Automatic`

   - Type: `A Record`
   - Host: `@`
   - Value: `185.199.109.153`
   - TTL: `Automatic`

   - Type: `A Record`
   - Host: `@`
   - Value: `185.199.110.153`
   - TTL: `Automatic`

   - Type: `A Record`
   - Host: `@`
   - Value: `185.199.111.153`
   - TTL: `Automatic`

### الحل 4: التحقق من صحة الإعدادات

بعد إضافة السجلات، انتظر 10-15 دقيقة ثم تحقق:

**النتائج المتوقعة:**

1. **لـ www.mirqabtutorial.com:**
   ```
   nslookup www.mirqabtutorial.com
   ```
   يجب أن يظهر: `adelalawneh77-cpu.github.io`

2. **لـ mirqabtutorial.com:**
   ```
   nslookup mirqabtutorial.com
   ```
   يجب أن تظهر عناوين IP الأربعة:
   - 185.199.108.153
   - 185.199.109.153
   - 185.199.110.153
   - 185.199.111.153

### الحل 5: إعادة إعداد GitHub Pages

1. **في GitHub**: Settings > Pages

2. **احذف النطاق المخصص تماماً:**
   - اضغط **Remove** على `www.mirqabtutorial.com`
   - **انتظر 10 دقائق**

3. **تحقق من أن الموقع يعمل بدون نطاق مخصص:**
   - افتح: `https://adelalawneh77-cpu.github.io/`
   - تأكد من أن الموقع يعمل

4. **بعد التأكد من صحة DNS (باستخدام dnschecker.org):**
   - أعد إضافة `www.mirqabtutorial.com`
   - اضغط **Save**
   - **انتظر 10-15 دقيقة**

5. **اضغط "Check again"** للتحقق

### الحل 6: استخدام النطاق بدون www (بديل)

إذا استمرت المشكلة مع www، جرب استخدام النطاق الجذر فقط:

1. **في GitHub Pages:**
   - أضف `mirqabtutorial.com` (بدون www)
   - ستحتاج فقط سجلات A (4 سجلات)

2. **في DNS:**
   - أضف فقط سجلات A الأربعة للنطاق الجذر
   - لا حاجة لسجل CNAME

### الحل 7: التحقق من مشاكل شائعة

❌ **تأكد من عدم وجود:**
- سجلات "Parked Domain"
- سجلات "Forwarding"
- سجلات CNAME للنطاق الجذر (apex domain)
- سجلات A قديمة أو خاطئة
- إعدادات "Domain Forwarding" مفعلة

✅ **تأكد من:**
- جميع عناوين IP الأربعة موجودة
- CNAME يشير إلى `adelalawneh77-cpu.github.io` (بدون https://)
- TTL مناسب (600 أو أقل)
- انتظرت 10-15 دقيقة بعد التغييرات

### الحل 8: استخدام أدوات التحقق

**تحقق من DNS عالمياً:**
1. https://dnschecker.org
   - ابحث عن `www.mirqabtutorial.com` → يجب أن يظهر في جميع الخوادم
   - ابحث عن `mirqabtutorial.com` → يجب أن تظهر عناوين IP في جميع الخوادم

2. https://www.whatsmydns.net
   - ابحث عن `www.mirqabtutorial.com`

3. https://mxtoolbox.com/DNSLookup.aspx
   - ابحث عن `www.mirqabtutorial.com`

### الحل 9: إذا استمرت المشكلة

1. **اتصل بمزود DNS** (GoDaddy, Namecheap, etc.) للتأكد من أن السجلات نشطة

2. **جرب استخدام subdomain مختلف:**
   - استخدم `app.mirqabtutorial.com` بدلاً من `www.mirqabtutorial.com`
   - أضف سجل CNAME: `app` → `adelalawneh77-cpu.github.io`

3. **انتظر 24-48 ساعة** لانتشار DNS بالكامل

4. **راجع الوثائق الرسمية:**
   - https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
   - https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages

## مثال على سجلات DNS الصحيحة

```
Type    Name    Value                           TTL
----    ----    -----                           ---
A       @       185.199.108.153                 600
A       @       185.199.109.153                 600
A       @       185.199.110.153                 600
A       @       185.199.111.153                 600
CNAME   www     adelalawneh77-cpu.github.io      600
```

## ملاحظات مهمة

⚠️ **مهم جداً:**
- لا تستخدم `https://` في قيمة CNAME
- لا تستخدم `www` في سجلات A للنطاق الجذر
- تأكد من حذف جميع السجلات القديمة أولاً
- انتظر 10-15 دقيقة بعد كل تغيير

