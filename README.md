# Strapi i18n JSON Plugin

This project provides a minimal server to edit JSON translation files used by a frontend.
It exposes two HTTP endpoints:

- `GET /i18n-json/:lang` – Returns the contents of `src/app/i18n/locales/<lang>.json`.
- `POST /i18n-json/:lang` – Rewrites the file with the JSON body sent.

The server does not depend on external packages and can be started with:

```bash
npm start
```

A simple test script is included:

```bash
npm test
```

The test spins up the server, performs a GET and a POST request and verifies
that the file is updated correctly.
