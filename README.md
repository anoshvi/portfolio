# Portfolio

Personal portfolio site for Anosh Viccaji, hosted on **GitHub Pages**.

## Local preview

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

This site is a static site (HTML/CSS/JS) served by GitHub Pages from the
`main` branch. Any push to `main` redeploys automatically.

## Custom domain (Cloudflare)

1. Buy a domain in **Cloudflare Registrar**.
2. In Cloudflare **DNS**, add:
   - Four `A` records on `@` → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153` (set **DNS only / gray cloud** at first).
   - A `CNAME` on `www` → `anoshvi.github.io`.
3. In this repo: **Settings → Pages → Custom domain**, enter your domain, save.
4. Wait for the certificate, then enable **Enforce HTTPS**.
