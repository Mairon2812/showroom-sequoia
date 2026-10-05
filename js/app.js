/* Lógica del showroom · PROYECTO SEQUOIA */
(function () {
  "use strict";

  var waLink = "https://wa.me/" + WHATSAPP + "?text=" + WA_MSG;

  /* WhatsApp links */
  document.getElementById("ctaVisita").href = waLink;
  document.getElementById("waFloat").href = waLink;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Revelado de elementos al entrar en pantalla */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---- Hotspots sobre la fachada ---- */
  var fachada = document.getElementById("fachada");
  HOTSPOTS.forEach(function (h) {
    var b = document.createElement("button");
    b.className = "hotspot";
    b.style.left = h.x + "%";
    b.style.top = h.y + "%";
    b.setAttribute("aria-label", h.label);
    b.innerHTML = '<span class="dot"></span><span class="tag">' + h.label + "</span>";
    b.addEventListener("click", function () { abrirModal(h.id); });
    fachada.appendChild(b);
  });

  /* ---- Galería de interiores ---- */
  var gal = document.getElementById("galeria");
  GALERIA.forEach(function (id, i) {
    var e = ESPACIOS[id];
    var card = document.createElement("div");
    card.className = "card reveal";
    card.style.transitionDelay = (i * 80) + "ms";
    card.innerHTML = '<img src="' + e.img + '" alt="' + e.nombre + '" loading="lazy"><p>' + e.nombre + "</p>";
    card.addEventListener("click", function () { abrirModal(id); });
    gal.appendChild(card);
    io.observe(card);
  });

  /* ---- Modal ---- */
  var modal = document.getElementById("modal");
  var modalVideo = document.getElementById("modalVideo");
  var modalTitle = document.getElementById("modalTitle");
  var modalDesc = document.getElementById("modalDesc");
  var modalWa = document.getElementById("modalWa");

  function abrirModal(id) {
    var e = ESPACIOS[id];
    if (!e) return;
    modalVideo.src = e.video;
    modalVideo.poster = e.img;
    modalTitle.textContent = e.nombre;
    modalDesc.textContent = e.desc;
    var mf = document.getElementById("modalFicha");
    mf.innerHTML = "";
    (e.ficha || []).forEach(function (f) {
      var li = document.createElement("li");
      li.textContent = f;
      mf.appendChild(li);
    });
    modalWa.href = "https://wa.me/" + WHATSAPP + "?text=" +
      encodeURIComponent("Hola, vi el ambiente '" + e.nombre + "' del PROYECTO SEQUOIA y quiero más información.");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalVideo.play().catch(function () {});
  }
  function cerrarModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalVideo.pause();
    modalVideo.removeAttribute("src");
    modalVideo.load();
  }
  document.getElementById("modalClose").addEventListener("click", cerrarModal);
  modal.addEventListener("click", function (ev) { if (ev.target === modal) cerrarModal(); });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") cerrarModal(); });

  /* ---- Tabs de planos ---- */
  var planoImg = document.getElementById("planoImg");
  var planos = { 1: "assets/planta-nivel1.png", 2: "assets/planta-nivel2.png" };
  document.querySelectorAll(".tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      resetZoom();
      planoImg.src = planos[tab.dataset.nivel];
      planoImg.alt = tab.dataset.nivel === "1" ? "Plano primer nivel" : "Plano segundo nivel";
    });
  });

  /* ---- Zoom + pan del plano ---- */
  var viewport = document.getElementById("planoViewport");
  var scale = 1, tx = 0, ty = 0;
  function apply() {
    planoImg.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
  }
  function resetZoom() { scale = 1; tx = 0; ty = 0; apply(); }
  function zoomAt(cx, cy, factor) {
    var ns = Math.min(4, Math.max(1, scale * factor));
    if (ns === 1) { resetZoom(); return; }
    var r = planoImg.getBoundingClientRect();
    var px = cx - r.left, py = cy - r.top;
    tx = cx - viewport.getBoundingClientRect().left - px * (ns / scale);
    ty = cy - viewport.getBoundingClientRect().top - py * (ns / scale);
    scale = ns;
    apply();
  }
  document.getElementById("zoomIn").addEventListener("click", function () {
    var r = viewport.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1.5);
  });
  document.getElementById("zoomOut").addEventListener("click", function () {
    var r = viewport.getBoundingClientRect();
    zoomAt(r.left + r.width / 2, r.top + r.height / 2, 1 / 1.5);
  });
  document.getElementById("zoomReset").addEventListener("click", resetZoom);
  viewport.addEventListener("wheel", function (ev) {
    ev.preventDefault();
    zoomAt(ev.clientX, ev.clientY, ev.deltaY < 0 ? 1.15 : 1 / 1.15);
  }, { passive: false });

  /* Pan con arrastre */
  var dragging = false, sx = 0, sy = 0, stx = 0, sty = 0;
  planoImg.addEventListener("pointerdown", function (ev) {
    if (scale <= 1) return;
    dragging = true; sx = ev.clientX; sy = ev.clientY; stx = tx; sty = ty;
    planoImg.setPointerCapture(ev.pointerId);
  });
  planoImg.addEventListener("pointermove", function (ev) {
    if (!dragging) return;
    tx = stx + (ev.clientX - sx); ty = sty + (ev.clientY - sy);
    apply();
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(function (e) {
    planoImg.addEventListener(e, function () { dragging = false; });
  });

  /* Pinch en táctil */
  var pinchD = 0;
  viewport.addEventListener("touchstart", function (ev) {
    if (ev.touches.length === 2) {
      pinchD = Math.hypot(
        ev.touches[0].clientX - ev.touches[1].clientX,
        ev.touches[0].clientY - ev.touches[1].clientY
      );
    }
  }, { passive: true });
  viewport.addEventListener("touchmove", function (ev) {
    if (ev.touches.length === 2) {
      ev.preventDefault();
      var d = Math.hypot(
        ev.touches[0].clientX - ev.touches[1].clientX,
        ev.touches[0].clientY - ev.touches[1].clientY
      );
      var cx = (ev.touches[0].clientX + ev.touches[1].clientX) / 2;
      var cy = (ev.touches[0].clientY + ev.touches[1].clientY) / 2;
      if (pinchD > 0) zoomAt(cx, cy, d / pinchD);
      pinchD = d;
    }
  }, { passive: false });
  /* ---- Movimiento cinematográfico con el scroll ---- */
  var progress = document.getElementById("progress");
  var heroVideo = document.querySelector(".hero-video");
  var heroContent = document.querySelector(".hero-content");
  var fachadaImg = fachada.querySelector("img");

  if (!reduceMotion) {
    var ticking = false;
    function onScroll() {
      var y = window.scrollY;
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
      /* Hero: zoom out + contenido que sube y se desvanece */
      var vh = window.innerHeight;
      if (y < vh * 1.2) {
        var p = Math.min(1, y / vh);
        heroVideo.style.transform = "scale(" + (1 + p * 0.18) + ") translateY(" + (p * 60) + "px)";
        heroContent.style.transform = "translateY(" + (-p * 130) + "px)";
        heroContent.style.opacity = String(Math.max(0, 1 - p * 1.5));
      }
      /* Fachada: parallax suave */
      var r = fachada.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        var fp = (vh - r.top) / (vh + r.height);
        fachadaImg.style.transform = "scale(1.15) translateY(" + ((fp - 0.5) * -44) + "px)";
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
  }
  /* ---- Modo guiado: capítulos a pantalla completa ---- */
  var GUIA_ORDER = ["fachada", "sala", "cocina", "habitacion", "escaleras", "bano", "naturaleza"];
  var guia = document.getElementById("guia");
  var guiaTrack = document.getElementById("guiaTrack");
  var guiaBar = document.getElementById("guiaBar");
  var guiaDots = document.getElementById("guiaDots");
  var guiaCount = document.getElementById("guiaCount");
  var guiaBuilt = false;
  var guiaActive = 0;

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function buildGuia() {
    GUIA_ORDER.forEach(function (id, i) {
      var e = ESPACIOS[id];
      var sec = document.createElement("section");
      sec.className = "cap";
      sec.innerHTML =
        '<video muted loop playsinline preload="metadata" data-src="' + e.video + '" poster="' + e.img + '"></video>' +
        '<div class="cap-shade"></div>' +
        '<div class="cap-info"><p class="cap-num">' + pad(i + 1) + " / " + pad(GUIA_ORDER.length + 1) + "</p>" +
        "<h2>" + e.nombre + "</h2><p>" + e.desc + "</p>" +
        '<button class="cap-btn" data-ficha="' + id + '">Ver ficha del ambiente</button></div>' +
        '<p class="cap-cue">Desliza ↓</p>';
      guiaTrack.appendChild(sec);
      var d = document.createElement("button");
      d.setAttribute("aria-label", "Ir al capítulo " + (i + 1));
      d.addEventListener("click", function () { goChapter(i); });
      guiaDots.appendChild(d);
    });
    /* Capítulo final: ficha + CTA */
    var fin = document.createElement("section");
    fin.className = "cap cap-final";
    fin.innerHTML =
      '<div class="cap-info"><p class="cap-num">' + pad(GUIA_ORDER.length + 1) + " / " + pad(GUIA_ORDER.length + 1) + "</p>" +
      "<h2>SEQUOIA · 200 m²</h2><p>Dos niveles · 4 habitaciones · 4 baños · Piscina · Terraza BBQ</p>" +
      '<a class="btn btn-primary btn-big" href="' + waLink + '" target="_blank" rel="noopener">Agendar visita por WhatsApp</a></div>';
    guiaTrack.appendChild(fin);
    var dEnd = document.createElement("button");
    dEnd.setAttribute("aria-label", "Ir al final");
    dEnd.addEventListener("click", function () { goChapter(GUIA_ORDER.length); });
    guiaDots.appendChild(dEnd);
    guiaBuilt = true;
  }

  function chapterTops() {
    return Array.prototype.map.call(guiaTrack.children, function (c) { return c.offsetTop; });
  }
  function goChapter(i) {
    var tops = chapterTops();
    i = Math.max(0, Math.min(tops.length - 1, i));
    guiaTrack.scrollTo({ top: tops[i], behavior: reduceMotion ? "auto" : "smooth" });
  }
  function setActive(i) {
    guiaActive = i;
    var total = guiaTrack.children.length;
    guiaCount.textContent = pad(i + 1) + " / " + pad(total);
    Array.prototype.forEach.call(guiaDots.children, function (d, di) {
      d.classList.toggle("active", di === i);
    });
    Array.prototype.forEach.call(guiaTrack.children, function (c, ci) {
      c.classList.toggle("active", ci === i);
      var v = c.querySelector("video");
      if (!v) return;
      if (Math.abs(ci - i) <= 1 && !v.src) v.src = v.dataset.src;
      if (ci === i) { v.play().catch(function () {}); }
      else { v.pause(); }
    });
  }
  var guiaTick = false;
  guiaTrack.addEventListener("scroll", function () {
    if (guiaTick) return;
    guiaTick = true;
    requestAnimationFrame(function () {
      var max = guiaTrack.scrollHeight - guiaTrack.clientHeight;
      guiaBar.style.transform = "scaleX(" + (max > 0 ? guiaTrack.scrollTop / max : 0) + ")";
      var tops = chapterTops();
      var best = 0, bestD = Infinity;
      tops.forEach(function (t, i) {
        var d = Math.abs(t - guiaTrack.scrollTop);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (best !== guiaActive) setActive(best);
      guiaTick = false;
    });
  }, { passive: true });

  function openGuia() {
    if (!guiaBuilt) buildGuia();
    guia.classList.add("open");
    guia.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    guiaTrack.scrollTop = 0;
    setActive(0);
  }
  function closeGuia() {
    guia.classList.remove("open");
    guia.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    Array.prototype.forEach.call(guiaTrack.querySelectorAll("video"), function (v) { v.pause(); });
  }
  document.getElementById("btnTour").addEventListener("click", openGuia);
  document.getElementById("guiaExit").addEventListener("click", closeGuia);
  document.getElementById("guiaPrev").addEventListener("click", function () { goChapter(guiaActive - 1); });
  document.getElementById("guiaNext").addEventListener("click", function () { goChapter(guiaActive + 1); });
  document.addEventListener("keydown", function (ev) {
    if (!guia.classList.contains("open")) return;
    if (ev.key === "Escape") closeGuia();
    if (ev.key === "ArrowDown" || ev.key === "ArrowRight") goChapter(guiaActive + 1);
    if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") goChapter(guiaActive - 1);
  });
  /* ---- Tarjeta de ficha (bottom sheet) ---- */
  var sheet = document.getElementById("sheet");
  var sheetTitle = document.getElementById("sheetTitle");
  var sheetList = document.getElementById("sheetList");
  var sheetWa = document.getElementById("sheetWa");
  function openSheet(id) {
    var e = ESPACIOS[id];
    if (!e) return;
    sheetTitle.textContent = e.nombre;
    sheetList.innerHTML = "";
    (e.ficha || []).forEach(function (f) {
      var li = document.createElement("li");
      li.textContent = f;
      sheetList.appendChild(li);
    });
    sheetWa.href = "https://wa.me/" + WHATSAPP + "?text=" +
      encodeURIComponent("Hola, vi la ficha de '" + e.nombre + "' del PROYECTO SEQUOIA y quiero más información.");
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
  }
  function closeSheet() {
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
  }
  guiaTrack.addEventListener("click", function (ev) {
    var b = ev.target.closest ? ev.target.closest(".cap-btn") : null;
    if (b) openSheet(b.getAttribute("data-ficha"));
  });
  document.getElementById("sheetClose").addEventListener("click", closeSheet);
  sheet.addEventListener("click", function (ev) { if (ev.target === sheet) closeSheet(); });
})();
