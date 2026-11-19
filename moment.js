/* The shop was written to run inside another application. Its whole data layer is
   window.store: one object with use("db"), use("user") and use("downloads"). This
   file supplies that object, backed by Supabase, so not one line of the shop has to
   change. docs/b12/REAL_SITE.md says why, and docs/b12/DOCS_STORE.md says what the
   store allows.

   Loaded before the shop's own script, so window.store exists before it looks. */
(function () {
    "use strict";

    var SETTINGS = (function () {
        var given = window.MOMENT || window.MONASABATAK;
        if (given && typeof given.url === "string" && typeof given.key === "string" && given.url && given.key) {
            return { url: given.url.replace(/\/+$/, ""), key: given.key };
        }
        return null;
    }());
    if (!SETTINGS) { return; }          /* No settings: the shop keeps to this phone, as it did before. */

    var TOKEN_KEY = "moment.token";
    var EMAIL_KEY = "moment.email";
    var token = read(TOKEN_KEY);
    var me = null;                      /* { id } once a token has been read. */
    var watchers = [];                  /* Each onSnapshot, polled together. */
    var WATCH_MS = 6000;

    function read(key) { try { return window.localStorage.getItem(key) || null; } catch (e) { return null; } }
    function write(key, value) {
        try { if (value === null) { window.localStorage.removeItem(key); } else { window.localStorage.setItem(key, value); } }
        catch (e) { /* a private window keeps nothing; the page still works */ }
    }

    /* The part of a signed-in token that says who it is. Read here, never trusted:
       the database decides every read and write for itself. */
    function whoIsIt(found) {
        try {
            var middle = found.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
            var claims = JSON.parse(window.atob(middle + "===".slice((middle.length + 3) % 4)));
            return claims && claims.sub ? String(claims.sub) : null;
        } catch (e) { return null; }
    }

    function headers(extra) {
        var all = { apikey: SETTINGS.key, "Content-Type": "application/json" };
        if (token) { all.Authorization = "Bearer " + token; }
        for (var name in extra) { if (Object.prototype.hasOwnProperty.call(extra, name)) { all[name] = extra[name]; } }
        return all;
    }

    function call(path, options) {
        var settings = options || {};
        return window.fetch(SETTINGS.url + path, {
            method: settings.method || "GET",
            headers: headers(settings.headers),
            body: settings.body === undefined ? undefined : JSON.stringify(settings.body)
        }).then(function (answer) {
            if (answer.status === 401 && token) { signOut(); }
            if (!answer.ok) { return answer.text().then(function (said) { throw new Error(answer.status + " " + said.slice(0, 200)); }); }
            if (answer.status === 204) { return null; }
            return answer.text().then(function (said) { return said ? JSON.parse(said) : null; });
        });
    }

    function signOut() {
        token = null; me = null;
        write(TOKEN_KEY, null);
    }

    /* Signing in. The service sends a code or a link, depending on settings nobody
       here controls, so all three are read: a typed code, the link from the message,
       or the address that link lands on. The same reading as legacy/pages/common.js. */
    function readSignIn(given, email) {
        if (/^[0-9]{4,10}$/.test(given)) { return { body: { email: email, token: given, type: "email" } }; }
        var ready = given.match(/[?&#]access_token=([^&\s]+)/);
        if (ready) { return { token: decodeURIComponent(ready[1]) }; }
        var hashed = given.match(/[?&#]token(?:_hash)?=([^&\s]+)/);
        if (hashed) {
            var kind = given.match(/[?&#]type=([^&\s]+)/);
            return { body: { token_hash: decodeURIComponent(hashed[1]), type: kind ? decodeURIComponent(kind[1]) : "magiclink" } };
        }
        return null;
    }

    var TROUBLE = [
        ["rate limit", "أرسلنا رسائل كثيرة في وقت قصير. انتظر دقيقة وجرّب."],
        ["not allowed", "التسجيل بهذا البريد غير مسموح الآن."],
        ["invalid", "البريد غير صحيح."],
        ["signups not allowed", "التسجيل مقفل الآن."]
    ];
    function plainTrouble(raw) {
        var said = String(raw || "").toLowerCase();
        for (var index = 0; index < TROUBLE.length; index += 1) {
            if (said.indexOf(TROUBLE[index][0]) >= 0) { return TROUBLE[index][1]; }
        }
        return "";
    }

    function sendCode(email) {
        return window.fetch(SETTINGS.url + "/auth/v1/otp", {
            method: "POST",
            headers: { apikey: SETTINGS.key, "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, create_user: true })
        }).then(function (answer) {
            return answer.text().then(function (said) {
                var body = said ? JSON.parse(said) : {};
                if (answer.ok) { return true; }
                var raw = body.msg || body.error_description || body.message || "";
                throw new Error(plainTrouble(raw) || ("ما قدرت أرسل الرمز. " + raw));
            });
        });
    }

    function confirmCode(email, given) {
        var found = readSignIn(given, email);
        if (!found) { return Promise.reject(new Error("ما عرفت هذا. الصق الرمز كامل، أو الرابط من الرسالة.")); }
        if (found.token) { return Promise.resolve(keep(found.token)); }
        return window.fetch(SETTINGS.url + "/auth/v1/verify", {
            method: "POST",
            headers: { apikey: SETTINGS.key, "Content-Type": "application/json" },
            body: JSON.stringify(found.body)
        }).then(function (answer) {
            return answer.text().then(function (said) {
                var body = said ? JSON.parse(said) : {};
                if (body.access_token) { return keep(body.access_token); }
                throw new Error("الرمز أو الرابط غير صحيح، أو انتهت صلاحيته. اطلب رسالة جديدة.");
            });
        });
    }

    function keep(found) {
        token = found;
        me = { id: whoIsIt(found) };
        write(TOKEN_KEY, found);
        return me.id;
    }

    if (token) { me = { id: whoIsIt(token) }; if (!me.id) { signOut(); } }

    /* The store, in the shape the shop asks for. A path is a document; a collection
       is every document one level under a prefix. */
    function encode(value) { return encodeURIComponent(value); }
    var lastSegment = function (path) { return path.slice(path.lastIndexOf("/") + 1); };

    function getDoc(path) {
        return call("/rest/v1/docs?select=path,data&path=eq." + encode(path)).then(function (rows) {
            return rows && rows.length ? rows[0] : null;
        });
    }

    function getUnder(prefix) {
        var under = prefix.replace(/\/+$/, "") + "/";
        return call("/rest/v1/docs?select=path,data&path=like." + encode(under + "*") + "&order=path.asc").then(function (rows) {
            /* One level only: the shop's "collection" never means everything below. */
            return (rows || []).filter(function (row) { return row.path.slice(under.length).indexOf("/") < 0; });
        });
    }

    function ownerOf(path) {
        /* 'orders/<uid>' and anything under it belong to that person. The database
           checks this too, and refuses if these disagree. */
        var parts = path.split("/");
        return parts[0] === "orders" && parts.length > 1 ? parts[1] : null;
    }

    function setDoc(path, data) {
        return call("/rest/v1/docs?on_conflict=path", {
            method: "POST",
            headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
            body: [{ path: path, owner: ownerOf(path), data: data, updated_at: new Date().toISOString() }]
        }).then(poke);
    }

    function updateDoc(path, fields) {
        /* The shop's update means "merge these into what is there", so the merge is
           done here and the whole document written back. */
        return getDoc(path).then(function (row) {
            var now = row && row.data ? row.data : {};
            for (var name in fields) { if (Object.prototype.hasOwnProperty.call(fields, name)) { now[name] = fields[name]; } }
            return setDoc(path, now);
        });
    }

    function snapOf(row) {
        var data = row ? row.data : null;
        return { exists: Boolean(row), id: row ? lastSegment(row.path) : null, data: function () { return data; } };
    }
    function listOf(rows) {
        return { docs: (rows || []).map(snapOf), empty: !(rows && rows.length), size: rows ? rows.length : 0 };
    }

    function watch(load, tell, fail) {
        var entry = { load: load, tell: tell, fail: fail, last: null, stopped: false };
        watchers.push(entry);
        visit(entry);
        return function () { entry.stopped = true; };
    }

    function visit(entry) {
        if (entry.stopped) { return Promise.resolve(); }
        return entry.load().then(function (answer) {
            if (entry.stopped) { return; }
            var now = JSON.stringify(answer.raw);
            if (now === entry.last) { return; }
            entry.last = now;
            entry.tell(answer.snap);
        }, function (trouble) { if (entry.fail) { entry.fail(trouble); } });
    }

    function poke() {
        /* After a write, look again at once rather than waiting for the next round. */
        window.setTimeout(function () { watchers.forEach(visit); }, 150);
    }

    window.setInterval(function () {
        if (document.hidden) { return; }
        watchers.forEach(visit);
    }, WATCH_MS);

    var db = {
        doc: function (path) {
            return {
                set: function (data) { return setDoc(path, data); },
                update: function (fields) { return updateDoc(path, fields); },
                get: function () { return getDoc(path).then(snapOf); },
                onSnapshot: function (tell, fail) {
                    return watch(function () {
                        return getDoc(path).then(function (row) { return { raw: row, snap: snapOf(row) }; });
                    }, tell, fail);
                }
            };
        },
        collection: function (prefix) {
            return {
                get: function () { return getUnder(prefix).then(listOf); },
                onSnapshot: function (tell, fail) {
                    return watch(function () {
                        return getUnder(prefix).then(function (rows) { return { raw: rows, snap: listOf(rows) }; });
                    }, tell, fail);
                }
            };
        }
    };

    var user = {
        id: function () { return Promise.resolve(me ? me.id : null); },
        canEdit: function () {
            if (!me) { return Promise.resolve(false); }
            return call("/rest/v1/rpc/orders_list", { method: "POST", body: {} }).then(function (answer) {
                return Boolean(answer && answer.data && answer.data.staff);
            }, function () { return false; });
        }
    };

    window.store = {
        use: function (name) {
            if (name === "db") { return Promise.resolve(me ? db : null); }
            if (name === "user") { return Promise.resolve(user); }
            return Promise.reject(new Error("not here"));   /* downloads: the shop falls back to the browser's own */
        }
    };

    /* What the sign-in sheet needs, and what the shop's own screens can call. */
    window.MOMENT_ACCOUNT = {
        signedIn: function () { return Boolean(me && me.id); },
        id: function () { return me ? me.id : null; },
        email: function () { return read(EMAIL_KEY); },
        sendCode: function (email) { write(EMAIL_KEY, email); return sendCode(email); },
        confirm: function (email, given) { return confirmCode(email, given); },
        signOut: function () { signOut(); write(EMAIL_KEY, null); }
    };
}());
