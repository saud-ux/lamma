# The Saudi Riyal sign

`riyal.woff2` (644 bytes) and `riyal.woff` carry one character: **U+20C1**, the
Saudi Riyal sign, which Unicode added in version 17.0 in September 2025. Phones
and computers do not carry it in their own fonts yet, so a page that writes the
character shows an empty box instead. The site carries it.

- Taken from the npm package `riyal`, version 1.2.1, MIT licence. `LICENSE` is
  the one that came with it.
- The `@font-face` in `web/index.html` declares `unicode-range: U+20C1`, so the
  browser downloads and uses this font for that one character and for no other.
  Every other letter on the site keeps the font it had.
- `"Riyal"` is first in `--font-ar` and `--font-en`, and is named first in the
  canvas font of the invoice, which is drawn rather than laid out.

Should a future phone carry the sign in its own font, nothing here needs to
change: the page would simply stop needing the download.
