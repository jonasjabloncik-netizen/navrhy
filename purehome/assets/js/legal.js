/* PURE HOME Ostrava · právní texty (Ivana, podklady z 23. 11. 2026)
   Texty jsou převzaté beze změny. Odkazy se píšou jako [text](adresa).
   Údaje poskytovatelky (jméno, IČO, sídlo, kontakty) se berou z data.js (contact).

   K DOPLNĚNÍ (na webu jsou vidět jako „doplní se“ nebo „návrh k potvrzení“):
   - terms.validFrom: datum účinnosti, až bude jasné spuštění
   - privacy: konkrétní poskytovatelé a věta o cookies (návrh podle toho, jak web funguje teď)
*/
window.PH_LEGAL = {
  /* Obchodní podmínky + poučení + vzorový formulář jsou na jedné stránce (podminky.html) */
  terms: {
    title: 'Obchodní podmínky úklidových služeb',
    validFrom: null,
    sections: [
      { id: 'sluzby', title: 'Služby a objednávky', items: [
        'Poskytuji běžný, pravidelný a generální úklid domácností a individuálně sjednané doplňkové služby. Konkrétní rozsah, termín a cenu domlouvám se zákazníkem předem.',
        'Odeslání poptávky přes web, telefon nebo e-mail není závaznou objednávkou. Smlouva vzniká až vzájemným odsouhlasením konkrétní nabídky. Při objednávání na dálku postupujeme podle zákonných pravidel pro uzavření smlouvy.'
      ] },
      { id: 'ceny', title: 'Ceny a platby', items: [
        'Základní hodinové sazby:',
        '@prices',
        'Při vyšším znečištění může být sjednána vyšší hodinová sazba, vždy předem. Doplňkové služby jsou oceňovány samostatně.',
        'Před objednáním sdělím hodinovou sazbu, předpokládanou délku práce a způsob výpočtu konečné ceny. Pokud sjednáme maximální cenu, nepřekročím ji bez souhlasu zákazníka. Vícepráce provádím pouze po odsouhlasení rozsahu a ceny.',
        'Platba probíhá po dokončení úklidu hotově nebo převodem na účet prostřednictvím QR kódu, není-li dohodnuto jinak. Na žádost vystavím doklad o poskytnutí a zaplacení služby.'
      ] },
      { id: 'zruseni', title: 'Zrušení termínu a přístup do domácnosti', items: [
        'Termín lze bezplatně zrušit nebo změnit více než 24 hodin před plánovaným začátkem úklidu.',
        'Při pozdějším zrušení nebo nezajištění přístupu do domácnosti se můžeme dohodnout na náhradním termínu. Pokud vzniknou prokazatelné a účelně vynaložené náklady nebo škoda, mohu požadovat jejich přiměřenou náhradu podle zákona. Neúčtuji automaticky celou cenu neprovedeného úklidu.',
        'Tato pravidla neomezují zákonné právo spotřebitele odstoupit od smlouvy.'
      ] },
      { id: 'soucinnost', title: 'Součinnost zákazníka', items: [
        'Zákazník zajistí přístup do domácnosti, přívod vody a elektřiny, bezpečné pracovní podmínky a upozorní na citlivé povrchy, poškozené vybavení a věci vyžadující zvláštní péči.',
        'Používám vlastní čisticí prostředky. Pokud hrozí poškození povrchu nebo není možné práci bezpečně provést, domluvíme se na jiném postupu nebo danou část úklidu neprovedu.',
        'Klíče přebírám pouze po dohodě a s potvrzením o předání.'
      ] },
      { id: 'reklamace', title: 'Reklamace', items: [
        'Pokud zákazník zjistí nedostatek úklidu, může mě kontaktovat telefonicky, e-mailem nebo písemně na adrese sídla. Doporučuji oznámit nedostatek co nejdříve, aby jej bylo možné ověřit a napravit.',
        'Oprávněnou reklamaci vyřeším podle zákona, zejména nápravou nedostatku nebo přiměřenou slevou, podle konkrétní situace. Reklamace bude vyřízena a zákazník informován nejpozději do 30 dnů, pokud se nedohodneme na delší lhůtě.'
      ] },
      { id: 'skody', title: 'Poškození věcí', items: [
        'Za škodu způsobenou při úklidu odpovídám podle zákona. Pokud zjistím poškození, oznámím je zákazníkovi a společně zaznamenáme okolnosti.',
        'Za poškození, které existovalo již před úklidem nebo vzniklo běžným opotřebením, neodpovídám, pokud jsem je nezpůsobila ani nezhoršila. Každý případ posuzujeme individuálně.'
      ] },
      { id: 'prava', title: 'Práva spotřebitele a řešení sporů', items: [
        'Informace o odstoupení od smlouvy uzavřené na dálku a vzorový formulář pro odstoupení jsou uvedeny v [samostatném poučení](#odstoupeni) poskytovaném před uzavřením smlouvy.',
        'Případné spory se snažíme nejprve vyřešit dohodou. Spotřebitel se může obrátit na Českou obchodní inspekci, která zajišťuje mimosoudní řešení spotřebitelských sporů: [https://coi.gov.cz/informace-o-adr/](https://coi.gov.cz/informace-o-adr/).',
        'Tyto podmínky neomezují zákonná práva spotřebitele.'
      ] }
    ]
  },

  withdrawal: {
    title: 'Poučení o právu na odstoupení od smlouvy',
    blocks: [
      'Pokud jste jako spotřebitel uzavřeli smlouvu o úklidových službách na dálku (například e-mailem nebo telefonicky), máte zpravidla právo odstoupit od smlouvy bez udání důvodu do 14 dnů od jejího uzavření.',
      'Odstoupení můžete zaslat na uvedený e-mail nebo adresu sídla. Můžete použít [přiložený formulář](#formular), není to však povinné. Stačí jednoznačně sdělit, že od smlouvy odstupujete. Pro dodržení lhůty stačí odstoupení odeslat před jejím uplynutím.',
      { h: 'Úklid před uplynutím 14 dnů' },
      'Pokud si přejete provést úklid během této lhůty, je potřeba, abyste předem výslovně požádali o zahájení služby.',
      'Pokud na základě Vaší výslovné žádosti úklid začne a Vy následně platně odstoupíte od smlouvy před jeho dokončením, uhradíte poměrnou část ceny odpovídající již poskytnuté službě.',
      'Pokud byla služba na základě Vašeho předchozího výslovného souhlasu v plném rozsahu poskytnuta a byli jste před uzavřením smlouvy poučeni o zániku práva na odstoupení, toto právo zaniká.',
      'Pokud zákonné podmínky pro požadování poměrné úhrady nebyly splněny, úhradu za takto poskytnutou službu požadovat nelze.',
      { h: 'Vrácení peněz' },
      'Pokud jste již zaplatili a platně odstoupíte od smlouvy, vrátím Vám příslušnou částku nejpozději do 14 dnů od doručení odstoupení, zpravidla stejným způsobem, jakým byla platba provedena, pokud se nedohodneme jinak. Za vrácení peněz neúčtuji poplatek.',
      'Zákonné odstoupení není spojeno se storno poplatkem.',
      'Toto poučení se vztahuje na smlouvy uzavřené na dálku. U smluv uzavřených mimo obchodní prostory mohou platit další zvláštní pravidla.'
    ]
  },

  form: {
    title: 'Vzorový formulář pro odstoupení od smlouvy',
    statement: 'Oznamuji, že tímto odstupuji od smlouvy o poskytnutí úklidových služeb.',
    fields: ['Datum objednávky', 'Sjednaný termín úklidu', 'Jméno a příjmení zákazníka', 'Adresa zákazníka', 'Datum odstoupení', 'Podpis zákazníka']
  },

  /* Samostatná stránka osobni-udaje.html */
  privacy: {
    title: 'Informace o zpracování osobních údajů',
    sections: [
      { id: 'udaje', title: 'Jaké údaje zpracovávám a proč', items: [
        'Pro vyřízení poptávek, sjednání a poskytování úklidových služeb zpracovávám podle potřeby jméno, telefon, e-mail, adresu úklidu, obsah komunikace a informace o objednávce.',
        'Pro platby, vedení evidence a plnění zákonných povinností zpracovávám také údaje o provedených službách a platbách.',
        'Právním základem je jednání o uzavření smlouvy a její plnění, splnění zákonných povinností a v odůvodněných případech oprávněný zájem na ochraně práv a řešení případných sporů.'
      ] },
      { id: 'doba', title: 'Jak dlouho údaje uchovávám', items: [
        'Neuskutečněné poptávky zpravidla mažu do 6 měsíců od poslední komunikace, pokud není důvod k delšímu uchování.',
        'Údaje o uskutečněných zakázkách uchovávám po dobu potřebnou k plnění smlouvy a ochraně práv. Účetní a daňové doklady uchovávám po dobu stanovenou právními předpisy.'
      ] },
      { id: 'pristup', title: 'Kdo může mít k údajům přístup', items: [
        'Údaje mohou být v nezbytném rozsahu zpracovávány poskytovateli e-mailu, webhostingu, formuláře a dalších používaných technických služeb, případně účetnímu nebo odbornému poradci.',
        { label: 'Konkrétní poskytovatelé:', draft: 'Google (e-mailová schránka Gmail a Kalendář Google, kam se zapisují rezervace z webu), WhatsApp (Meta), pokud mi napíšete přes WhatsApp, a hosting webu.', tag: 'návrh k potvrzení' }
      ] },
      { id: 'prava', title: 'Vaše práva', items: [
        'Máte právo požádat o přístup ke svým údajům, jejich opravu, výmaz, omezení zpracování, případně přenositelnost údajů nebo vznést námitku, pokud to odpovídá zákonným podmínkám.',
        'Se žádostí se můžete obrátit na uvedený kontakt. Máte také právo podat stížnost u Úřadu pro ochranu osobních údajů: [https://uoou.gov.cz](https://uoou.gov.cz).',
        'Poskytnutí údajů potřebných pro vyřízení objednávky je dobrovolné, bez nich však nemusí být možné službu sjednat nebo poskytnout.',
        'Osobní údaje nepoužívám k zasílání nevyžádaných reklamních sdělení ani k automatizovanému rozhodování.'
      ] },
      { id: 'cookies', title: 'Webové technologie a cookies', items: [
        { draft: 'Tento web nepoužívá cookies ani analytické a reklamní nástroje. V prohlížeči si po dobu návštěvy pamatuje jen to, že jste už viděli úvodní animaci. Údaje z rezervace (jméno, telefon, případně e-mail a adresa, termín a podrobnosti úklidu) se odešlou do mého Kalendáře Google, až když rezervaci sami odešlete. Fotky web nikam nenahrává, posíláte je sami e-mailem nebo přes WhatsApp.', tag: 'návrh k potvrzení' }
      ] }
    ]
  }
};
