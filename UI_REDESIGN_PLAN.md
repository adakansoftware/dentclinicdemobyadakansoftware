# UI Redesign Plan

## Hedef

Siteyi “premium dental clinic system demo” gibi konusmaktan cikarip, gercekten satilabilir bir premium klinik web urunu gibi hissettirmek.

Ana prensipler:
- metayi azalt
- klinik degerine dogrudan konus
- az ama guclu section kullan
- glass/blur efektini azalt
- daha sakin, daha olgun ve daha gercek bir premium ton kur
- reusable demo yapisini koru

## Global Strateji

1. "Demo / system / storefront / manageable / public surface" dilini tum public yuzeyden temizle.
2. Homepage’i “sistemi anlatan sayfa” olmaktan cikarip “guven veren premium klinik sitesi” olarak yeniden konumla.
3. Ic sayfalarda PageHero tek-tip sahne olmaktan cikmali; sayfa amacina gore daha sakin veya daha guclu varyantlar olmali.
4. Gorsel sistem blur ve gradient ile degil; spacing, composition, typography ve restraint ile premium hissettirmeli.
5. Her sayfa kullanicinin ihtiyacina konusmali:
   - ana sayfa: guven + fark + aksiyon
   - hizmetler: tedavi secimi
   - uzmanlar: profesyonel guven
   - yorumlar: sosyal proof
   - iletisim: kolay ulasilabilirlik
   - randevu: sakin ve net rezervasyon deneyimi

## File-by-File Plan

### `src/components/public/HomeClient.tsx`

#### Copy cleanup
- Silinecek / degistirilecek dil:
  - premium dental clinic system demo
  - public storefront
  - manageable system
  - content-manageable system
  - public surface
  - what it changes
  - final action block
  - “demo feel like a product” benzeri tum metalar
- Yeni ton:
  - daha gercek klinik degeri
  - daha sakin ve guven veren
  - hasta deneyimi, tedavi netligi, uzman guveni, konfor, randevu kolayligi

#### Layout restructuring
- Hero sade ama daha guclu olmali:
  - daha az overlay card
  - tek guclu copy kolonu
  - daha net 2 CTA
  - yan tarafta tek bir guclu editorial media/surface
- Trust strip yeniden yazilmali:
  - soyut product faydasi degil
  - “uzman hekimler / net tedavi anlatimi / online randevu / hasta odakli deneyim” gibi
- “Neyi degistiriyor” bolumu kaldirilmali ya da tamamen hasta/klinik degerine donmeli
- Section sayisi azaltılmali:
  - hero
  - guven / fark
  - featured services
  - uzman guveni
  - yorumlar / proof
  - son CTA

#### Stronger visual hierarchy
- Section title’lar daha az ama daha net
- Featured service bolumunde bir ana tedavi ve 2-3 destek tedavi yeterli
- Dark panel sayisi azaltılmali

### `src/components/public/PublicNavbar.tsx`

#### Copy cleanup
- Tamamen kaldirilacak:
  - Premium dental clinic system demo
  - Dental system demo

#### Layout restructuring
- Ust bant sadeleşmeli:
  - sadece telefon + adres
  - ya da tamamen kaldirilmali
- Brand satiri daha gercek klinik sitesi gibi olmali:
  - clinic name ana odak
  - alt etikette demo ifadesi olmamali
- CTA butonu biraz daha sofistike ama daha sakin olmali

#### Demo energy reduction
- Gereksiz kendini-aciklayan brand labels temizlenecek
- nav bar “showcase shell” degil “site navigation” gibi hissettirecek

### `src/components/public/PublicFooter.tsx`

#### Copy cleanup
- Silinecek:
  - public deneyimi
  - public ton
  - aksiyon yapisi
  - premium dis klinigi demosu

#### Layout restructuring
- Footer CTA daha sakin ve kurumsal olacak
- Ana footer 3 mantikla kurulacak:
  - marka / kisa tanim
  - navigasyon
  - iletisim / sosyal
- Ek kutular azaltılacak

#### Stronger hierarchy
- Footer kapanisi daha temiz
- Bilgi hiyerarsisi urun sunumu gibi degil kurumsal kapanis gibi olacak

### `src/components/shared/PageHero.tsx`

#### Layout restructuring
- Tek-tip hero sistemini varyantli hale getir:
  - `default`
  - `compact`
  - `minimal`
- Her public sayfaya ayni “büyük dramatic hero + panel” zorunlu verilmesin

#### Visual hierarchy
- Ic sayfa hero’lar ana sayfadan daha sakin olmali
- Grid/orb/efekt yogunlugu azaltılmali

### `src/components/public/AboutClient.tsx`

#### Copy cleanup
- Once encoding tamamen temizlenecek
- Daha kurumsal klinik dili kurulacak
- “neden biz” copy’si agency / brochure dili yerine hasta guveni ve yaklasim diliyle yazilacak

#### Layout restructuring
- 2 section yeterli:
  - clinic philosophy / about
  - care principles
- Icon grid daha sakin hale getirilecek

#### Visual hierarchy
- Fazla kartlasma azaltılacak
- Daha editorial ve kurumsal bir about page hissi verilecek

### `src/components/public/ServicesClient.tsx`

#### Copy cleanup
- Silinecek / donusturulecek:
  - selection experience
  - layout logic
  - decision surfaces
  - decision language
- Hizmet dili daha hasta ve karar odakli olacak

#### Layout restructuring
- Featured service mantigi korunabilir ama copy resetlenmeli
- Support cards daha az “UI concept card” gibi görünmeli
- Alt archive bolumu daha sakin ve taranabilir olmali

#### Stronger hierarchy
- Hizmet ismi ve faydasi daha one cikacak
- Teknik layout yorumu yapan dark panel daha az meta hale getirilecek

### `src/components/public/SpecialistsClient.tsx`

#### Copy cleanup
- Silinecek:
  - trust logic
  - trust layer
  - professional trust surface benzeri copy

#### Layout restructuring
- Featured specialist mantigi korunabilir
- Ama sayfa services ile ayni kurguda hissettirmemeli
- Team page daha insani, daha profesyonel ve daha az “showcase architecture” hissi vermeli

#### Stronger hierarchy
- Uzman ismi, unvan, uzmanlik ve kisa biyografi daha insani bir oncelik sirasi ile verilmeli

### `src/components/public/ReviewsClient.tsx`

#### Copy cleanup
- Encoding temizligi zorunlu
- “approval process” anlatimi daha zarif hale getirilmeli
- hasta yorumlarinin tonu daha sakin editorial proof hissi vermeli

#### Layout restructuring
- Reviews grid daha premium social proof section’ina donmeli
- Form alani yorum kartlarindan daha net ayrismali

#### Visual hierarchy
- Yildiz gorseli ve quotation karakterleri temizlenecek
- Daha sakin card spacing ve daha iyi empty state kurulacak

### `src/components/public/ContactClient.tsx`

#### Copy cleanup
- Encoding temizligi zorunlu
- Emoji bozuntulari kaldirilacak
- Form copy’si daha premium klinik iletisim tonu tasiyacak

#### Layout restructuring
- Sol taraf form
- sag taraf iletisim + saatler + harita
- ama daha az card yiginli ve daha temiz vertical rhythm ile

#### Visual hierarchy
- Iletisim satirlari daha sakin iconografi ile yenilenmeli
- WhatsApp CTA tonu daha kontrollu olmali

### `src/components/public/AppointmentClient.tsx`

#### Copy cleanup
- Encoding temizligi zorunlu
- “step selection” copy’si daha olgun ve klinik uyumlu hale getirilmeli

#### Layout restructuring
- Stepper mantigi korunacak
- Kart secimleri daha fazla “booking UI” gibi, daha az “demo component gallery” gibi olacak
- Summary panel daha sakin ve daha premium hale gelecek

#### Visual hierarchy
- ikona dayali cocuksu fallbackler temizlenecek
- success state daha sofistike hale gelecek

### `src/app/globals.css`

#### Simplify / refine / remove

##### Kademeli azaltılacaklar
- `.hero-orb`
- `.premium-grid`
- `.glass-card`
- `.dark-glass-card`
- `.hero-showcase__floating`
- `.footer-cta-band::before`
- `.footer-cta-band::after`
- `.nav-shell` blur yogunlugu
- `.premium-surface` blur yogunlugu

##### Sadeleştirilecekler
- `.section-kicker`
- `.eyebrow-light`
- `.eyebrow-dark`
- `.btn-outline`
- `.btn-ghost`
- `.card`
- `.surface-panel`
- `.feature-tile`
- `.summary-row`

##### Korunup rafine edilecekler
- renk sistemi
- radius sistemi ama daha az cesitle
- button hierarchy
- white surface + dark accent mantigi

#### New visual direction
- Daha az blur
- Daha az gradient
- Daha az glow
- Daha kontrollu shadow
- Daha fazla whitespace ve composition
- Daha calm luxury, daha az “effect-driven premium”

## Copy Cleanup Map

Asagidaki kavramlar public yuzeyden temizlenecek:
- demo
- system demo
- storefront
- manageable
- public surface
- public tone
- action structure
- what it changes
- layout logic
- trust logic
- conversion focus
- decision surfaces

Yerine kullanilacak ana ton:
- guven
- uzmanlik
- netlik
- sakin deneyim
- hasta konforu
- modern klinik yaklasimi
- online randevu kolayligi
- erisilebilirlik

## Navbar / Footer / Homepage / Inner Pages Icin Demo Energy Azaltma Plani

### Navbar
- demo etiketlerini tamamen kaldir
- daha sade bir ust bilgi satiri kullan
- brand alanini klinik sitesi gibi kur

### Footer
- urun dili yerine kurumsal kapanis dili kullan
- CTA’yi tek bir sakin karar alani olarak birak
- bilgi kutularini azalt

### Homepage
- meta section isimlerini temizle
- 6-7 guclu section’dan fazla kullanma
- hero’dan sonra direkt “neden bu klinik deneyimi guven verir?” sorusuna cevap ver

### Inner Pages
- her sayfa ayni sayfa iskeletine sahip olmasin
- services ve specialists birbirinin varyanti gibi durmasin
- about, reviews, contact, appointment daha sakin ve daha gercek is sayfasi gibi olsun

## Reusable General Demo Olarak Kalirken Gercek Premium Urun Hissi Nasil Kurulur

1. Tek bir klinige ait renk/brand kullanmadan:
   - sakin notr beyazlar
   - koyu yesil/mavi tonlu guven hissi
   - bronz aksan sadece vurgu icin
2. Copy’yi “this system / demo / product presentation” yerine:
   - “care”
   - “specialist team”
   - “modern treatment approach”
   - “online appointment”
   - “clear communication”
   cizgisine cek
3. Hero’da generic ama premium bir klinik vaadi ver:
   - uzmanlik
   - konfor
   - netlik
   - randevu kolayligi
4. Ic sayfalarda reusable ama daha gercek site mantigi kullan:
   - hizmetler = tedavi secimi
   - uzmanlar = ekibimiz
   - yorumlar = hasta deneyimleri
   - iletisim = bize ulasin
   - randevu = online randevu

## Uygulama Sirasi

1. Encoding temizligi
   - `AboutClient.tsx`
   - `ReviewsClient.tsx`
   - `ContactClient.tsx`
   - `AppointmentClient.tsx`
   - `HomeClient.tsx` icindeki kalan bozuklar
2. Copy cleanup
   - `HomeClient.tsx`
   - `PublicNavbar.tsx`
   - `PublicFooter.tsx`
   - `ServicesClient.tsx`
   - `SpecialistsClient.tsx`
3. Shared visual simplification
   - `globals.css`
   - `PageHero.tsx`
4. Homepage restructuring
5. Inner page restructuring
6. Final mobile rhythm pass

## Net Sonuc Hedefi

Redesign sonrasi site:
- “demo” kelimesini ve hissini tasimayacak
- tasarim mantigini kullaniciya anlatmayacak
- daha sakin, daha guven veren ve daha olgun gorunecek
- gercekten klinige satilabilir bir premium urun gibi hissedecek
- ama yine de tek bir klinige ait olmayacak
