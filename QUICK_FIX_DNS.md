# حل سريع لمشكلة DNS - InvalidDNSError

## المشكلة
```
Both www.mirqabtutorial.com and its alternate name are improperly configured
Domain's DNS record could not be retrieved. (InvalidDNSError)
```

## الحل السريع (5 خطوات)

### ✅ الخطوة 1: تحقق من DNS الحالي

**استخدم PowerShell (في Windows):**
```powershell
# تشغيل السكريبت المرفق
.\check-dns.ps1

# أو يدوياً:
Resolve-DnsName www.mirqabtutorial.com
Resolve-DnsName mirqabtutorial.com
```

**أو استخدم الموقع:**
- https://dnschecker.org
- ابحث عن `www.mirqabtutorial.com`
- ابحث عن `mirqabtutorial.com`

### ✅ الخطوة 2: احذف جميع السجلات القديمة

**في لوحة تحكم DNS (GoDaddy/Namecheap):**

1. اذهب إلى إعدادات DNS للنطاق
2. **احذف كل شيء**:
   - جميع سجلات A
   - جميع سجلات CNAME
   - أي سجلات "Parked" أو "Forwarding"
3. **انتظر 10 دقائق**

### ✅ الخطوة 3: أضف السجلات الصحيحة فقط

**أضف هذه السجلات بالضبط (5 سجلات):**

#### سجل CNAME واحد:
```
Type:   CNAME
Name:   www
Value:  adelalawneh77-cpu.github.io
TTL:    600 (أو Default)
```

#### سجلات A (4 سجلات منفصلة):
```
Type:   A
Name:   @
Value:  185.199.108.153
TTL:    600

Type:   A
Name:   @
Value:  185.199.109.153
TTL:    600

Type:   A
Name:   @
Value:  185.199.110.153
TTL:    600

Type:   A
Name:   @
Value:  185.199.111.153
TTL:    600
```

**⚠️ مهم جداً:**
- لا تضيف أي سجلات أخرى
- لا تضيف سجلات "Parked" أو "Forwarding"
- تأكد من أن Value في CNAME هو `adelalawneh77-cpu.github.io` بدون `https://`

### ✅ الخطوة 4: انتظر و تحقق

1. **انتظر 15 دقيقة** بعد إضافة السجلات
2. **تحقق من DNS**:
   ```powershell
   Resolve-DnsName www.mirqabtutorial.com
   # يجب أن يظهر: adelalawneh77-cpu.github.io
   
   Resolve-DnsName mirqabtutorial.com
   # يجب أن تظهر 4 عناوين IP
   ```
3. **استخدم https://dnschecker.org** للتحقق عالمياً

### ✅ الخطوة 5: أعد إعداد GitHub Pages

1. **في GitHub**: Settings > Pages
2. **احذف النطاق**:
   - اضغط **Remove** على `www.mirqabtutorial.com`
   - **انتظر 10 دقائق**
3. **تحقق من أن الموقع يعمل بدون نطاق**:
   - افتح: `https://adelalawneh77-cpu.github.io/`
   - يجب أن يعمل الموقع
4. **بعد التأكد من صحة DNS** (من الخطوة 4):
   - أضف `www.mirqabtutorial.com` مرة أخرى
   - اضغط **Save**
   - **انتظر 15 دقيقة**
5. **اضغط "Check again"**
6. **إذا نجح التحقق** (✓ خضراء)، فعّل **Enforce HTTPS**

## إذا استمرت المشكلة

### الحل البديل: استخدم النطاق بدون www

1. **في DNS**: أضف فقط سجلات A الأربعة (لا حاجة لـ CNAME)
2. **في GitHub Pages**: استخدم `mirqabtutorial.com` (بدون www)

### تحقق من الأخطاء الشائعة

❌ **تأكد من عدم وجود:**
- سجلات "Parked Domain" مفعلة
- Domain Forwarding مفعل
- سجلات CNAME للنطاق الجذر (@)
- سجلات A قديمة أو خاطئة
- إملاء خاطئ: `mirqabtoturial` بدلاً من `mirqabtutorial`

✅ **تأكد من:**
- جميع عناوين IP الأربعة موجودة
- CNAME يشير إلى `adelalawneh77-cpu.github.io` (بدون https://)
- انتظرت 15 دقيقة على الأقل بعد التغييرات
- حذفت جميع السجلات القديمة أولاً

## مثال على إعداد DNS الصحيح (GoDaddy)

```
┌──────────┬──────┬─────────────────────────────────┬──────┐
│ Type     │ Name │ Value                           │ TTL  │
├──────────┼──────┼─────────────────────────────────┼──────┤
│ A        │ @    │ 185.199.108.153                 │ 600  │
│ A        │ @    │ 185.199.109.153                 │ 600  │
│ A        │ @    │ 185.199.110.153                 │ 600  │
│ A        │ @    │ 185.199.111.153                 │ 600  │
│ CNAME    │ www  │ adelalawneh77-cpu.github.io     │ 600  │
└──────────┴──────┴─────────────────────────────────┴──────┘
```

**لا شيء آخر! فقط هذه السجلات الخمس.**

## أدوات مفيدة

- **DNS Checker**: https://dnschecker.org
- **MXToolbox**: https://mxtoolbox.com/DNSLookup.aspx
- **What's My DNS**: https://www.whatsmydns.net

## وقت الانتظار

- **بعد حذف السجلات**: 10 دقائق
- **بعد إضافة السجلات**: 15 دقيقة
- **بعد إعادة إضافة النطاق في GitHub**: 15 دقيقة
- **DNS Propagation كامل**: قد يصل إلى 48 ساعة

**الصبر مهم! DNS يحتاج وقت للانتشار.**

