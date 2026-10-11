# Tar Heel Science Lab (Grade 5, NC 2023 Science Standards)

An interactive app for all 16 Grade 5 objectives in the NC DPI *Grade 5 Science 2023 Support Document* (August 2025). Each objective has a big idea, reading links with a purpose, a hands-on lab, science words, sentence stems, a quick check, and Eureka Math² connections where the standard uses math.

## 1. Use it as a standalone app

`index.html` is the whole app in one file. It needs no build step and no server.

- **On a computer:** download `index.html` and double-click it. It works offline; without internet it only falls back to system fonts, and the reading links need internet.
- **On the web:** put `index.html` on any static host (GitHub Pages, Google Sites file, district web server).
- **Deep links:** add an objective code after `#`, for example `index.html#PS.5.1.1`. The teacher guide is `index.html#teacher`.
- **Embed mode:** add `~embed` to hide the top bar when the app sits inside an LMS iframe, for example `index.html#PS.5.2.2~embed`.

Stars save in each student's browser (`localStorage`). They aren't grades, and some browsers block them inside iframes. The app still works when that happens.

## 2. Use it in Canvas

Canvas removes `<script>` and `<style>` from pages, so the app can't be pasted into a page directly. This folder supports two ways to use it:

### A. Canvas pages (recommended)

`canvas/` holds one paste-ready page per objective plus `00-course-home.html`. They use only inline styles plus `<details>` for word cards and "Check answer" buttons, so they survive the Canvas editor. Each page embeds that objective's interactive lab in an iframe.

1. Host `index.html` somewhere students can reach (see step 1), and copy its URL.
2. Rebuild the pages with that URL so every lab iframe points to it:
   ```bash
   node tools/build-canvas.js index.html canvas https://YOUR-HOST/index.html
   ```
   Without a URL, the pages use the placeholder `APP_URL_HERE`. You can also find-and-replace that placeholder by hand.
3. In Canvas, create a Page, open the **HTML Editor** (`</>`), paste the contents of a file such as `canvas/PS.5.1.1.html`, and save.

Open `canvas/_preview-all-pages.html` in a browser to see every page before you paste it.

### B. Upload the file only

Upload `index.html` to **Course Files** and link to it from a Module. Whether Canvas runs it in place depends on your district's settings. Hosting it (option A) is more reliable.
