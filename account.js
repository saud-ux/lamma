/* A way in. The shop has no sign-in of its own: what it calls "signed" is a name and
   a phone kept on the phone. Identity came from the application around it, which is
   not there on a real host. This adds one button and one sheet, in the shop's own
   colours, and nothing else. It never touches the shop's markup.

   The shop runs as a module, so its own functions cannot be called from here. After
   a sign-in the page is loaded again, which is also the simplest thing that is right:
   the shop then starts with a token and wires itself up. */
(function () {
    "use strict";

    var account = window.MOMENT_ACCOUNT;
    if (!account) { return; }                    /* No settings: nothing to sign in to. */

    var style = document.createElement("style");
    style.textContent = [
        /* The account button sits in the hero's own row, beside the search, in the
           shop's own round shape. The logo's auto margin keeps the two together at
           the far side instead of spreading all three apart. */
        ".home-hero .top{justify-content:flex-start;gap:10px}",
        ".home-hero .top .hero-logo{margin-inline-end:auto}",
        "#mt-in{position:relative;font-weight:800;font-size:17px}",
        "#mt-in i{position:absolute;inset-block-start:1px;inset-inline-start:1px;width:10px;height:10px;",
        " border-radius:50%;background:var(--lime,#D2D642);box-shadow:0 0 0 2px var(--primary,#C8306E)}",
        /* Coming and going. The owner picked the bounce, on the same curve the shop
           already uses for its own motion. Leaving is quicker than arriving: what
           arrives is new and worth a moment, what leaves is not. */
        "#mt-wrap{position:fixed;inset:0;z-index:70;display:none;align-items:center;justify-content:center;",
        " padding:20px;background:rgba(20,8,14,0);transition:background 200ms linear}",
        "#mt-wrap[data-open]{display:flex}",
        "#mt-wrap[data-open=\"in\"]{background:rgba(20,8,14,.45)}",
        "#mt-card{width:min(420px,100%);max-height:calc(100% - 40px);overflow:auto;",
        " background:var(--bg,#fff);color:var(--ink,#2A1620);border-radius:var(--r,22px);",
        " padding:24px 20px;font:500 17px/1.5 inherit;box-shadow:0 18px 50px rgba(20,8,14,.3);",
        " opacity:0;transform:scale(.88);",
        " transition:opacity 180ms linear,transform 420ms var(--ease,cubic-bezier(.34,1.56,.64,1))}",
        "#mt-wrap[data-open=\"in\"] #mt-card{opacity:1;transform:none}",
        "#mt-wrap[data-open=\"out\"] #mt-card{opacity:0;transform:scale(.92);transition-duration:160ms}",
        "@media (prefers-reduced-motion:reduce){#mt-wrap,#mt-card{transition-duration:1ms!important}}",
        "#mt-card h2{margin:0 0 4px;font-size:21px;font-weight:800}",
        "#mt-card p{margin:0 0 16px;color:var(--muted,#6B5560);font-size:14px}",
        "#mt-card label{display:block;font-size:13px;color:var(--muted,#6B5560);margin:12px 0 5px}",
        "#mt-card input{width:100%;box-sizing:border-box;padding:13px 14px;border:1.5px solid var(--line,#F6DEE8);",
        " border-radius:14px;background:var(--bg,#fff);color:inherit;font:inherit}",
        "#mt-card input:focus{outline:none;border-color:var(--primary,#C8306E)}",
        "#mt-card button.go{width:100%;margin-top:16px;padding:14px;border:0;border-radius:999px;",
        " background:var(--primary,#C8306E);color:#fff;font:800 16px/1 inherit}",
        "#mt-card button.go[disabled]{opacity:.55}",
        "#mt-card button.quiet{width:100%;margin-top:10px;padding:11px;border:0;background:none;",
        " color:var(--muted,#6B5560);font:600 14px/1 inherit;text-decoration:underline}",
        "#mt-said{margin:14px 0 0;padding:11px 13px;border-radius:12px;font-size:14px;display:none}",
        "#mt-said[data-kind]{display:block}",
        "#mt-said[data-kind=\"bad\"]{background:#FDECEC;color:#9B2C2C}",
        "#mt-said[data-kind=\"good\"]{background:#E8F6F1;color:#1F6B52}",
        "#mt-card button.go.out{background:var(--primary,#C8306E)}",
        ".mt-who{display:flex;align-items:center;gap:13px;margin-bottom:6px}",
        ".mt-av{width:54px;height:54px;flex:none;display:flex;align-items:center;justify-content:center;",
        " border-radius:50%;background:var(--primary-soft,#FBE6EE);color:var(--primary,#C8306E);font-weight:800;font-size:22px}",
        ".mt-tx{display:flex;flex-direction:column;min-width:0}",
        ".mt-tx b{font-size:19px;font-weight:800}",
        ".mt-tx span{color:var(--muted,#6B5560);font-size:14px;overflow:hidden;text-overflow:ellipsis}",
        "#mt-card button.quiet.danger{color:#9B2C2C;margin-top:18px}",
        /* It can be pressed, so it says so. */
        ".me{cursor:pointer}"
    ].join("");

    var PERSON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"' +
        ' stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
        '<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6"/></svg>';

    var button = document.createElement("button");
    button.id = "mt-in";
    button.type = "button";
    /* The shop's own round button, so the two always match. Only the fill differs,
       and it is set here rather than in a stylesheet, which cannot go missing. */
    button.className = "hero-round";
    button.style.background = "#fff";
    button.style.color = "var(--primary, #C8306E)";

    var wrap = document.createElement("div");
    wrap.id = "mt-wrap";
    wrap.innerHTML = '<div id="mt-card" role="dialog" aria-modal="true" aria-labelledby="mt-title"></div>';

    function el(id) { return document.getElementById(id); }
    function say(words, kind) {
        var where = el("mt-said");
        where.textContent = words || "";
        if (words) { where.setAttribute("data-kind", kind); } else { where.removeAttribute("data-kind"); }
    }
    function busy(on) { el("mt-go").disabled = on; }

    function paint() {
        var on = account.signedIn();
        var letter = on ? (account.email() || "").trim().charAt(0).toUpperCase() : "";
        button.innerHTML = letter ? letter : PERSON;
        if (on) { button.insertAdjacentHTML("beforeend", "<i></i>"); }
        button.setAttribute("aria-label", on ? "حسابي" : "تسجيل الدخول");
    }

    /* The hero is drawn again on every move between screens, so the button is put
       back whenever it is missing. It belongs beside the search, after it. */
    function place() {
        var top = document.querySelector(".home-hero .top");
        if (!top) { return; }
        if (button.parentElement === top && top.lastElementChild === button) { return; }
        top.appendChild(button);
        paint();
    }

    var SIGN_IN_CARD =
        '<h2 id="mt-title">دخول</h2>' +
        '<p>نرسل لك رمزًا على بريدك. بدون كلمة مرور.</p>' +
        '<label for="mt-email">البريد الإلكتروني</label>' +
        '<input id="mt-email" type="email" inputmode="email" dir="ltr" autocomplete="email"' +
        ' autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="you@example.com">' +
        '<div id="mt-codebox" hidden><label for="mt-code">الرمز من الرسالة</label>' +
        '<input id="mt-code" type="text" inputmode="numeric" dir="ltr" autocomplete="one-time-code" placeholder="123456"></div>' +
        '<button type="button" class="go" id="mt-go">أرسل الرمز</button>' +
        '<button type="button" class="quiet" id="mt-close">ليس الآن</button>' +
        '<p id="mt-said"></p>';

    function accountCard() {
        var email = account.email() || "";
        var letter = email.trim().charAt(0).toUpperCase();
        return '<div class="mt-who"><span class="mt-av">' + (letter || "?") + '</span>' +
            '<span class="mt-tx"><b id="mt-title">حسابك</b><span dir="ltr">' + escape_(email) + '</span></span></div>' +
            '<button type="button" class="go" id="mt-orders">طلباتي</button>' +
            '<button type="button" class="quiet danger" id="mt-out">تسجيل الخروج</button>' +
            '<p id="mt-said"></p>';
    }

    function escape_(text) {
        return String(text).replace(/[&<>"]/g, function (one) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[one];
        });
    }

    function open() {
        var card = document.getElementById("mt-card");
        card.innerHTML = account.signedIn() ? accountCard() : SIGN_IN_CARD;
        wire();
        wrap.setAttribute("data-open", "yes");
        /* Two frames: the first lets the browser lay the card out where it starts,
           the second moves it, so there is something to move from. */
        window.requestAnimationFrame(function () {
            window.requestAnimationFrame(function () { wrap.setAttribute("data-open", "in"); });
        });
        if (!account.signedIn()) {
            waiting = false;
            el("mt-email").value = account.email() || "";
            el("mt-email").focus();
        }
    }
    var going = 0;
    function shut() {
        if (!wrap.hasAttribute("data-open")) { return; }
        wrap.setAttribute("data-open", "out");
        window.clearTimeout(going);
        going = window.setTimeout(function () { wrap.removeAttribute("data-open"); }, 220);
    }

    var waiting = false;        /* true once a code has been asked for. */

    function wire() {
        var close = el("mt-close");
        if (close) { close.addEventListener("click", shut); }
        var orders = el("mt-orders");
        if (orders) {
            orders.addEventListener("click", function () {
                shut();
                /* The shop's own tab, pressed for them. */
                var tab = [].slice.call(document.querySelectorAll("#nav button, #nav a"))
                    .filter(function (node) { return /طلباتي/.test(node.textContent || ""); })[0];
                if (tab) { tab.click(); }
            });
        }
        var out = el("mt-out");
        if (out) {
            out.addEventListener("click", function () {
                account.signOut();
                window.location.reload();
            });
        }
        var send = el("mt-go");
        if (send) { send.addEventListener("click", go); }
        ["mt-email", "mt-code"].forEach(function (id) {
            var field = el(id);
            if (field) {
                field.addEventListener("keydown", function (event) {
                    if (event.key === "Enter") { event.preventDefault(); go(); }
                });
            }
        });
    }

    function go() {
        var email = el("mt-email").value.trim().toLowerCase();
        if (!email || email.indexOf("@") < 1) { return say("اكتب بريدًا صحيحًا.", "bad"); }
        if (!waiting) {
            busy(true);
            account.sendCode(email).then(function () {
                busy(false); waiting = true;
                el("mt-codebox").hidden = false;
                el("mt-go").textContent = "ادخل";
                el("mt-code").focus();
                say("أرسلنا رسالة إلى بريدك. اكتب الرمز، أو الصق الرابط من الرسالة.", "good");
            }, function (trouble) {
                busy(false);
                say(String(trouble && trouble.message ? trouble.message : trouble), "bad");
            });
            return;
        }
        var given = el("mt-code").value.trim();
        if (!given) { return say("اكتب الرمز أو الصق الرابط من الرسالة.", "bad"); }
        busy(true);
        account.confirm(email, given).then(function () {
            say("أهلًا بك.", "good");
            window.setTimeout(function () { window.location.reload(); }, 400);
        }, function (trouble) {
            busy(false);
            say(String(trouble && trouble.message ? trouble.message : trouble), "bad");
        });
    }

    function start() {
        document.head.appendChild(style);
        document.body.appendChild(wrap);
        place();
        new window.MutationObserver(place).observe(document.body, { childList: true, subtree: true });
        /* The tab at the foot goes to the account screen, as it always did. The sheet
           belongs to the card at the top of that screen: press the greeting to sign
           in, or, once signed in, to see the account. */
        document.addEventListener("click", function (event) {
            var card = event.target.closest ? event.target.closest(".me") : null;
            if (card) { event.preventDefault(); open(); }
        }, true);
        button.addEventListener("click", open);
        wrap.addEventListener("click", function (event) { if (event.target === wrap) { shut(); } });
        document.addEventListener("keydown", function (event) { if (event.key === "Escape") { shut(); } });
        /* A sign-in link opened on this page carries its token in the address. */
        var address = window.location.hash + window.location.search;
        if (!account.signedIn() && /access_token=|token_hash=/.test(address)) {
            account.confirm(account.email() || "", address).then(function () {
                window.history.replaceState(null, "", window.location.pathname);
                window.location.reload();
            }, function () { /* leave it; the sheet still works */ });
        }
    }

    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", start); }
    else { start(); }
}());
