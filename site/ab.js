// ab.js — অ্যাড-ব্লকার ডিটেক্টর v2। চালু/বন্ধ ও বার্তা অ্যাডমিন প্যানেল (⚙️ সেটিংস) থেকে। কোনো এড লিংক এখানে হার্ডকোড নেই।
// সিগন্যাল: (১) লুকানো বেইট এলিমেন্ট (২) আপনার এড স্ক্রিপ্ট লিংকে রিকোয়েস্ট ব্লক (৩) পেজে বসানো এড স্ক্রিপ্ট লোড ব্যর্থ।
// ওভারলে JS দিয়ে র‍্যান্ডম আইডিতে বানানো, মুছে/লুকিয়ে ফেললে আবার বসে যায়।
(function () {
  var done = false, DBG = /[?&]abdebug=1/.test(location.search), box = null;
  function dbg(t) {
    if (!DBG) return;
    if (!box) { box = document.createElement('div'); box.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483646;background:#000c;color:#0f0;font:12px/1.5 monospace;padding:8px;white-space:pre-wrap'; document.body.appendChild(box); }
    box.textContent += t + '\n';
  }
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  function getS() { try { return (typeof S !== 'undefined' && S) || {}; } catch (e) { return {}; } }
  function getP() { try { return (typeof prof !== 'undefined' && prof) || null; } catch (e) { return null; } }
  function srcOf(s) {
    var ks = ['ad_popunder', 'ad_socialbar', 'adsterra_script', 'ad_banner', 'ad_native', 'ad_post_mid'];
    for (var i = 0; i < ks.length; i++) {
      var m = String(s[ks[i]] || '').match(/<script[^>]+src=["']((?:https?:)?\/\/[^"']+)["']/i);
      if (m) return m[1].indexOf('//') === 0 ? 'https:' + m[1] : m[1];
    }
    return '';
  }
  async function detect() {
    var s = getS(), AD = srcOf(s);
    dbg('এড স্ক্রিপ্ট লিংক: ' + (AD || 'পাওয়া যায়নি'));
    if (!AD) return false;                       // এড স্ক্রিপ্টই নেই → ভুল ধরা এড়াতে চেক করি না
    var blocked = false, baits = [];
    ['adsbox ad-banner ads advert pub_300x250 text-ad', 'ad-placement adsbygoogle sponsor', 'banner_ad textads ad-slot'].forEach(function (c) {
      var d = document.createElement('div'); d.className = c;
      d.style.cssText = 'position:absolute;left:-9999px;top:0;width:10px;height:10px';
      d.innerHTML = '&nbsp;'; document.body.appendChild(d); baits.push(d);
    });
    await sleep(350);
    baits.forEach(function (d) {
      var cs = getComputedStyle(d);
      if (!d.offsetHeight || cs.display === 'none' || cs.visibility === 'hidden') blocked = true;
      d.remove();
    });
    dbg('বেইট ব্লকড: ' + blocked + ' | স্ক্রিপ্ট লোড ব্যর্থ: ' + (window.__adFail || 0));
    if (window.__adFail > 0) blocked = true;     // inj() এ কোনো এড স্ক্রিপ্ট লোড ব্যর্থ হয়েছে
    if (!blocked) { try { await fetch(AD + (AD.indexOf('?') < 0 ? '?' : '&') + '_=' + Date.now(), { mode: 'no-cors', cache: 'no-store' }); } catch (e) { blocked = true; } }
    dbg('ফাইনাল ব্লকড: ' + blocked);
    if (blocked) { try { await fetch(location.href.split('#')[0], { method: 'HEAD', cache: 'no-store' }); } catch (e) { return false; } } // নেট বন্ধ থাকলে ধরব না
    return blocked;
  }
  function mk(tag, text, css) { var e = document.createElement(tag); if (text) e.textContent = text; if (css) e.style.cssText = css; return e; }
  async function lock() {
    var brave = false;
    try { brave = !!(navigator.brave && await navigator.brave.isBrave()); } catch (e) {}
    var msg = (getS().adblock_msg || '').trim() ||
      'এই সাইট বিজ্ঞাপনের আয়ে চলে। অনুগ্রহ করে অ্যাড ব্লকার (বা প্রাইভেট DNS / ব্রাউজারের ব্লকার) বন্ধ করে পেজটি রিলোড করুন।';
    var CSS = 'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;background:#0a0a14;color:#eee;text-align:center;font-family:system-ui,sans-serif;overflow:auto;opacity:1;visibility:visible';
    var o = mk('div', '', CSS); o.id = 'z' + Math.random().toString(36).slice(2, 10);
    var b = mk('div', '', 'max-width:360px;width:100%;background:#18182b;border:1px solid #b44cff;border-radius:16px;padding:22px');
    b.appendChild(mk('div', '🕵️', 'font-size:44px'));
    b.appendChild(mk('h3', '🚫 অ্যাড ব্লকার চালু আছে', 'margin:8px 0'));
    b.appendChild(mk('p', msg, 'line-height:1.7;color:#ccd;margin:0 0 12px'));
    if (brave) b.appendChild(mk('p', 'Brave ব্যবহার করছেন? ঠিকানার পাশের সিংহ আইকনে চাপ দিয়ে এই সাইটের জন্য Shields বন্ধ করুন, তারপর রিলোড দিন।', 'line-height:1.7;color:#00e5ff;margin:0 0 12px'));
    var btn = mk('button', 'আমি বন্ধ করেছি, রিলোড করুন', 'background:linear-gradient(135deg,#b44cff,#00e5ff);border:0;color:#fff;border-radius:10px;padding:12px 18px;font:inherit;cursor:pointer;width:100%');
    btn.onclick = function () { location.reload(); };
    b.appendChild(btn); o.appendChild(b);
    function put() { if (!o.isConnected) document.body.appendChild(o); o.style.cssText = CSS; document.body.style.overflow = 'hidden'; }
    put();
    try { new MutationObserver(put).observe(document.body, { childList: true }); } catch (e) {}
    setInterval(function () {
      var cs = getComputedStyle(o);
      if (!o.isConnected || cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') put();
    }, 1500);
  }
  async function run() {
    if (done) return;
    var p = getP(); if (p && p.is_admin && !DBG) { return; }  // অ্যাডমিনকে আটকায় না (ডিবাগ মোড ছাড়া)
    if (document.getElementById('mt-ov')) return;           // রক্ষণাবেক্ষণ মোডে দরকার নেই
    if (await detect()) { done = true; lock(); }
  }
  function start() {
    var t0 = Date.now();
    (function wait() {
      var s = getS();
      if (Object.keys(s).length) {
        dbg('ads_on=' + s.ads_on + ' | adblock_on=' + s.adblock_on + ' | অ্যাডমিন লগইন=' + !!(getP() && getP().is_admin));
        if (s.ads_on === 'off' || s.adblock_on !== 'on') return;
        setTimeout(run, 2000); setTimeout(run, 7000);      // দ্বিতীয়বার: দেরিতে ব্যর্থ হওয়া স্ক্রিপ্ট ধরতে
      } else if (Date.now() - t0 < 12000) setTimeout(wait, 300);
    })();
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
})();
