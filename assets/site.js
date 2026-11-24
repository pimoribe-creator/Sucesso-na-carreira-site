(function () {
  var KEY = 'snc_cookies';
  function get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
  function set(k,v){ try { localStorage.setItem(k,v); } catch(e){} }

  function loadPixel(id) {
    if (!id || window.fbq) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', id); fbq('track', 'PageView');
  }

  function cookies(cfg) {
    var id = cfg.meta_pixel_id;
    var bar = document.getElementById('cookies');
    var link = document.getElementById('cookie-pref');
    if (!id) { if (link) link.style.display = 'none'; return; }   // sem pixel, sem cookies de publicidade, sem aviso
    function show(){ bar.style.display = 'block'; }
    function hide(){ bar.style.display = 'none'; }
    var c = get(KEY);
    if (c === 'sim') loadPixel(id); else if (c !== 'nao') show();
    document.getElementById('cookie-sim').onclick = function(){ set(KEY,'sim'); hide(); loadPixel(id); };
    document.getElementById('cookie-nao').onclick = function(){ set(KEY,'nao'); hide(); };
    if (link) link.onclick = function(){ show(); };
  }

  function fill(cfg) {
    // Preço de lançamento: depois da data em "lancamento_ate", a página passa sozinha para o preço cheio.
    if (cfg.lancamento_ate && new Date() > new Date(cfg.lancamento_ate + 'T23:59:59-03:00')) {
      if (cfg.preco_cheio) cfg.preco = cfg.preco_cheio;
      if (cfg.faq_preco_cheio) cfg.faq_preco = cfg.faq_preco_cheio;
      document.querySelectorAll('[data-launch]').forEach(function (el) { el.hidden = true; });
    }
    document.querySelectorAll('[data-fill]').forEach(function (el) {
      var v = cfg[el.getAttribute('data-fill')];
      if (v) el.textContent = v;
    });
    document.querySelectorAll('[data-buy]').forEach(function (a) { if (cfg.link_compra) a.href = cfg.link_compra; });
    document.querySelectorAll('[data-mail]').forEach(function (a) {
      if (cfg.email_contato) { a.textContent = cfg.email_contato; a.href = 'mailto:' + cfg.email_contato; }
    });
    document.querySelectorAll('[data-video]').forEach(function (box) {
      var n = box.getAttribute('data-video');
      var file = cfg['video_' + n + '_arquivo'], yt = cfg['video_' + n + '_youtube_id'], capa = cfg['video_' + n + '_capa'];
      if (file) {
        var v = document.createElement('video');
        v.controls = true; v.playsInline = true; v.preload = 'metadata';
        v.setAttribute('playsinline', ''); if (capa) v.poster = capa;
        v.innerHTML = '<source src="' + file + '" type="video/mp4">Seu navegador não consegue mostrar este vídeo.';
        box.appendChild(v);
      } else if (yt) {
        box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(yt) + '?rel=0" title="Vídeo" loading="lazy" allow="accelerometer; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      } else { return; }
      box.hidden = false;
      var wrap = box.closest('[data-video-wrap]'); if (wrap) wrap.hidden = false;
    });
    var f = document.getElementById('endereco-rodape');
    if (f && cfg.endereco) f.textContent = ' · ' + cfg.endereco;
  }

  fetch('oferta.json', { cache: 'no-cache' }).then(function (r) { return r.json(); })
    .then(function (cfg) { fill(cfg); cookies(cfg); })
    .catch(function () {});
})();
