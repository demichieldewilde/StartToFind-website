# StartToFind marketing site

A fully static site (plain HTML/CSS/JS, no build step, no backend) — ready to host on GitHub Pages.

## Pages

- `index.html` — home
- `product.html` — deep dive on what's already built in the app (screenshots + a short demo video)
- `pilot.html` — the paid founding pilot offer (Vienna), FAQ, apply CTA
- `about.html` — mission, vision, values, story

## Before you publish

1. **Contact email** — every "Apply" / "Email us" button currently points to `michiel.dewilde@ist.ac.at`. Search-and-replace across all four `.html` files if you want a different address.
2. **Partner names** — XISTA and Startup Austria are shown as plain text badges (no logos), since I don't have rights to their actual logo files. Swap in real logos if you get permission, or leave as-is.
3. Everything else (copy, stats, screenshots) is accurate to the app and business plan as of today — update it if either changes.

## Deploy to GitHub Pages

From this folder:

```bash
git init
git add .
git commit -m "StartToFind marketing site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Then in the repo on GitHub: **Settings → Pages → Source → Deploy from a branch → `main` / `/ (root)`**.

Your site will be live at:

```
https://<your-username>.github.io/<your-repo>/
```

(If you name the repo `<your-username>.github.io` exactly, it serves from the root domain instead, e.g. `https://<your-username>.github.io/`.)

## Local preview

No build step needed — just serve the folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.
