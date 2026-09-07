// Tutorial content normalisation.
//
// Some existing tutorial documents were saved with their HTML markup
// entity-escaped — often more than once — e.g.
//   <p>&lt;h1&gt;Title&lt;/h1&gt; &lt;p&gt;body&lt;/p&gt;</p>
// which renders the tags as literal text. This happens when HTML source is
// pasted as plain text into the rich-text editor. These helpers decode that
// back into real HTML on save so it never reaches the database again, and
// give a reusable migration primitive for the existing rows.

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  "#39": "'",
  "#34": '"'
};

// Decode one layer of HTML entities (named + numeric decimal/hex).
export const decodeEntitiesOnce = (str = "") =>
  String(str).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, body) => {
    const key = body.toLowerCase();

    if (Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, key)) {
      return NAMED_ENTITIES[key];
    }

    if (body[0] === "#") {
      const codePoint =
        body[1] === "x" || body[1] === "X"
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);

      if (Number.isFinite(codePoint)) {
        try {
          return String.fromCodePoint(codePoint);
        } catch {
          return match;
        }
      }
    }

    return match;
  });

// True when the string still contains an entity-escaped "<" that begins a
// tag — covers single (&lt;) and multiply-encoded (&amp;lt;) markup, plus
// the numeric forms.
export const hasEncodedMarkup = (str = "") =>
  /&(?:amp;)*(?:lt;|#0*60;|#x0*3c;)\/?[a-z!]/i.test(String(str));

// Repeatedly decode until no entity-escaped markup remains (bounded).
export const normalizeTutorialContent = (raw = "") => {
  let html = String(raw ?? "").trim();

  for (let i = 0; i < 5 && hasEncodedMarkup(html); i++) {
    html = decodeEntitiesOnce(html);
  }

  return html;
};

// Plain text from (possibly still-encoded) HTML, for excerpts/meta.
export const htmlToPlainText = (raw = "") =>
  decodeEntitiesOnce(normalizeTutorialContent(raw))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
