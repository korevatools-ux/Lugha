/* Lugha detectives: two walking companions that follow the cursor (or finger) around the whole page.
   They turn using the front / 3-4 / side / back drawings, strike poses when idle, and talk when tapped. */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(hover: none)").matches;
  let off = false; try { off = localStorage.getItem("lugha-detectives") === "off"; } catch (e) {}
  const B = "/detectives/";
  const CHARS = {
    m: { name: "Detective", views: { front: "m-front", quarter: "m-quarter", side: "m-side", back: "m-back" },
         poses: ["m-laptop", "m-point", "m-wink", "m-think"], hello: "m-point",
         lines: ["Hello! I'm your language detective. Every day we solve a new word together.", "Ready for a lesson? It only takes ten minutes.", "Hallo! Habari! Bonjour! Which language shall we crack today?"],
         gender: "m" },
    f: { name: "Detective", views: { front: "f-front", quarter: "f-quarter", side: "f-side", back: "f-back" },
         poses: ["f-magnifier", "f-wink", "f-wave"], hello: "f-wave",
         lines: ["Hi! I'm here to help you find the right words.", "Shall we start? Your first lesson is free, like all of them!", "Every word is a clue. Let's find the next one together."],
         gender: "f" }
  };
  // preload every drawing
  const all = new Set(); Object.values(CHARS).forEach(c => { Object.values(c.views).forEach(v => all.add(v)); c.poses.forEach(p => all.add(p)); });
  all.forEach(n => { const i = new Image(); i.src = B + n + ".webp"; });

  /* ---------- voices: the visitor's own country decides the accent ----------
     1. Find the country: ?cc=XX override → Cloudflare (/cdn-cgi/trace) → time zone → browser language.
     2. Walk that country's accent list (e.g. Zimbabwe → en-ZW, en-ZA, en-KE …) and pick the first voice
        on the device that matches, preferring a male voice for him and a female voice for her.
     3. Real recordings in /detectives/voice/manifest.json win over synthetic voices. */
  const MALE = /\b(male|daniel|george|ryan|thomas|arthur|oliver|guy|davis|tony|eric|brian|david|mark|paul|richard|christopher|roger|william|liam|james|alex|aaron|fred|rishi|sean|luke|chilemba|abeo|elimu|connor|prabhat|mitchell|wayne|sam|conrad|killian|stefan|henri|jacques|alvaro|jorge|pablo|antonio|duarte|diego|cosimo|luca|maarten|xander|shakir|hamed|madhur|hemant|ravi|rafiki|daudi|themba|willem|dmitry|pavel|ahmet|marek|jacek|keita|ichiro|yunxi|yunyang|kangkang|steffan|andrew|brandon|kai|jamal|gerard|taarik|mehmet|kenji|hamdan|bassel|fahed|jamal|moaz|rami|omar|ali)\b/i;
  const FEMALE = /\b(female|samantha|victoria|karen|moira|tessa|fiona|serena|kate|susan|hazel|zira|aria|jenny|sonia|libby|maisie|emma|ava|allison|natasha|linda|heera|catherine|leah|asilia|ezinne|imani|emily|neerja|clara|molly|luna|rosa|yan|ana|michelle|katja|amala|hedda|anna|denise|eloise|julie|hortense|amelie|charline|elvira|helena|laura|monica|paulina|dalia|francisca|raquel|joana|luciana|maria|elsa|isabella|alice|colette|fenna|dena|salma|zariyah|fatima|mouna|laila|swara|lekha|veena|kalpana|zuri|rehema|thando|adri|svetlana|irina|milena|katya|emel|filiz|yelda|zofia|agnieszka|ewa|nanami|ayumi|haruka|kyoko|xiaoxiao|xiaoyi|huihui|yaoyao|tingting|sinji|hsiaochen|hanhan|aditi|ingrid|leni|jessa|siobhan|nia|sara|nora)\b/i;

  // accent lists per country — first match on the visitor's device wins
  const EAST = ["en-KE", "sw-KE", "en-TZ", "sw-TZ", "en-ZA"], SOUTH = ["en-ZA", "en-ZW", "en-KE", "en-TZ"],
        WEST = ["en-NG", "en-GH", "en-KE", "en-ZA"], FR = ["fr-FR", "fr-BE", "fr-CA", "fr-CH"],
        ES = ["es-MX", "es-US", "es-ES"], AR = ["ar-SA", "ar-EG", "ar-AE"];
  const ACCENTS = {
    ZW: ["en-ZW", "en-ZA", "en-KE", "en-TZ", "en-NG"],
    ZA: SOUTH, BW: SOUTH, NA: SOUTH, LS: SOUTH, SZ: SOUTH, ZM: SOUTH, MW: SOUTH,
    KE: EAST, UG: ["en-UG", ...EAST], RW: ["en-RW", ...EAST, "fr-FR"], SS: EAST, ET: EAST, SO: EAST,
    TZ: ["en-TZ", "sw-TZ", "en-KE", "sw-KE", "en-ZA"],
    NG: WEST, GH: ["en-GH", ...WEST], SL: WEST, LR: WEST, GM: WEST,
    GB: ["en-GB", "en-IE"], IE: ["en-IE", "en-GB"], US: ["en-US", "en-CA"], CA: ["en-CA", "en-US", "fr-CA"],
    AU: ["en-AU", "en-NZ", "en-GB"], NZ: ["en-NZ", "en-AU", "en-GB"], IN: ["en-IN", "hi-IN"], PK: ["en-PK", "en-IN"],
    SG: ["en-SG", "en-GB"], MY: ["en-MY", "en-SG"], PH: ["en-PH", "en-US"], HK: ["en-HK", "en-GB"], JM: ["en-JM", "en-US"],
    DE: ["de-DE", "de-AT", "de-CH"], AT: ["de-AT", "de-DE"], CH: ["de-CH", "de-DE", "fr-CH", "fr-FR"], LI: ["de-CH", "de-DE"],
    FR: FR, LU: ["fr-LU", ...FR], MC: FR, BE: ["fr-BE", "nl-BE", "fr-FR", "nl-NL"],
    SN: FR, CI: FR, ML: FR, BF: FR, NE: FR, GN: FR, BJ: FR, TG: FR, CM: ["fr-CM", ...FR, "en-NG"], GA: FR, CG: FR, CD: FR,
    MG: FR, BI: FR, TD: FR, CF: FR, DJ: FR, KM: FR, HT: ["fr-HT", ...FR],
    MA: ["ar-MA", "fr-FR", ...AR], DZ: ["ar-DZ", "fr-FR", ...AR], TN: ["ar-TN", "fr-FR", ...AR], EG: ["ar-EG", "ar-SA"],
    ES: ["es-ES", "es-MX"], BR: ["pt-BR", "pt-PT"], PT: ["pt-PT", "pt-BR"], AO: ["pt-PT", "pt-BR"], MZ: ["pt-PT", "pt-BR", "en-ZA"],
    CV: ["pt-PT", "pt-BR"], IT: ["it-IT"], SM: ["it-IT"], NL: ["nl-NL", "nl-BE"], SR: ["nl-NL"],
    RU: ["ru-RU"], BY: ["ru-RU"], KZ: ["ru-RU"], TR: ["tr-TR"], PL: ["pl-PL"], JP: ["ja-JP"], CN: ["zh-CN"], TW: ["zh-TW", "zh-CN"]
  };
  ["SA", "AE", "QA", "KW", "BH", "OM", "JO", "LB", "IQ", "SY", "YE", "LY", "SD"].forEach(c => ACCENTS[c] = ["ar-" + c, ...AR]);
  ["AR", "CO", "CL", "PE", "VE", "EC", "BO", "PY", "UY", "CR", "PA", "GT", "HN", "SV", "NI", "DO", "CU", "PR"].forEach(c => ACCENTS[c] = ["es-" + c, ...ES]);
  ACCENTS.MX = ES;
  const FALLBACK = ["en-GB", "en-US"];

  const TZ_CC = { "Africa/Harare": "ZW", "Africa/Johannesburg": "ZA", "Africa/Nairobi": "KE", "Africa/Dar_es_Salaam": "TZ", "Africa/Kampala": "UG",
    "Africa/Kigali": "RW", "Africa/Lagos": "NG", "Africa/Accra": "GH", "Africa/Lusaka": "ZM", "Africa/Blantyre": "MW", "Africa/Gaborone": "BW",
    "Africa/Windhoek": "NA", "Africa/Maputo": "MZ", "Africa/Cairo": "EG", "Africa/Casablanca": "MA", "Africa/Algiers": "DZ", "Africa/Tunis": "TN",
    "Africa/Addis_Ababa": "ET", "Africa/Kinshasa": "CD", "Africa/Lubumbashi": "CD", "Africa/Dakar": "SN", "Africa/Abidjan": "CI", "Africa/Douala": "CM",
    "Africa/Luanda": "AO", "Africa/Juba": "SS", "Africa/Mogadishu": "SO", "Africa/Bujumbura": "BI", "Africa/Maseru": "LS", "Africa/Mbabane": "SZ",
    "Europe/London": "GB", "Europe/Dublin": "IE", "Europe/Berlin": "DE", "Europe/Vienna": "AT", "Europe/Zurich": "CH", "Europe/Paris": "FR",
    "Europe/Brussels": "BE", "Europe/Madrid": "ES", "Europe/Lisbon": "PT", "Europe/Rome": "IT", "Europe/Amsterdam": "NL", "Europe/Warsaw": "PL",
    "Europe/Moscow": "RU", "Europe/Istanbul": "TR", "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Karachi": "PK", "Asia/Tokyo": "JP",
    "Asia/Shanghai": "CN", "Asia/Taipei": "TW", "Asia/Singapore": "SG", "Asia/Kuala_Lumpur": "MY", "Asia/Manila": "PH", "Asia/Hong_Kong": "HK",
    "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Qatar": "QA", "Pacific/Auckland": "NZ", "America/Toronto": "CA", "America/Vancouver": "CA",
    "America/Sao_Paulo": "BR", "America/Mexico_City": "MX", "America/Argentina/Buenos_Aires": "AR", "America/Bogota": "CO", "America/Lima": "PE",
    "America/Santiago": "CL", "America/Caracas": "VE", "America/Jamaica": "JM" };

  let country = "";
  try { country = (new URLSearchParams(location.search).get("cc") || sessionStorage.getItem("ld-cc") || "").toUpperCase(); } catch (e) {}
  if (!country) {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "");
    country = TZ_CC[tz] || (/^Australia\//.test(tz) ? "AU" : /^America\//.test(tz) ? "US" : "");
    if (!country) { const r = (navigator.languages || [navigator.language]).map(l => (l.split("-")[1] || "").toUpperCase()).find(r => r && r !== "US"); country = r || ""; }
    // Cloudflare knows the visitor's real country — ask it once per visit
    fetch("/cdn-cgi/trace").then(r => r.ok ? r.text() : "").then(t => {
      const m = /\bloc=([A-Z]{2})\b/.exec(t || ""); if (m && m[1] !== "XX") { country = m[1]; try { sessionStorage.setItem("ld-cc", country); } catch (e) {} pick.cache = null; }
    }).catch(() => {});
  }

  // what each detective says, in every language we may speak in
  const SAY = {
    en: { m: ["Hello! I'm your language detective. Every day we solve a new word together.", "Ready for a lesson? It only takes ten minutes.", "Hallo! Habari! Bonjour! Which language shall we crack today?"],
          f: ["Hi! I'm here to help you find the right words.", "Shall we start? Your first lesson is free, like all of them!", "Every word is a clue. Let's find the next one together."],
          hint: "Hallo! 👋 Tap me to hear my voice." },
    de: { m: ["Hallo! Ich bin dein Sprachdetektiv. Jeden Tag lösen wir zusammen ein neues Wort.", "Bereit für eine Lektion? Sie dauert nur zehn Minuten.", "Hallo! Habari! Bonjour! Welche Sprache knacken wir heute?"],
          f: ["Hi! Ich helfe dir, die richtigen Wörter zu finden.", "Wollen wir anfangen? Deine erste Lektion ist kostenlos, wie alle anderen auch!", "Jedes Wort ist ein Hinweis. Lass uns gemeinsam den nächsten finden."],
          hint: "Hallo! 👋 Tipp mich an, um meine Stimme zu hören." },
    fr: { m: ["Bonjour ! Je suis ton détective des langues. Chaque jour, nous résolvons ensemble un nouveau mot.", "Prêt pour une leçon ? Elle ne dure que dix minutes.", "Hallo ! Habari ! Bonjour ! Quelle langue allons-nous décrypter aujourd'hui ?"],
          f: ["Salut ! Je suis là pour t'aider à trouver les bons mots.", "On commence ? Ta première leçon est gratuite, comme toutes les autres !", "Chaque mot est un indice. Trouvons le suivant ensemble."],
          hint: "Bonjour ! 👋 Touche-moi pour entendre ma voix." },
    es: { m: ["¡Hola! Soy tu detective de idiomas. Cada día resolvemos juntos una palabra nueva.", "¿Listo para una lección? Solo dura diez minutos.", "¡Hallo! ¡Habari! ¡Bonjour! ¿Qué idioma vamos a descifrar hoy?"],
          f: ["¡Hola! Estoy aquí para ayudarte a encontrar las palabras adecuadas.", "¿Empezamos? Tu primera lección es gratis, ¡como todas!", "Cada palabra es una pista. Busquemos la siguiente juntos."],
          hint: "¡Hola! 👋 Tócame para oír mi voz." },
    pt: { m: ["Olá! Eu sou o seu detetive de idiomas. Todos os dias desvendamos juntos uma palavra nova.", "Pronto para uma lição? Leva só dez minutos.", "Hallo! Habari! Bonjour! Que idioma vamos desvendar hoje?"],
          f: ["Olá! Estou aqui para te ajudar a encontrar as palavras certas.", "Vamos começar? A sua primeira lição é grátis, como todas as outras!", "Cada palavra é uma pista. Vamos encontrar a próxima juntos."],
          hint: "Olá! 👋 Toque em mim para ouvir a minha voz." },
    it: { m: ["Ciao! Sono il tuo detective delle lingue. Ogni giorno risolviamo insieme una parola nuova.", "Pronto per una lezione? Dura solo dieci minuti.", "Hallo! Habari! Bonjour! Quale lingua decifriamo oggi?"],
          f: ["Ciao! Sono qui per aiutarti a trovare le parole giuste.", "Cominciamo? La tua prima lezione è gratuita, come tutte le altre!", "Ogni parola è un indizio. Troviamo insieme il prossimo."],
          hint: "Ciao! 👋 Toccami per sentire la mia voce." },
    nl: { m: ["Hallo! Ik ben je taaldetective. Elke dag lossen we samen een nieuw woord op.", "Klaar voor een les? Het duurt maar tien minuten.", "Hallo! Habari! Bonjour! Welke taal gaan we vandaag kraken?"],
          f: ["Hoi! Ik help je de juiste woorden te vinden.", "Zullen we beginnen? Je eerste les is gratis, net als alle andere!", "Elk woord is een aanwijzing. Laten we samen de volgende vinden."],
          hint: "Hallo! 👋 Tik op mij om mijn stem te horen." },
    sw: { m: ["Habari! Mimi ni mpelelezi wako wa lugha. Kila siku tunatatua neno jipya pamoja.", "Uko tayari kwa somo? Linachukua dakika kumi tu.", "Hallo! Habari! Bonjour! Tufumbue lugha gani leo?"],
          f: ["Hujambo! Niko hapa kukusaidia kupata maneno sahihi.", "Tuanze? Somo lako la kwanza ni bure, kama yote mengine!", "Kila neno ni kidokezo. Tutafute kinachofuata pamoja."],
          hint: "Habari! 👋 Niguse usikie sauti yangu." },
    ar: { m: ["مرحبًا! أنا محقق اللغات الخاص بك. كل يوم نحل معًا كلمة جديدة.", "هل أنت مستعد لدرس؟ لا يستغرق سوى عشر دقائق.", "Hallo! Habari! Bonjour! أي لغة سنكشف سرها اليوم؟"],
          f: ["أهلًا! أنا هنا لمساعدتك في العثور على الكلمات المناسبة.", "هل نبدأ؟ درسك الأول مجاني، مثل كل الدروس!", "كل كلمة دليل. لنجد الدليل التالي معًا."],
          hint: "مرحبًا! 👋 اضغط عليّ لتسمع صوتي." },
    hi: { m: ["नमस्ते! मैं आपका भाषा जासूस हूँ। हर दिन हम मिलकर एक नया शब्द सुलझाते हैं।", "एक पाठ के लिए तैयार हैं? इसमें बस दस मिनट लगते हैं।", "Hallo! Habari! Bonjour! आज हम कौन-सी भाषा सुलझाएँ?"],
          f: ["नमस्ते! मैं सही शब्द ढूँढने में आपकी मदद के लिए यहाँ हूँ।", "शुरू करें? आपका पहला पाठ मुफ़्त है, बाकी सभी की तरह!", "हर शब्द एक सुराग है। चलिए मिलकर अगला ढूँढते हैं।"],
          hint: "नमस्ते! 👋 मेरी आवाज़ सुनने के लिए मुझे टैप करें।" },
    ru: { m: ["Привет! Я твой языковой детектив. Каждый день мы вместе разгадываем новое слово.", "Готов к уроку? Он займёт всего десять минут.", "Hallo! Habari! Bonjour! Какой язык разгадаем сегодня?"],
          f: ["Привет! Я помогу тебе найти нужные слова.", "Начнём? Твой первый урок бесплатный, как и все остальные!", "Каждое слово — это улика. Давай вместе найдём следующую."],
          hint: "Привет! 👋 Нажми на меня, чтобы услышать мой голос." },
    tr: { m: ["Merhaba! Ben senin dil dedektifinim. Her gün birlikte yeni bir kelime çözüyoruz.", "Bir derse hazır mısın? Sadece on dakika sürüyor.", "Hallo! Habari! Bonjour! Bugün hangi dili çözelim?"],
          f: ["Selam! Doğru kelimeleri bulmana yardım etmek için buradayım.", "Başlayalım mı? İlk dersin ücretsiz, diğerleri gibi!", "Her kelime bir ipucu. Bir sonrakini birlikte bulalım."],
          hint: "Merhaba! 👋 Sesimi duymak için bana dokun." },
    pl: { m: ["Cześć! Jestem twoim detektywem językowym. Każdego dnia razem rozwiązujemy nowe słowo.", "Gotowy na lekcję? Zajmie tylko dziesięć minut.", "Hallo! Habari! Bonjour! Jaki język dziś rozgryziemy?"],
          f: ["Cześć! Pomogę ci znaleźć właściwe słowa.", "Zaczynamy? Twoja pierwsza lekcja jest darmowa, jak wszystkie inne!", "Każde słowo to wskazówka. Znajdźmy razem następną."],
          hint: "Cześć! 👋 Dotknij mnie, aby usłyszeć mój głos." },
    ja: { m: ["こんにちは！ぼくは君の言語探偵だよ。毎日いっしょに新しい単語をひとつ解き明かそう。", "レッスンの準備はいい？たった10分で終わるよ。", "Hallo! Habari! Bonjour! 今日はどの言語の謎を解こうか？"],
          f: ["こんにちは！ぴったりの言葉を見つけるお手伝いをするね。", "始めよう？最初のレッスンは無料、ほかも全部無料だよ！", "どの単語も手がかり。次の手がかりをいっしょに見つけよう。"],
          hint: "こんにちは！👋 タップすると声が聞けるよ。" },
    zh: { m: ["你好！我是你的语言侦探。每天我们一起破解一个新单词。", "准备好上课了吗？只需要十分钟。", "Hallo! Habari! Bonjour! 今天我们来破解哪种语言？"],
          f: ["你好！我来帮你找到合适的词语。", "开始吧？你的第一课是免费的，所有课程都是！", "每个单词都是一条线索。我们一起找下一条吧。"],
          hint: "你好！👋 点我听听我的声音。" }
  };

  const norm = l => String(l || "").replace("_", "-").toLowerCase();
  const genderOf = v => MALE.test(v.name) && !FEMALE.test(v.name) ? "m" : FEMALE.test(v.name) ? "f" : "";
  // best voice for a detective: accent first, then gender (it may drop one accent step to get the right gender)
  function pick(g) {
    const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    if (!vs.length) return null;
    if (pick.cache && pick.cache.n === vs.length && pick.cache[g] !== undefined) return pick.cache[g];
    const chain = [...(ACCENTS[country] || (country ? ["en-" + country] : [])), ...FALLBACK].map(norm).filter(l => SAY[l.split("-")[0]]);
    let best = null, bs = -1e9;
    vs.forEach(v => {
      const l = norm(v.lang); let i = chain.indexOf(l);
      const rank = i >= 0 ? (chain.length - i) * 10 : (l.startsWith("en") ? 1 : -1e6);
      const home = chain[0] ? chain[0].split("-")[0] : "en"; const sameLang = l.split("-")[0] === home;
      const vg = genderOf(v); const sc = rank + (vg === g ? 15 : vg ? -15 : 0) + (sameLang ? 0 : -30) + (/natural|neural|online|premium|enhanced/i.test(v.name) ? 3 : 0);
      if (sc > bs) { bs = sc; best = v; }
    });
    pick.cache = pick.cache && pick.cache.n === vs.length ? pick.cache : { n: vs.length };
    return (pick.cache[g] = best);
  }
  const langOf = v => { const l = v ? norm(v.lang).split("-")[0] : "en"; return SAY[l] ? l : "en"; };
  if (window.speechSynthesis) speechSynthesis.onvoiceschanged = () => { pick.cache = null; };

  // optional real recordings: /detectives/voice/manifest.json → { "ZW": { "lang": "en", "m": ["ZW/m-1.mp3", …], "f": [ … ] } }
  let REC = {}; fetch(B + "voice/manifest.json").then(r => r.ok ? r.json() : {}).then(j => { REC = j || {}; }).catch(() => {});
  let playing = null;
  window.LughaVoice = { get country() { return country; }, pick, setCountry(c) { country = String(c).toUpperCase(); pick.cache = null; } };

  /* ---------- stage ---------- */
  const css = `
  .ld-layer{position:fixed;inset:0;pointer-events:none;z-index:60}
  .ld{position:absolute;left:0;top:0;width:var(--w);height:var(--h);pointer-events:auto;cursor:pointer;will-change:transform;-webkit-tap-highlight-color:transparent}
  .ld img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:bottom;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35));transform-origin:50% 100%;transition:transform .12s}
  .ld::after{content:"";position:absolute;left:18%;right:18%;bottom:-4px;height:12px;border-radius:50%;background:radial-gradient(rgba(0,0,0,.45),transparent 70%);z-index:-1}
  .ld-say{position:absolute;bottom:100%;left:50%;transform:translate(-50%,-6px) scale(.9);min-width:150px;max-width:230px;background:#f4f4f2;color:#1b1c1f;font:500 14px/1.3 Kanit,system-ui,sans-serif;padding:8px 12px;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.35);opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;text-align:center}
  .ld-say.on{opacity:1;transform:translate(-50%,-10px) scale(1)}
  .ld-toggle{position:fixed;right:12px;top:72px;z-index:61;font:500 12px Kanit,system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#d4d4d8;background:rgba(30,30,34,.8);border:1px solid rgba(167,139,250,.45);border-radius:999px;padding:8px 12px;cursor:pointer;backdrop-filter:blur(6px)}
`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  const layer = document.createElement("div"); layer.className = "ld-layer"; layer.setAttribute("aria-hidden", "true");
  const toggle = document.createElement("button"); toggle.className = "ld-toggle"; toggle.type = "button";
  document.body.append(layer, toggle);
  const H = innerWidth < 640 ? 92 : 128;

  function makeActor(key, startX) {
    const c = CHARS[key];
    const el = document.createElement("div"); el.className = "ld"; el.style.setProperty("--h", H + "px"); el.style.setProperty("--w", Math.round(H * .68) + "px");
    const img = document.createElement("img"); img.alt = ""; img.src = B + c.views.front + ".webp"; img.draggable = false;
    const say = document.createElement("div"); say.className = "ld-say";
    el.append(img, say); layer.appendChild(el);
    const a = { key, c, el, img, say, x: startX, y: innerHeight - H - 16, vx: 0, vy: 0, cur: c.views.front, flip: 1, idle: 0, poseUntil: 0, sayUntil: 0, step: 0, line: 0 };
    el.addEventListener("click", e => { e.stopPropagation(); talk(a); });
    return a;
  }
  function show(a, name, flip) {
    if (a.cur !== name) { a.cur = name; a.img.src = B + name + ".webp"; }
    a.flip = flip || 1;
  }
  function bubble(a, text, ms) { a.say.textContent = text; a.say.dir = "auto"; a.say.classList.add("on"); a.sayUntil = performance.now() + (ms || 5200); }
  function talk(a) {
    const g = a.c.gender, idx = a.line++ % 3;
    if (playing) { playing.pause(); playing = null; }
    if (window.speechSynthesis) speechSynthesis.cancel();
    show(a, a.c.hello); a.poseUntil = performance.now() + 2600;
    const rec = REC[country] && REC[country][g];
    if (rec && rec.length) {                       // a real recording from this country
      const lang = SAY[REC[country].lang] ? REC[country].lang : "en", k = idx % rec.length;
      bubble(a, SAY[lang][g][k % 3]); playing = new Audio(B + "voice/" + rec[k]); playing.play().catch(() => {}); return;
    }
    const v = pick(g), text = SAY[langOf(v)][g][idx];
    bubble(a, text);
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-GB";
    const vg = v ? genderOf(v) : "";              // only bend the pitch when the voice is not already his / hers
    u.pitch = g === "m" ? (vg === "m" ? .95 : vg ? .65 : .8) : (vg === "f" ? 1.05 : vg ? 1.35 : 1.2);
    u.rate = g === "m" ? .93 : 1.0;
    speechSynthesis.speak(u);
  }

  let actors = [], target = { x: innerWidth * .7, y: innerHeight * .75 }, lastMove = performance.now(), raf = 0;
  addEventListener("pointermove", e => { if (e.pointerType === "mouse") { target = { x: e.clientX, y: e.clientY }; lastMove = performance.now(); } }, { passive: true });
  addEventListener("pointerdown", e => { if (!e.target.closest || !e.target.closest(".ld")) { target = { x: e.clientX, y: e.clientY }; lastMove = performance.now(); } }, { passive: true });

  function frame(now) {
    const dt = 1 / 60;
    // on phones with no recent tap, they stroll along the bottom of the screen
    const strolling = touch && now - lastMove > 6000;
    actors.forEach((a, i) => {
      let tx, ty;
      if (strolling) { const w = innerWidth - H; tx = (Math.sin(now / 5200 + i * 1.7) * .5 + .5) * w + H * .35; ty = innerHeight - 12; }
      else if (i === 0) { tx = target.x + 54; ty = target.y + H * .55; }          // he stands just right of the cursor
      else { const L = actors[0]; tx = L.x - H * .55; ty = L.y + 8; }             // she follows him
      tx = Math.max(H * .35, Math.min(innerWidth - H * .35, tx)); ty = Math.max(H + 8, Math.min(innerHeight - 6, ty));
      const dx = tx - a.x, dy = ty - a.y, dist = Math.hypot(dx, dy);
      const max = (strolling ? 80 : 420) * dt * 1.0;
      const k = Math.min(1, max / Math.max(dist, 1));
      a.vx = dx * k; a.vy = dy * k; a.x += a.vx; a.y += a.vy;
      const speed = Math.hypot(a.vx, a.vy) / dt;
      const posing = now < a.poseUntil;
      if (speed > 25 && !posing) {
        a.idle = now; a.step += speed * dt * .09;
        if (Math.abs(a.vx) > Math.abs(a.vy) * .8) show(a, a.c.views.side, a.vx < 0 ? -1 : 1);
        else if (a.vy < 0) show(a, a.c.views.back, 1);
        else show(a, a.c.views.front, 1);
      } else if (!posing) {
        // standing: face the cursor, and now and then strike a pose
        const lx = (i === 0 ? target.x : actors[0].x) - a.x;
        if (now - a.idle > 5000 && Math.random() < .004) { show(a, a.c.poses[Math.floor(Math.random() * a.c.poses.length)], 1); a.poseUntil = now + 2800; }
        else if (Math.abs(lx) > H * .6) show(a, a.c.views.quarter, lx < 0 ? 1 : -1); // the 3/4 drawings face left
        else show(a, a.c.views.front, 1);
      }
      if (now > a.sayUntil) a.say.classList.remove("on");
      const bob = speed > 25 ? Math.abs(Math.sin(a.step)) * -6 : Math.sin(now / 600 + i) * 1.5;
      const tilt = speed > 25 ? Math.sin(a.step) * 4 : 0;
      a.el.style.transform = `translate(${a.x - H * .34}px,${a.y - H + bob}px)`;
      a.img.style.transform = `scaleX(${a.flip}) rotate(${tilt}deg)`;
      a.el.style.zIndex = Math.round(a.y);
    });
    raf = requestAnimationFrame(frame);
  }
  function start() {
    off = false; save(); toggle.textContent = "🐾 Hide detectives"; layer.hidden = false;
    if (!actors.length) actors = [makeActor("m", innerWidth - 120), makeActor("f", innerWidth - 200)];
    if (reduce) { actors.forEach((a, i) => { a.x = innerWidth - 60 - i * H * .7; a.y = innerHeight - 10; a.el.style.transform = `translate(${a.x - H * .34}px,${a.y - H}px)`; }); return; }
    cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
    setTimeout(() => { let seen = false; try { seen = !!sessionStorage.getItem("ld-hi"); sessionStorage.setItem("ld-hi", "1"); } catch (e) {} if (actors[0] && !seen) { bubble(actors[0], SAY[langOf(pick("m"))].hint, 4500); } }, 1600);
  }
  function stop() { off = true; save(); cancelAnimationFrame(raf); layer.hidden = true; toggle.textContent = "🐾 Show detectives"; if (window.speechSynthesis) speechSynthesis.cancel(); if (playing) playing.pause(); }
  function save() { try { localStorage.setItem("lugha-detectives", off ? "off" : "on"); } catch (e) {} }
  toggle.onclick = () => off ? start() : stop();
  // buttons elsewhere on the page ("Hear his voice") make the walking detective talk
  document.addEventListener("click", e => { const b = e.target.closest && e.target.closest("[data-ld-talk]"); if (!b) return; if (off) start(); const a = actors[b.dataset.ldTalk === "f" ? 1 : 0]; if (a) talk(a); });
  addEventListener("resize", () => { target.x = Math.min(target.x, innerWidth - 20); target.y = Math.min(target.y, innerHeight - 20); });
  if (off) { layer.hidden = true; toggle.textContent = "🐾 Show detectives"; } else start();
})();
