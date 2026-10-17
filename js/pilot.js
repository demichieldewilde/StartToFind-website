/* Pilot page: fee / ad-credit calculator and the pilot application form.
 * Used by pilot.html, pilot-de.html and pilot-uk.html. The page language comes
 * from <html lang>; the API base URL from <meta name="api-url">. For local
 * testing, ?api=http://localhost:3000 overrides it (localhost / 127.0.0.1 only).
 * Contract: FindIt/backend/src/server/registerPilotApplicationsRoutes.ts
 */
(function () {
  "use strict";

  // Pilot terms (keep in sync with ENCODING_PRICE_EUR / AD_CREDIT_MULTIPLIER /
  // FREE_ANALYTICS_YEARS in the backend).
  var PRICE_PER_PRODUCT = 1;
  var AD_CREDIT_MULTIPLIER = 2;
  var ANALYTICS_YEARS = 3;
  var MAX_PRODUCTS = 1000000;
  var MAIL = "info@starttofind.com";

  var lang = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase();
  if (lang !== "de" && lang !== "uk") lang = "en";
  var LOCALE = { en: "en-GB", de: "de-AT", uk: "uk-UA" }[lang];

  var T = {
    en: {
      required: "This field is required.",
      too_long: "Please use at most {max} characters.",
      email_invalid: "Please enter a valid email address.",
      phone_invalid: "Please enter a valid phone number.",
      count_invalid: "Please enter a whole number between 0 and 1,000,000.",
      count_required: "Please give an approximate number of products so we can calculate the pilot fee.",
      option_required: "Please choose one of the pilot options.",
      shop_type_required: "Please choose a shop type.",
      consent_required: "Please agree to the privacy note so we can contact you.",
      summary: "Please correct the highlighted fields.",
      sending: "Sending…",
      rate_limited: "Too many applications from this network. Please try again later or email us.",
      network: "We couldn't send your application. Please check your connection and try again, or email us directly.",
      server: "Something went wrong on our side. Please try again, or email us directly.",
      years: function (n) { return n + " years"; },
      free_line: "Free pilot: no fee. You encode your products in the app, we help you get started.",
      fee_line: "Pilot fee {fee} → {credit} ad credit + {years} of free analytics.",
      success_paid: "Your pilot with encoding by us: {count} products, pilot fee {fee}, back as {credit} ad credit, plus {years} of free analytics.",
      success_free: "Your free pilot: no fee, you encode your products in the app and we help you get started.",
      mail_subject: "StartToFind pilot application",
      mail_intro: "Hello StartToFind team, I'd like to apply for a pilot:",
      option_names: { self_encoding: "Free pilot (we encode ourselves)", encoding_by_us: "Pilot with encoding by StartToFind" }
    },
    de: {
      required: "Dieses Feld ist erforderlich.",
      too_long: "Bitte höchstens {max} Zeichen verwenden.",
      email_invalid: "Bitte eine gültige E-Mail-Adresse eingeben.",
      phone_invalid: "Bitte eine gültige Telefonnummer eingeben.",
      count_invalid: "Bitte eine ganze Zahl zwischen 0 und 1.000.000 eingeben.",
      count_required: "Bitte eine ungefähre Produktanzahl angeben, damit wir die Pilotgebühr berechnen können.",
      option_required: "Bitte eine der Pilot-Optionen wählen.",
      shop_type_required: "Bitte eine Geschäftsart wählen.",
      consent_required: "Bitte dem Datenschutzhinweis zustimmen, damit wir Sie kontaktieren können.",
      summary: "Bitte korrigieren Sie die markierten Felder.",
      sending: "Wird gesendet …",
      rate_limited: "Zu viele Bewerbungen aus diesem Netzwerk. Bitte später erneut versuchen oder uns per E-Mail schreiben.",
      network: "Ihre Bewerbung konnte nicht gesendet werden. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut, oder schreiben Sie uns direkt per E-Mail.",
      server: "Bei uns ist etwas schiefgelaufen. Bitte versuchen Sie es erneut, oder schreiben Sie uns direkt per E-Mail.",
      years: function (n) { return n + " Jahre"; },
      free_line: "Kostenloses Pilotprojekt: keine Gebühr. Sie erfassen Ihre Produkte selbst in der App, wir helfen beim Start.",
      fee_line: "Pilotgebühr {fee} → {credit} Werbeguthaben + {years} kostenlose Analytics.",
      success_paid: "Ihr Pilotprojekt mit Erfassung durch uns: {count} Produkte, Pilotgebühr {fee}, zurück als {credit} Werbeguthaben, plus {years} kostenlose Analytics.",
      success_free: "Ihr kostenloses Pilotprojekt: keine Gebühr, Sie erfassen Ihre Produkte in der App und wir helfen beim Start.",
      mail_subject: "StartToFind Pilotprojekt – Bewerbung",
      mail_intro: "Hallo StartToFind-Team, ich möchte mich für ein Pilotprojekt bewerben:",
      option_names: { self_encoding: "Kostenloses Pilotprojekt (Erfassung selbst)", encoding_by_us: "Pilotprojekt mit Erfassung durch StartToFind" }
    },
    uk: {
      required: "Це поле обов'язкове.",
      too_long: "Будь ласка, не більше {max} символів.",
      email_invalid: "Будь ласка, введіть дійсну адресу електронної пошти.",
      phone_invalid: "Будь ласка, введіть дійсний номер телефону.",
      count_invalid: "Будь ласка, введіть ціле число від 0 до 1 000 000.",
      count_required: "Будь ласка, вкажіть приблизну кількість товарів, щоб ми могли розрахувати вартість пілоту.",
      option_required: "Будь ласка, оберіть один із варіантів пілоту.",
      shop_type_required: "Будь ласка, оберіть тип магазину.",
      consent_required: "Будь ласка, погодьтеся з повідомленням про конфіденційність, щоб ми могли з вами зв’язатися.",
      summary: "Будь ласка, виправте позначені поля.",
      sending: "Надсилаємо…",
      rate_limited: "Забагато заявок з цієї мережі. Спробуйте пізніше або напишіть нам електронною поштою.",
      network: "Не вдалося надіслати заявку. Перевірте з’єднання та спробуйте ще раз або напишіть нам безпосередньо.",
      server: "Сталася помилка на нашому боці. Спробуйте ще раз або напишіть нам безпосередньо.",
      years: function (n) { return n + " роки"; },
      free_line: "Безкоштовний пілот: без оплати. Ви вносите товари в застосунок самостійно, а ми допомагаємо на старті.",
      fee_line: "Вартість пілоту {fee} → {credit} рекламного кредиту + {years} безкоштовної аналітики.",
      success_paid: "Ваш пілот із внесенням товарів нами: {count} товарів, внесок {fee}, повертається як {credit} рекламного кредиту, плюс {years} безкоштовної аналітики.",
      success_free: "Ваш безкоштовний пілот: без оплати, ви вносите товари в застосунок, а ми допомагаємо на старті.",
      mail_subject: "Заявка на пілот StartToFind",
      mail_intro: "Вітаю, команда StartToFind! Я хочу подати заявку на пілот:",
      option_names: { self_encoding: "Безкоштовний пілот (вносимо товари самі)", encoding_by_us: "Пілот із внесенням товарів командою StartToFind" }
    }
  }[lang];

  var LIMITS = { shop_name: 120, contact_name: 120, email: 254, phone: 40, city: 80, address: 200, preferred_start: 100, message: 2000 };
  var EMAIL_RE = /^[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[^\s@"<>()[\]\\,;:]{2,}$/;
  var PHONE_RE = /^\+?[0-9 ()./-]{5,40}$/;

  var money = new Intl.NumberFormat(LOCALE, { style: "currency", currency: "EUR", currencyDisplay: "narrowSymbol", minimumFractionDigits: 0, maximumFractionDigits: 0 });
  var count = new Intl.NumberFormat(LOCALE);
  function fill(tpl, vars) { return tpl.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] == null ? "" : vars[k]; }); }

  /** "1.200", "1 200", "1,200" → 1200; "" → null; anything else → NaN. */
  function parseCount(raw) {
    var s = String(raw == null ? "" : raw).trim();
    if (!s) return null;
    s = s.replace(/[\s.,'’_  ]/g, "");
    if (!/^\d+$/.test(s)) return NaN;
    var n = Number(s);
    return n > MAX_PRODUCTS ? NaN : n;
  }
  function terms(n) {
    var fee = n * PRICE_PER_PRODUCT;
    return { fee: fee, credit: fee * AD_CREDIT_MULTIPLIER };
  }

  function apiBase() {
    var meta = document.querySelector('meta[name="api-url"]');
    var base = meta ? meta.getAttribute("content") : "https://api.starttofind.com";
    try {
      var override = new URLSearchParams(location.search).get("api");
      if (override && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(override)) base = override;
    } catch (e) { /* old browser: keep meta value */ }
    return String(base).replace(/\/+$/, "");
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCalculator();
    initOptionLinks();
    initForm();
  });

  // ── Calculator ────────────────────────────────────────────────────────────
  function initCalculator() {
    var input = document.getElementById("calc-products");
    if (!input) return;
    var feeEl = document.getElementById("calc-fee");
    var creditEl = document.getElementById("calc-credit");
    var yearsEl = document.getElementById("calc-years");
    function update() {
      var n = parseCount(input.value);
      if (n === null || isNaN(n)) n = 0;
      var t = terms(n);
      feeEl.textContent = money.format(t.fee);
      creditEl.textContent = money.format(t.credit);
      if (yearsEl) yearsEl.textContent = T.years(ANALYTICS_YEARS);
    }
    input.addEventListener("input", update);
    update();
  }

  // "Choose this option" links in the option cards preselect the radio in the form.
  function initOptionLinks() {
    document.querySelectorAll("[data-pilot-option]").forEach(function (link) {
      link.addEventListener("click", function () {
        var value = link.getAttribute("data-pilot-option");
        var radio = document.querySelector('#pilot-form input[name="pilot_option"][value="' + value + '"]');
        if (!radio) return;
        radio.checked = true;
        radio.dispatchEvent(new Event("change", { bubbles: true }));
        var calc = document.getElementById("calc-products");
        var countInput = document.getElementById("pf-count");
        if (value === "encoding_by_us" && calc && countInput && !countInput.value.trim()) {
          var n = parseCount(calc.value);
          if (n !== null && !isNaN(n)) { countInput.value = String(n); countInput.dispatchEvent(new Event("input")); }
        }
      });
    });
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  function initForm() {
    var form = document.getElementById("pilot-form");
    if (!form) return;
    var startedAt = form.querySelector('input[name="started_at"]');
    startedAt.value = String(Date.now());
    form.querySelector('input[name="language"]').value = lang;

    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn.textContent;
    var formError = document.getElementById("pf-form-error");
    var formErrorText = document.getElementById("pf-form-error-text");
    var successBox = document.getElementById("pf-success");
    var countInput = document.getElementById("pf-count");
    var countReq = document.getElementById("pf-count-req");
    var feeOut = document.getElementById("pf-fee");

    function option() {
      var r = form.querySelector('input[name="pilot_option"]:checked');
      return r ? r.value : "";
    }

    function updateOption() {
      var byUs = option() === "encoding_by_us";
      countInput.required = byUs;
      countInput.setAttribute("aria-required", byUs ? "true" : "false");
      if (countReq) countReq.hidden = !byUs;
      updateFee();
    }
    function updateFee() {
      var opt = option();
      if (!opt) { feeOut.hidden = true; return; }
      feeOut.hidden = false;
      if (opt === "self_encoding") { feeOut.textContent = T.free_line; return; }
      var n = parseCount(countInput.value);
      if (n === null || isNaN(n)) n = 0;
      var t = terms(n);
      feeOut.textContent = fill(T.fee_line, { fee: money.format(t.fee), credit: money.format(t.credit), years: T.years(ANALYTICS_YEARS) });
    }
    form.addEventListener("change", function (e) {
      if (e.target.name === "pilot_option") { updateOption(); clearError("pilot_option"); }
      else if (e.target.name && e.target.getAttribute("aria-invalid")) clearError(e.target.name);
    });
    countInput.addEventListener("input", updateFee);
    updateOption();

    // Field errors: <p id="pf-err-FIELD" class="field-error">, referenced from aria-describedby.
    function controlsFor(field) {
      return Array.prototype.slice.call(form.querySelectorAll('[name="' + field + '"]'));
    }
    function setError(field, message) {
      var errEl = document.getElementById("pf-err-" + field);
      if (!errEl) return false;
      errEl.textContent = message;
      errEl.hidden = false;
      controlsFor(field).forEach(function (c) {
        c.setAttribute("aria-invalid", "true");
        var ids = (c.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
        if (ids.indexOf(errEl.id) === -1) { ids.push(errEl.id); c.setAttribute("aria-describedby", ids.join(" ")); }
      });
      var wrap = errEl.closest(".pf-field");
      if (wrap) wrap.classList.add("has-error");
      return true;
    }
    function clearError(field) {
      var errEl = document.getElementById("pf-err-" + field);
      if (!errEl) return;
      errEl.textContent = "";
      errEl.hidden = true;
      controlsFor(field).forEach(function (c) {
        c.removeAttribute("aria-invalid");
        var ids = (c.getAttribute("aria-describedby") || "").split(/\s+/).filter(function (id) { return id && id !== errEl.id; });
        if (ids.length) c.setAttribute("aria-describedby", ids.join(" ")); else c.removeAttribute("aria-describedby");
      });
      var wrap = errEl.closest(".pf-field");
      if (wrap) wrap.classList.remove("has-error");
    }
    function clearAll() {
      form.querySelectorAll(".field-error").forEach(function (el) { clearError(el.id.replace("pf-err-", "")); });
      showFormError(null);
    }
    form.addEventListener("input", function (e) { if (e.target.name && e.target.getAttribute("aria-invalid")) clearError(e.target.name); });

    function showFormError(message, withMail) {
      if (!message) { formError.hidden = true; formErrorText.textContent = ""; return; }
      formErrorText.textContent = message;
      formError.querySelector(".pf-mail").hidden = !withMail;
      formError.hidden = false;
    }
    function focusFirstError() {
      var first = form.querySelector('[aria-invalid="true"]');
      if (first) first.focus();
    }

    function val(name) {
      var el = form.elements[name];
      return el && typeof el.value === "string" ? el.value.trim() : "";
    }

    function validate() {
      var errors = {};
      ["shop_name", "contact_name", "email"].forEach(function (f) { if (!val(f)) errors[f] = T.required; });
      Object.keys(LIMITS).forEach(function (f) { if (!errors[f] && val(f).length > LIMITS[f]) errors[f] = fill(T.too_long, { max: LIMITS[f] }); });
      if (!errors.email && val("email") && !EMAIL_RE.test(val("email"))) errors.email = T.email_invalid;
      if (!errors.phone && val("phone") && !PHONE_RE.test(val("phone"))) errors.phone = T.phone_invalid;
      if (!val("shop_type")) errors.shop_type = T.shop_type_required;
      if (!option()) errors.pilot_option = T.option_required;
      var n = parseCount(val("approx_product_count"));
      if (n !== null && isNaN(n)) errors.approx_product_count = T.count_invalid;
      else if (n === null && option() === "encoding_by_us") errors.approx_product_count = T.count_required;
      if (!form.elements.consent.checked) errors.consent = T.consent_required;
      return errors;
    }

    function payload() {
      var n = parseCount(val("approx_product_count"));
      return {
        shop_name: val("shop_name"),
        contact_name: val("contact_name"),
        email: val("email"),
        phone: val("phone"),
        city: val("city") || "Vienna",
        address: val("address"),
        shop_type: val("shop_type"),
        pilot_option: option(),
        approx_product_count: n === null || isNaN(n) ? null : n,
        preferred_start: val("preferred_start"),
        message: val("message"),
        language: lang,
        consent: form.elements.consent.checked,
        website: form.elements.website.value,
        started_at: Number(startedAt.value),
        submitted_at: Date.now()
      };
    }

    function mailtoHref(data) {
      var lines = [T.mail_intro, ""];
      if (data) {
        lines.push(data.shop_name, data.contact_name, data.email);
        if (data.phone) lines.push(data.phone);
        lines.push([data.address, data.city].filter(Boolean).join(", "));
        if (data.pilot_option) lines.push(T.option_names[data.pilot_option]);
        if (data.approx_product_count != null) lines.push("~" + count.format(data.approx_product_count));
        if (data.message) lines.push("", data.message);
      }
      return "mailto:" + MAIL + "?subject=" + encodeURIComponent(T.mail_subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    }

    function setLoading(on) {
      submitBtn.disabled = on;
      form.setAttribute("aria-busy", on ? "true" : "false");
      submitBtn.textContent = on ? T.sending : submitLabel;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearAll();
      var errors = validate();
      if (Object.keys(errors).length) {
        Object.keys(errors).forEach(function (f) { setError(f, errors[f]); });
        showFormError(T.summary, false);
        focusFirstError();
        return;
      }
      var data = payload();
      formError.querySelector(".pf-mail a").href = mailtoHref(data);
      setLoading(true);
      fetch(apiBase() + "/api/pilot-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) { return { status: res.status, ok: res.ok, body: body }; });
      }).then(function (r) {
        setLoading(false);
        if (r.ok) return showSuccess(r.body || {}, data);
        var errs = (r.body && r.body.errors) || {};
        if (r.status === 429) {
          showFormError(errs.form || T.rate_limited, true);
          formError.focus();
          return;
        }
        if (r.status === 400 && Object.keys(errs).length) {
          var formMsg = errs.form || null;
          var mappedAny = false;
          Object.keys(errs).forEach(function (f) {
            if (f === "form") return;
            if (setError(f, errs[f])) mappedAny = true; else formMsg = formMsg || errs[f];
          });
          showFormError(formMsg || T.summary, false);
          if (mappedAny) focusFirstError(); else formError.focus();
          return;
        }
        showFormError(errs.form || T.server, true);
        formError.focus();
      }).catch(function () {
        setLoading(false);
        showFormError(T.network, true);
        formError.focus();
      });
    });

    function showSuccess(res, sent) {
      var termsEl = document.getElementById("pf-success-terms");
      if (termsEl) {
        // Figures come from the server response (it computes and stores them).
        var opt = res.pilot_option || sent.pilot_option;
        if (opt === "encoding_by_us" && typeof res.pilot_fee_eur === "number") {
          termsEl.textContent = fill(T.success_paid, {
            count: sent.approx_product_count == null ? "" : count.format(sent.approx_product_count),
            fee: money.format(res.pilot_fee_eur),
            credit: money.format(res.ad_credit_eur),
            years: T.years(res.free_analytics_years || ANALYTICS_YEARS)
          });
        } else {
          termsEl.textContent = T.success_free;
        }
        termsEl.hidden = false;
      }
      form.hidden = true;
      successBox.hidden = false;
      var h = successBox.querySelector("h3");
      (h || successBox).focus();
    }
  }
})();
