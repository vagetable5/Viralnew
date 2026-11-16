// ux.js — লেখার আকার (Aa), ফেভারিট (ব্রাউজারে সেভ), সাম্প্রতিক সার্চ। সবই ব্যবহারকারীর ফোনে থাকে, সার্ভারে কিছু যায় না।
(function () {
  var L = function (k, d) { try { return JSON.parse(localStorage.getItem(k) || d); } catch (e) { return JSON.parse(d); } };
  var W = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var Z = [1, 1.12, 1.25], zi = Math.min(2, Math.max(0, +localStorage.getItem('zi') || 0));
  try { document.documentElement.style.zoom = Z[zi]; } catch (e) {}
  window.FAV = {
    get: function () { return L('fav', '[]'); },
    has: function (id) { return this.get().some(function (x) { return x.id == id; }); },
    tog: function (p) {
      var a = this.get(), i = a.findIndex(function (x) { return x.id == p.id; });
      if (i >= 0) a.splice(i, 1);
      else a.unshift({ id: p.id, title: p.title, thumb: p.thumb, type: p.type, category: p.category, created_at: p.created_at, views: p.views });
      W('fav', a.slice(0, 60)); return i < 0;
    }
  };
  window.RS = {
    get: function () { return L('rs', '[]'); },
    add: function (q) { var a = this.get().filter(function (x) { return x !== q; }); a.unshift(q); W('rs', a.slice(0, 6)); }
  };
  document.addEventListener('DOMContentLoaded', function () {
    var h = document.querySelector('header'); if (!h) return;
    var b = document.createElement('button'); b.className = 'zb'; b.textContent = 'Aa'; b.title = 'লেখার আকার';
    b.onclick = function () { zi = (zi + 1) % 3; try { localStorage.setItem('zi', zi); document.documentElement.style.zoom = Z[zi]; } catch (e) {} };
    h.insertBefore(b, h.lastElementChild);
  });
})();
