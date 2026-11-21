/* Arabic Practice service worker. Hand-written on purpose: every line can be read in one sitting.
 *
 * The build (sw-plugin.ts) replaces the two placeholders below with the build's version and the
 * list of files the app needs to start. What is cached:
 *   shell-<version>  the built app (HTML, JS, CSS, fonts, icons): cache first, replaced per deploy
 *   audio            lesson clips as they are played: cache first (a clip's name changes with its text)
 *   data             the lessons and course the learner opened: network first, cache when offline
 * Everything else (AI talk, saving progress, teacher pages) goes straight to the network.
 */
const VERSION = '__SW_VERSION__';
const SHELL_FILES = __SW_SHELL_FILES__;

const SHELL = `shell-${VERSION}`;
const AUDIO = 'audio';
const DATA = 'data';
// Servers add `Vary` (Origin, Accept-Encoding) and a module script request carries an Origin
// header that the install-time request did not, so a strict match would miss every cached file.
// The shell files are static and named by their content, so ignoring Vary is safe.
const MATCH_SHELL = { cacheName: SHELL, ignoreVary: true };

// GET API calls kept for offline reading. `auth/me` too, so the app opens as the same user.
const DATA_PATHS = [
  /^\/api\/v1\/auth\/me$/,
  /^\/api\/v1\/course$/,
  /^\/api\/v1\/lessons(\/[^/]+)?$/,
];
// After these the cached data belongs to someone else (or no one): drop it.
const ACCOUNT_CHANGES = /^\/api\/v1\/auth\/(login|logout|register|guest|demo-teacher)/;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((c) => c.addAll(SHELL_FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k.startsWith('shell-') && k !== SHELL).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (ACCOUNT_CHANGES.test(url.pathname)) {
    event.respondWith(fetch(req).finally(() => caches.delete(DATA)));
    return;
  }
  if (req.method !== 'GET') return;

  if (url.pathname.startsWith('/audio/') && url.pathname.endsWith('.mp3')) {
    event.respondWith(cacheFirst(req, AUDIO));
  } else if (DATA_PATHS.some((p) => p.test(url.pathname))) {
    event.respondWith(networkFirst(req, DATA));
  } else if (url.pathname.startsWith('/api/')) {
    // not cached
  } else if (req.mode === 'navigate') {
    // Any page address: try the network, and offline answer with the app, which routes itself.
    event.respondWith(fetch(req).catch(() => caches.match('/index.html', MATCH_SHELL)));
  } else {
    event.respondWith(caches.match(req, MATCH_SHELL).then((hit) => hit ?? fetch(req)));
  }
});

async function cacheFirst(req, name) {
  const cache = await caches.open(name);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) await cache.put(req, res.clone());
  return res;
}

async function networkFirst(req, name) {
  const cache = await caches.open(name);
  try {
    const res = await fetch(req);
    if (res.ok) await cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req);
    if (hit) return hit;
    throw err;
  }
}
