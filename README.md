# Delta Lektorat · Tresor

The vault for the imported Excel years (the «Cash» list). The data is encrypted **in the browser** with a passphrase
that is never sent or stored anywhere. The platform (app.deltalektorat.ch) keeps only encrypted text; this page is the
only place where it is decrypted. This page talks only to the platform's API (see the security rules in `index.html`).

## How it protects the data

- Passphrase → key: PBKDF2-SHA-256, 600,000 rounds, random salt (in the browser).
- That key locks a random data key (AES-256-GCM). The platform stores only the locked data key and a check value.
- Every row is encrypted with AES-256-GCM, bound to its year, its import and its row; each year has a sealed list of its
  rows. The platform can't swap, mix in or drop rows unnoticed.
- The unlocked key lives only in the page's memory and can't be read out; «Sperren», leaving or closing the page, or
  20 minutes without use forget it.
- No error reports, no analytics, no other connections. The Excel file is read in the browser and never uploaded.

## Setup (once)

Do these in this order (the address is claimed as yours before it points anywhere).

1. **Verify the domain on GitHub.** github.com → your picture → Settings → Pages → «Add a domain» → `deltalektorat.ch`.
   GitHub shows a TXT record (`_github-pages-challenge-<your-name>` and a code). Add it where the DNS of
   deltalektorat.ch is managed, wait a few minutes, click «Verify».
2. **New repository** under your own account (not under the organisation the platform is in): name `delta-tresor`,
   **Public** (the code holds no data and no secret; Pages for private repositories needs a paid plan) → Create.
3. **Add file → Upload files** → drag in every file of this folder, including the `fonts` folder and `CNAME` → Commit.
4. **Settings → Pages** → Source «Deploy from a branch», branch `main`, folder `/ (root)` → Save.
5. At your DNS: a **CNAME** record `tresor` → `<your-name>.github.io`.
6. **Settings → Pages**: Custom domain `tresor.deltalektorat.ch` → Save → when the check is green, tick
   **Enforce HTTPS**.
7. On the repository: **Watch → All Activity** (GitHub e-mails you on every change). Under github.com → Settings →
   Applications, make sure no app (Claude, or any other) has access to this repository.
8. Netlify (the platform): Site configuration → Environment variables → add `VAULT_ORIGIN` =
   `https://tresor.deltalektorat.ch` → Deploys → Trigger deploy. Before this, the platform answers no vault at all.

## Check the files

`SHA256SUMS.txt` lists a fingerprint for every file. On a Mac, in Terminal, in the unpacked folder:
`shasum -a 256 -c SHA256SUMS.txt` – every line must say `OK`. This proves the files are the ones you were given.
It does not prove the code is harmless: `vault.js` is readable (not minified); for an update, look at what changed
(GitHub shows it when you upload) or have someone you trust look at it before you upload.

## Use

Log in to the portal first (same browser), then open `https://tresor.deltalektorat.ch` (bookmark it). Check the address
bar, then type the passphrase.
