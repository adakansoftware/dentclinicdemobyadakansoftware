# UI Audit

## Public-Facing Perceptioni En Fazla Kontrol Eden Dosyalar

1. `src/components/public/HomeClient.tsx`
   - Sitenin ilk izlenimini, ana storytelling akisini, trust yapisini ve CTA tonunu belirliyor.
   - Demo enerjisinin en buyuk kaynagi da burada.
2. `src/app/globals.css`
   - Premium algiyi tasiyan ya da bozan ortak surface, button, card, hero ve spacing sistemi burada.
   - Fazla blur, glow, gradient, shadow ve capsule kullanimi buradan geliyor.
3. `src/components/public/PublicNavbar.tsx`
   - Daha sayfa acilmadan “demo” hissini sizdiran ust katman.
   - “system demo” dili ve fazla showcase tavri burada hissediliyor.
4. `src/components/public/PublicFooter.tsx`
   - Sitenin kapanis tonunu belirliyor.
   - Su an urun anlatisi gibi kapanip gercek klinik sitesi gibi kapanmiyor.
5. `src/components/shared/PageHero.tsx`
   - Tum ic sayfalarda ayni meta tone ve benzer hero dili tekrarlandigi icin demo hissini carpiyor.

Ikinci seviye etkili dosyalar:
- `src/components/public/ServicesClient.tsx`
- `src/components/public/SpecialistsClient.tsx`
- `src/components/public/AboutClient.tsx`
- `src/components/public/ReviewsClient.tsx`
- `src/components/public/ContactClient.tsx`
- `src/components/public/AppointmentClient.tsx`

## Tam Olarak Neler UI'yi Demo Gibi Hissettiriyor

### 1. Copy dili gercek klinik sitesi dili degil, urun/demonstrasyon dili

En buyuk problem bu. Sitenin dili yer yer kullaniciya ya da hastaya konusmuyor; tasarim mantigini anlatiyor.

Ornek meta / demo dili:
- `HomeClient.tsx`
  - "premium, guven veren ve yonetilebilir bir dijital deneyim"
  - "public vitrin"
  - "Content-manageable system"
  - "Manageable system"
  - "Public storefront"
  - "The public side is not only aesthetic; it behaves like a product..."
  - "This structure moves the experience away from a sample demo and toward a real product feel"
  - "That is what makes the demo feel like a product"
- `PublicNavbar.tsx`
  - "Premium dental clinic system demo"
  - "Dental system demo"
- `PublicFooter.tsx`
  - "Premium dis klinigi demosu"
  - "Public ton"
  - "Aksiyon yapisi"
  - "Public deneyimi tamamlayan..."
- `ServicesClient.tsx`
  - "premium bir secim deneyimine donusur"
  - "Treatments should feel like premium decision surfaces"
  - "Layout logic"
- `SpecialistsClient.tsx`
  - "daha premium bir profil hiyerarsisi"
  - "trust layer"
  - "The specialist page is one of the most important trust surfaces..."

Bu tarz copy siteyi premium gostermiyor; aksine, arkadaki tasarim dusuncesini kullaniciya anlatiyor. Bu da “demo/product presentation” hissi veriyor.

### 2. Homepage section’lari halen tasarim mantigini anlatiyor, klinik degerini degil

`HomeClient.tsx` icinde section isimleri ve icerik mantigi fazla iceriden konusuyor:
- “Neyi degistiriyor”
- “What it changes”
- “Decision flow”
- “Proof and reassurance”
- “Modern care layer”
- “Final action block”

Bunlar ya case-study dili ya da internal design commentary dili. Gercek premium klinik siteleri boyle konusmaz; hasta guveni, tedavi netligi, konfor, uzmanlik, deneyim, ulasilabilirlik gibi konulara dogrudan konusur.

### 3. Gorsel sistem cok fazla premium numarasi gosteriyor

`globals.css` icinde premium algi, sakin kompozisyon yerine su araclarla zorlanmis:
- fazla blur
- fazla glass card
- cok sayida gradient katmani
- hero orb'lar
- proof band blur'lari
- footer CTA glow/blur katmanlari
- birden fazla benzer border-radius/shadow dili

Sonuc:
- Tasarim “premium olmasi gerektigini bilen demo” gibi hissettiriyor.
- Sakin luks yerine “premium gorunmeye calisan sistem” hissi veriyor.

### 4. Navbar ve footer hâlâ dogrudan demo enerjisi sizdiriyor

`PublicNavbar.tsx`
- ust bantta direkt “Premium dental clinic system demo” yaziyor
- logo altinda “Dental system demo” var
- bu, daha siteye girmeden demoyu ilan ediyor
- klinik sitesi yerine showcase shell hissi olusuyor

`PublicFooter.tsx`
- footer CTA dili hâlâ “public experience / action structure / public tone” gibi ic mekanik dili kullaniyor
- bu, footer’i premium kapanis yerine urun sunum paneline ceviriyor

### 5. Ic sayfa hero’lari tek tip ve fazla “componentized demo” gorunuyor

`PageHero.tsx`
- tum ic sayfalara ayni premium-kicker + buyuk baslik + metric panel formulu uygulaniyor
- bu tekrar hissi “gercek site” yerine “temalandirilmis component sistemi” hissi veriyor
- hero arka planindaki grid, orb, gradient sistemi homepage ile beraber bakildiginda fazla stilize duruyor

### 6. Bazi sayfalarda encoding bozukluklari premium algiyi direk dusuruyor

En ciddi kalite problemi:
- `AboutClient.tsx`
- `ReviewsClient.tsx`
- `ContactClient.tsx`
- `AppointmentClient.tsx`

Gorunen bozuk karakterler:
- `Ä`, `Å`, `Ã`, `âœ`, `ğŸ`, `â†`, `â€œ`

Bu tek basina bile demo/yarim kalmis proje hissi verir.

## Hangi Parcalar Fazla Meta

### HomeClient.tsx
- “public vitrin”
- “yonetilebilir vitrin”
- “public surface”
- “manageable system”
- “conversion focus”
- “What it changes”
- “This structure...”
- “demo feel like a product”

### PublicNavbar.tsx
- “system demo”
- “dental demo”

### PublicFooter.tsx
- “public ton”
- “aksiyon yapisi”
- “public deneyimi”

### ServicesClient.tsx
- “selection experience”
- “layout logic”
- “decision surfaces”

### SpecialistsClient.tsx
- “trust logic”
- “trust layer”
- “professional trust surface”

Bu ifadeler kullanicinin ya da hastanin ihtiyacina degil, tasarimciya veya saticiya konusuyor.

## Icerik Olarak Internal Design Commentary Gibi Duran Bloklar

### HomeClient.tsx
- promises bolumu
- processSteps bolumu
- “Neyi degistiriyor” bolumu
- final CTA metinleri

Bu bolumler klinigin degeri yerine “site bunu nasil yapiyor” diye aciklama yapiyor.

### ServicesClient.tsx
- sagdaki koyu paneldeki “layout logic” anlatimi
- featured treatment altindaki “decision language / action” kutulari

### SpecialistsClient.tsx
- featured specialist sag panel
- “Guven mantigi” dark panel
- support cards altindaki genel meta anlatim

### Footer
- footer icindeki “public tone / action structure” kutulari

## Template-Like Hisseden Alanlar

### HomeClient.tsx
- trust strip 4 kolon bant
- promises 3 kart bandi
- process steps dark panel + numbered rows
- review cards ortadakinin translate ile yukselmesi
- final CTA two-column conversion band

Tek tek kotu degiller ama bir araya gelince “premium section kit” hissi veriyor.

### ServicesClient.tsx
- featured buyuk kart + yan bilgi paneli + destek kartlari formul halinde
- fazla “showcase component” hissi var

### SpecialistsClient.tsx
- services ile neredeyse ayni sayfa dramaturjisi
- bu da templatelesmis hissi arttiriyor

### PageHero.tsx
- tum ic sayfalarda ayni hero pattern

## Fazla Gorsel Olarak Busy Hisseden Alanlar

### globals.css kaynakli
- `.hero-orb`
- `.premium-grid`
- `.hero-showcase__floating`
- `.glass-card`
- `.dark-glass-card`
- `.footer-cta-band::before`
- `.footer-cta-band::after`
- `.nav-shell` blur katmani

### HomeClient.tsx
- hero’da ayni anda:
  - radial gradient
  - linear gradient
  - grid overlay
  - 2 orb
  - glass frame
  - dark glass card
  - glass card
  - 2 floating card
  - proof strip

Bu kadar katman ilk ekrani pahali degil, kontrollu olmayan “designed” hissettiriyor.

### Footer
- koyu CTA + alt footer + ek bilgi kutulari birlikte fazla yuklenmis

## Korunmasi Gereken Alanlar

### Mimari / islevsel olarak
- genel component ayrimi dogru
- `PageHero` mantigi shared olarak faydali
- `AppointmentClient.tsx` adimli akis yapisi degerli
- `ContactClient.tsx` form + saatler + harita mantigi faydali
- `ServicesClient.tsx` ve `SpecialistsClient.tsx` featured + archive ayrimi mantik olarak kullanisli

### Gorsel sistemde korunabilecek cekirdek
- mevcut renk ailesi genel olarak sakin ve premium potansiyele sahip
- radius sistemi daha az cesit ile sadeleştirilirse iyi bir temel
- buton tonalitesi dogru yonde
- beyaz yuzey + koyu vurgu mantigi korunabilir

## Sadeleştirilmesi Gereken Alanlar

1. Navbar
   - demo/system ibareleri tamamen cikarilmali
   - ust bar ya sade temas bilgisine donmeli ya da kaldirilmali
2. Footer
   - meta kutular cikarilmali
   - daha sakin, daha kurumsal bilgi ve CTA kapanisina donmeli
3. PageHero
   - her sayfada ayni dramatik hero dili kullanilmamali
   - bazi sayfalarda daha sakin hero varyanti olmali
4. Homepage
   - meta aciklama section’lari azaltılmali
   - daha az ama daha guclu section kullanilmali
5. Globals
   - blur / glass / orb / grid / radial efekti ciddi sekilde azaltılmali

## Yeniden Insaa Edilmesi Gereken Alanlar

### 1. HomeClient.tsx
Tam rebuild gerektiren alanlar:
- hero copy
- hero information hierarchy
- trust strip copy
- promises bolumu
- featured services metin tonu
- dark editorial panels
- final CTA dili

### 2. PublicNavbar.tsx
- ust bant mantigi
- brand label dili
- nav kapsulunun tonu

### 3. PublicFooter.tsx
- CTA blok dili
- footer bilgi hiyerarsisi
- demo sizdiran kutular

### 4. PageHero.tsx
- tek-tip hero kalibi
- her sayfaya ayni showcase tonu verilmesi

### 5. AboutClient.tsx / ReviewsClient.tsx / ContactClient.tsx / AppointmentClient.tsx
- once encoding temizligi zorunlu
- sonra daha sakin premium copy ve daha az “component demo” hissi

## Dosya Bazli Kisa Hukum

### `src/components/public/HomeClient.tsx`
- En buyuk algi problemi burada.
- Copy fazla meta.
- Section sayisi ve dili fazla “showing the system”.
- Korunacak: featured structure mantigi.
- Rebuild: hero dili, trust yapisi, CTA kapanisi.

### `src/components/public/PublicNavbar.tsx`
- Demo enerjisi sizdiriyor.
- Rebuild gerekli.

### `src/components/public/PublicFooter.tsx`
- Footer su an urun sunumu gibi konusuyor.
- Sadeleştirme ve copy reset gerekli.

### `src/components/shared/PageHero.tsx`
- Fazla tek tip.
- Varyant sistemi gerek.

### `src/components/public/AboutClient.tsx`
- Encoding bozuk.
- Copy ve icon dili dated.
- “About” sayfasi daha kurumsal ve daha sakin olmali.

### `src/components/public/ServicesClient.tsx`
- Layout kuvvetli ama meta.
- Daha gercek klinik diliyle yeniden yazilmali.

### `src/components/public/SpecialistsClient.tsx`
- Services’in kardesi gibi duruyor.
- Ayrı bir kimlik ve daha insani trust dili gerek.

### `src/components/public/ReviewsClient.tsx`
- Encoding bozuk.
- Form iyi ama gorsel ton basic.
- Sosyal proof daha editorial ele alinabilir.

### `src/components/public/ContactClient.tsx`
- Encoding bozuk.
- Emoji / icon karakterleri bozuk.
- Klinik iletisim sayfasi gibi degil, component demo gibi.

### `src/components/public/AppointmentClient.tsx`
- Encoding bozuk.
- Step UI mantikli ama kart ve icon dili biraz product demo enerjisi tasiyor.
- Daha olgun bir premium booking experience diline ihtiyac var.

### `src/app/globals.css`
- Asiri efekt katmani var.
- Premium gorunumu zorlayan cok fazla utility mevcut.
- Sadeleşme olmadan site gercek luks sakinligine gecemez.
