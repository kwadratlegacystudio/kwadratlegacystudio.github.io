/* ──────────────────────────────────────────────────────────────
   Three tongues.

   English is the source. Hebrew and Yiddish are held here beside
   it, keyed the same way, and swapped in place — the page never
   reloads to change language.

   The published site also carries /he/ and /yi/ as real pages, so
   a search engine (and a shared link) finds the Hebrew and the
   Yiddish directly. Those pages are generated at publish time
   from this same table; this file stays the single source.
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var STRINGS = {

    /* ── header ─────────────────────────────────────────────── */
    'nav.works':      ['Works', 'היצירות', 'די ווערק'],
    'nav.standard':   ['Standard', 'דרך המלאכה', 'אונזער מאסשטאב'],
    'nav.enquiry':    ['Enquiry', 'פנייה פרטית', 'פריוואטע אנפראגע'],

    /* ── threshold ──────────────────────────────────────────── */
    'th.eyebrow':     ['Curators of Ancestral Heritage', 'אמני חקר האבות', 'יוחס מייסטערס'],
    'th.head':        ['Your lineage,<br>composed as an inheritance.',
                       'יחוס בית אבותיכם,<br>ערוך למשמרת לדורות.',
                       'אייער יחוס,<br>אויסגעארבעט אלס א ירושה פאר דורות.'],
    'th.lede':        ['Museum-grade lineage scrolls and hardcover yichus sefarim, privately commissioned, family by family.',
                       'מגילות יוחסין מהודרות וספרי יוחסין כרוכים, נעשים בהזמנה פרטית ובמלאכה מיוחדת לכל משפחה ומשפחה.',
                       'מייסטערהאפטיגע מגילות יוחסין און הערליכע ספרי יחוס, פראדוצירט אויף פריוואטע באשטעלונג — יעדע משפחה אלס א ווערק פאר זיך.'],
    'by.pre':         ['by the internationally renowned',
                       'ע״י המפורסם',
                       'דורך דעם בארומטען'],
    'by.name':        ['Rabbi Yossef Nechemya Kwadrat',
                       'הר״ר יוסף נחמי׳ הכהן קוואדראט הי״ו',
                       'ר׳ יוסף נחמי׳ הכהן קוואדראט נ״י'],
    'by.role':        ['genealogist and historian',
                       'חוקר יוחסין וחוקר דברי הימים',
                       'חוקר יוחסין און היסטאריקער'],
    'th.enter':       ['Enter', 'באו פנימה', 'קומט אריין'],

    /* ── works ──────────────────────────────────────────────── */
    'works.title':    ['The Works', 'היצירות', 'די ווערק'],
    'tab.unrolled':   ['Legacy Unrolled', 'היחוס הנפרש', 'דער יחוס אנטפלעקט'],
    'tab.bound':      ['Legacy Bound', 'היחוס הכרוך', 'דער יחוס געבינדן'],
    'tab.hand':       ['Legacy in Hand', 'היצירה מקרוב', 'דאס ווערק פון דער נאענט'],
    'tab.motion':     ['Legacy in Motion', 'היצירה בתנועה', 'דאס ווערק אין באוועגונג'],
    'tab.spoken':     ['Legacy Spoken', 'היצירה המסופרת', 'דאס ווערק דערציילט'],

    'hint.unrolled':  ['Select a scroll to open it, then drag to travel and scroll to magnify.',
                       'בחרו מגילה לפתיחה; גררו כדי לנוע לאורכה וגללו כדי לעיין בפרטיה.',
                       'עפענט א מגילה, פארגרעסערט עס כדי עס צו באטראכטן פון דער נאענט'],
    'hint.bound':     ['Select a sefer to open it, then turn its pages one by one.',
                       'בחרו ספר לפתיחה, ועברו בין דפיו דף אחר דף.',
                       'קלייבט א ספר צו עפענען, און בלעטערט דורכן ספר בלאט נאך בלאט.'],
    'hint.hand':      ['Select a project to see its photographs, one after another.',
                       'בחרו יצירה לצפייה בתצלומיה, תמונה אחר תמונה.',
                       'קלייבט א ווערק און באטראכט זיינע בילדער, איינס נאכן אנדערן.'],
    'hint.motion':    ['Select a project to watch its films.',
                       'בחרו יצירה לצפייה בסרטיה.',
                       'קלייבט א ווערק צו זען די פילם־אויסצוגן.'],
    'hint.spoken':    ['Interviews, clips, and pieces published elsewhere.',
                       'ראיונות, קטעי וידאו ופרסומים שהופיעו בבמות אחרות.',
                       'אינטערוויוען, פילם־אויסצוגן און אויסגאבעס וואס זענען ערשינען אויף אנדערע פלעצער.'],
    'works.empty':    ['This portfolio is being prepared.',
                       'היצירות נערכות עתה להצגה.',
                       'די זאמלונג ווערט יעצט צוגעגרייט.'],

    /* ── viewer ─────────────────────────────────────────────── */
    'viewer.fit':     ['Fit', 'התאם לתצוגה', 'צופאסן'],
    'viewer.of':      ['{n} of {total}', '{n} מתוך {total}', '{n} פון {total}'],
    'viewer.pageOf':  ['Page {n} of {total}', 'עמוד {n} מתוך {total}', 'זייט {n} פון {total}'],
    'viewer.page':    ['Page {n}', 'עמוד {n}', 'זייט {n}'],
    'viewer.pages':   ['Pages {n}', 'עמודים {n}', 'זייטן {n}'],
    'viewer.readAt':  ['Read at {host}', 'לעיון אצל {host}', 'צו לייענען ביי {host}'],
    'viewer.prev':    ['Previous work', 'היצירה הקודמת', 'פריערדיגער ווערק'],
    'viewer.next':    ['Next work', 'היצירה הבאה', 'קומענדיגער ווערק'],
    'viewer.close':   ['Close', 'סגירה', 'פארמאכן'],
    'viewer.prevPage':['Previous page', 'העמוד הקודם', 'פריערדיגע זייט'],
    'viewer.nextPage':['Next page', 'העמוד הבא', 'קומענדיגע זייט'],
    'viewer.zoomIn':  ['Zoom in', 'הגדלה', 'פארגרעסערן'],
    'viewer.zoomOut': ['Zoom out', 'הקטנה', 'פארקלענערן'],
    'viewer.fitFull': ['Fit to screen', 'התאמה למסך', 'צופאסן צום עקראן'],

    /* ── the standard ───────────────────────────────────────── */
    'std.eyebrow':    ['The Standard', 'דרך המלאכה', 'אונזער מאסשטאב'],
    'std.head':       ['Documented with responsibility.<br>Finished with permanence.',
                       'מתועד באחריות.<br>נגמר למען יעמוד לדורות.',
                       'דאקומענטירט מיט אחריות.<br>אויסגעפירט צו בלייבן פאר דורות.'],
    'std.p1':         ['First-hand sources where available. Reliable sources where needed.<br>Unverified sources are not used.',
                       'מקורות ראשוניים במקום שהם מצויים; מקורות מהימנים במקום הצורך.<br>דבר שלא נתאמת — אינו נכנס למלאכה.',
                       'ערשטהאנטיגע מקורות וואו זיי זענען פאראן; פארלעסלעכע מקורות וואו עס פעלט אויס.<br>אמבאשטעטיגטע מקורות ווערן נישט גענוצט אין אונזערע ווערק.'],
    'std.p2':         ['Each work is scoped individually according to its material, depth, format and finish &mdash; and is prepared as a single, unrepeated object.',
                       'כל יצירה נקבעת ונערכת בפני עצמה, לפי החומר, עומק המחקר, המתכונת והגימור — ונעשית כיצירה יחידה שאינה נשנית.',
                       'יעדער פראיעקט ווערט באזונדער אנאליזירט, אויסגעפארשט, און אויסגעשטעלט, און ווערט מייסטערהאפטיג געמאלן אלס איין אייגנארטיגע ווערק.'],

    /* ── enquiry ────────────────────────────────────────────── */
    'enq.eyebrow':    ['Begin', 'ראשית דבר', 'דער אנהייב'],
    'enq.head':       ['Private Commission<br>Enquiry',
                       'להתקשר אודות<br>הזמנה פרטית',
                       'אנפראגע פאר א<br>פריוואטער באשטעלונג'],
    'enq.note':       ['By appointment. Each enquiry is read personally.',
                       'בתיאום מראש. כל פנייה נקראת ונבחנת באופן אישי.',
                       'בלויז לויט אפמאך. יעדע אנפראגע ווערט פערזענליך געלייענט און באטראכט.'],
    'enq.name':       ['Enquirer&rsquo;s name', 'שם הפונה', 'נאמען'],
    'enq.email':      ['Email', 'דוא״ל', 'אימעיל'],
    'enq.phone':      ['Telephone or WhatsApp', 'טלפון או וואטסאפ', 'טעלעפאן אדער וואטסאפ'],
    'enq.message':    ['The family, and what is already held',
                       'על המשפחה, ועל החומר שכבר מצוי בידכם',
                       'וועגן דער משפחה, און וואס איר פארמאגט שוין'],
    'enq.send':       ['Send Enquiry', 'שליחת הפנייה', 'שיקט די אנפראגע'],
    'enq.sending':    ['Sending…', 'שולח…', 'שיקט…'],
    'enq.whatsapp':   ['WhatsApp', 'וואטסאפ', 'וואטסאפ'],
    'enq.gotHead':    ['Enquiry Received', 'פנייתכם התקבלה', 'אייער אנפראגע איז אנגעקומען'],
    'enq.gotThanks':  ['Thank you.', 'תודה רבה.', 'א דאנק.'],
    'enq.gotBody':    ['The studio will read your message and respond discreetly.',
                       'פנייתכם תיקרא בסטודיו ותיענה באופן אישי ובדיסקרטיות.',
                       'אייער אנפראגע וועט אין סטודיא פערזענליך געלייענט ווערן און באהאנדלט ווערן מיט פולער דיסקרעציע.'],
    'enq.error':      ['The enquiry could not be sent. Please write to info@kwadratlegacystudio.com, or use WhatsApp.',
                       'לא עלה בידינו לשלוח את הפנייה. אנא כתבו אל info@kwadratlegacystudio.com או פנו באמצעות וואטסאפ.',
                       'די אנפראגע האט זיך נישט געשיקט. ביטע שרייבט צו info@kwadratlegacystudio.com אדער פארבינדט זיך דורך וואטסאפ.'],
    'enq.hush':       ['Leave this field empty', 'השאירו שדה זה ריק', 'לאזט דעם פעלד ליידיג'],

    /* ── foot ───────────────────────────────────────────────── */
    'colophon':       ['Private Yichus Works &middot; Prepared with precision, documentation, artistry, and care.',
                       'יצירות יוחסין פרטיות &middot; נערכות בדקדוק, בתיעוד נאמן, באמנות ובכובד ראש.',
                       'פריוואטע יחוס־ווערק &middot; אויסגעארבעט מיט פינקטלעכקייט און דאקומענטירט מיט קונסט.'],

    /* ── head ───────────────────────────────────────────────── */
    'meta.title':     ['Yichus Scrolls & Lineage Books | Kwadrat Legacy Studio, London',
                       'מגילות יוחסין וספרי יוחסין | Kwadrat Legacy Studio, London',
                       'מגילות יוחסין און ספרי יחוס | קוואדראט לעגאסי סטודיא, לאנדאן'],
    'meta.desc':      ['Hand-researched family tree scrolls and yichus sefarim, designed and printed for private commission. Megillas yuchsin, lineage books and family trees traced through documented sources — מגילת יוחסין, ספר יחוס, אילן יוחסין. Rabbi Yossef Nechemya Kwadrat, London.',
                       'מגילות יוחסין וספרי יוחסין, הנחקרים, נערכים ומודפסים במלאכה אישית ובהזמנה פרטית. אילן יוחסין, מגילת יוחסין וספר יחוס, המתחקים אחר שורשי המשפחה מתוך מקורות מתועדים. הרב יוסף נחמיה הכהן קוואדראט, לונדון.',
                       'מגילות פון יחוס־אילנות און ספרי יחוס, פערזענליך אויסגעפארשט, אויסגעארבעט און געדרוקט אויף פריוואטע באשטעלונג. יחוס בוים, מגילת יוחסין און ספר יחוס, אויסגעפארשט פון דאקומענטירטע מקורות. הרב יוסף נחמיה הכהן קוואדראט, לאנדאן.'],

    /* ── the switch itself ──────────────────────────────────── */
    'lang.label':     ['Language', 'שפה', 'שפראך'],
    'lang.en':        ['English', 'אנגלית — English', 'ענגליש — English'],
    'lang.he':        ['Hebrew — עברית', 'עברית', 'העברעאיש — עברית'],
    'lang.yi':        ['Yiddish — אידיש', 'אידיש', 'אידיש']
  };

  var TONGUES = ['en', 'he', 'yi'];
  var COLUMN  = { en: 0, he: 1, yi: 2 };
  var PATH    = { en: '/', he: '/he/', yi: '/yi/' };
  var KEEP    = 'kwadrat-tongue';

  /* Which language is this page already in?  The address decides
     first — /he/ is Hebrew whatever the visitor once chose. Then a
     previous choice. Then the browser's own languages: someone
     whose device speaks Hebrew is shown Hebrew without asking. */
  function chosen() {
    var walk = location.pathname.split('/');
    for (var w = 0; w < walk.length; w++) {
      if (walk[w] === 'he') return 'he';
      if (walk[w] === 'yi') return 'yi';
    }

    var kept = null;
    try { kept = localStorage.getItem(KEEP); } catch (e) {}
    if (kept && COLUMN.hasOwnProperty(kept)) return kept;

    var asked = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < asked.length; i++) {
      var tag = String(asked[i]).toLowerCase();
      if (tag.indexOf('yi') === 0 || tag.indexOf('ji') === 0) return 'yi';
      if (tag.indexOf('he') === 0 || tag.indexOf('iw') === 0) return 'he';
    }
    return 'en';
  }

  function say(key, fill) {
    var row = STRINGS[key];
    if (!row) return '';
    var text = row[COLUMN[window.KW_LANG] || 0] || row[0];
    if (fill) {
      for (var slot in fill) {
        if (fill.hasOwnProperty(slot)) {
          text = text.split('{' + slot + '}').join(fill[slot]);
        }
      }
    }
    return text;
  }

  /* Strings hold their own markup (a line break, an em dash entity),
     so they are written as HTML — they come from this file alone. */
  function dress(el, text) {
    if (text.indexOf('<') > -1 || text.indexOf('&') > -1) el.innerHTML = text;
    else el.textContent = text;
  }

  function turn(lang, remember) {
    if (!COLUMN.hasOwnProperty(lang)) lang = 'en';
    window.KW_LANG = lang;

    var root = document.documentElement;
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
    root.setAttribute('data-tongue', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var text = say(el.getAttribute('data-i18n'));
      if (text) dress(el, text);
    });
    document.querySelectorAll('[data-i18n-label]').forEach(function (el) {
      var text = say(el.getAttribute('data-i18n-label'));
      if (text) el.setAttribute('aria-label', text.replace(/&[a-z]+;/g, ''));
    });

    var head = say('meta.title');
    if (head) document.title = head.replace(/&amp;/g, '&');
    var note = document.querySelector('meta[name="description"]');
    if (note) note.setAttribute('content', say('meta.desc'));

    document.querySelectorAll('.tongue').forEach(function (a) {
      var on = a.getAttribute('data-lang') === lang;
      a.classList.toggle('is-current', on);
      a.setAttribute('aria-current', on ? 'true' : 'false');
    });

    if (remember) {
      try { localStorage.setItem(KEEP, lang); } catch (e) {}
    }
    document.dispatchEvent(new CustomEvent('kwadrat:tongue', { detail: lang }));
  }

  window.KW_LANG = chosen();
  window.KW_T = say;
  window.KW_TURN = turn;
  window.KW_TONGUES = TONGUES;

  function ready() {
    turn(window.KW_LANG, false);

    document.querySelectorAll('.tongue').forEach(function (a) {
      a.addEventListener('click', function (ev) {
        var want = a.getAttribute('data-lang');
        if (!COLUMN.hasOwnProperty(want)) return;
        ev.preventDefault();
        if (want === window.KW_LANG) return;
        turn(want, true);
        /* Keep the address honest, so a reload or a shared link
           lands on the same tongue. */
        try {
          var base = location.pathname.replace(/\/(he|yi)\/?$/, '/').replace(/\/index\.html$/, '/');
          if (base.slice(-1) !== '/') base += '/';
          history.pushState({ lang: want }, '', base.replace(/\/$/, '') + PATH[want] + location.hash);
        } catch (e) {}
      });
    });
  }

  /* This file is loaded at the foot of the page, so everything it
     touches is already parsed — no need to wait for the rest. */
  if (document.querySelector('.tongue')) ready();
  else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
})();
