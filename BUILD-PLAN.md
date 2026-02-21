Neurologie-Schwyz Website Relaunch

Projektpfad:
D:\Codes\Windsurf\neurologie-schwyz

🚀 ZIEL

Neuaufbau der bestehenden Website als moderne statische Seite mit:

Weiß / Grün / Braun (Natur-Erdtöne)

Modernes professionelles Design

Vollständige Team-Aktualisierung

Blog-System für medizinische Artikel

Deployment via GitHub Actions

GitHub Pages → Build and Deployment

🔴 SCHRITT 1 – INS PROJEKT WECHSELN
cd D:\Codes\Windsurf\neurologie-schwyz

Falls Git noch nicht initialisiert:

git init
🔴 SCHRITT 2 – REPOSITORY RESET (SAUBERER NEUSTART)

⚠ Nur beim ersten Mal ausführen

git checkout --orphan clean-branch
git add -A
git commit -m "Clean start"
git branch -D main
git branch -m main
git push -f origin main
🟡 SCHRITT 3 – GRUNDSTRUKTUR ERSTELLEN
👉 Prompt für Windsurf
Erstelle eine saubere statische Website-Struktur.

Dateien:
- index.html
- team.html
- kontakt.html
- blog.html
- 404.html

Ordner:
- /assets/css/style.css
- /assets/js/script.js
- /assets/images/team/
- /blog/

Semantisches HTML5.
Mobile First.
Elegantes Design (weiß/grün/braun).
Kein Framework.
💾 Push
git add .
git commit -m "Initialize clean website structure"
git push origin main
🟢 SCHRITT 4 – BESTEHENDE WEBSITE ALS BASIS NACHBAUEN
👉 Prompt
Baue die bestehende Website von neurologie-schwyz.ch als moderne statische HTML-Version nach.

Erstelle:
- Navigation
- Startseite
- Teamseite
- Kontaktseite
- Footer

Strukturiere Inhalte neu.
Modernisiere Layout.
Nur HTML, CSS, JS.
Kein PHP.
💾 Push
git add .
git commit -m "Rebuild website as static version"
git push
🔵 SCHRITT 5 – TEAMSEITE KOMPLETT MODERNISIEREN
👉 Prompt
Überarbeite team.html komplett:

- Grid Kartenlayout
- Platzhalterbilder für alle Personen
- Kurzbeschreibung
- Button "Mehr erfahren"
- Bereich für fehlende MPA ergänzen
- Sanfte Hover Effekte
- Responsive Design

Stil: Elegant, Naturfarben, professionell.
💾 Push
git add .
git commit -m "Redesign team page"
git push
🟣 SCHRITT 6 – NEUES FARBDESIGN
👉 Prompt
Überarbeite style.css vollständig:

Primärfarben:
- Weiß #FFFFFF
- Naturgrün #8BAF8B
- Braun #A67B5B

Modernes Layout:
- Max Width 1200px
- Sticky Header
- Sanfte Schatten
- Moderne Typografie
- Mobile Navigation (Hamburger)

Gesamte Seite soll elegant und hochwertig wirken.
💾 Push
git add .
git commit -m "Apply new white/green/brown theme"
git push
🟠 SCHRITT 7 – BLOG SYSTEM EINBAUEN
👉 Prompt
Erstelle ein statisches Blog-System.

Struktur:
- /blog/index.html
- /blog/artikel-template.html

Jeder Artikel:
- Titel
- Autor
- Datum
- Teaserbild
- SEO Meta Tags

Blog Übersicht mit Kartenlayout.
Design im bestehenden Theme.
💾 Push
git add .
git commit -m "Add blog system"
git push
🟤 SCHRITT 8 – SEO + PERFORMANCE
👉 Prompt
Füge SEO-Optimierung hinzu:

- Meta Title
- Meta Description
- Open Graph
- Sitemap.xml
- robots.txt
- Optimierte Bilderstruktur
- 404.html für GitHub Pages

Struktur sauber validieren.
💾 Push
git add .
git commit -m "Add SEO and optimization"
git push
🟡 SCHRITT 9 – GITHUB ACTIONS SETUP (WICHTIG)

Da GitHub Pages unter Build and deployment → GitHub Actions laufen soll, erstellen wir eine Workflow-Datei.

📁 Datei erstellen:

.github/workflows/deploy.yml

👉 Prompt für Windsurf
Erstelle eine GitHub Actions Workflow-Datei:

Pfad:
.github/workflows/deploy.yml

Workflow:
- Trigger: push auf main
- Node Setup
- Kein Build notwendig (statische Seite)
- Deploy auf GitHub Pages

Nutze offizielle actions:
- actions/checkout
- actions/configure-pages
- actions/upload-pages-artifact
- actions/deploy-pages
Beispiel deploy.yml
name: Deploy static site to Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
💾 Push
git add .
git commit -m "Add GitHub Actions deployment"
git push
🔵 SCHRITT 10 – GITHUB SETTINGS KONFIGURIEREN

Repository öffnen

Settings

Pages

Build and deployment

Source: GitHub Actions

Fertig ✅

🟢 OPTIONAL – CUSTOM DOMAIN

Falls Domain vorhanden:

echo "neurologie-schwyz.ch" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push