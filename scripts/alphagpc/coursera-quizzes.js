/**
 * Convert a single question block into an Org-mode formatted string,
 * preserving the order of paragraphs and tables.
 * @param {Element} questionBlock
 * @returns {string}
 */
function formatQuestionToOrg(questionBlock) {
  if (!questionBlock) return "";

  // 1) Question number and title
  const num = questionBlock.querySelector("h3 span")?.textContent.trim() || "";

  // 2) Grab EVERY <p> and <table> under the viewer in document order
  const viewer = questionBlock.querySelector('[data-testid="cml-viewer"]');
  const contentEls = viewer
    ? Array.from(viewer.querySelectorAll('table, p:not(table p)'))
    : [];

  // 3) Convert each node to Org-mode text
  const contentLines = contentEls.map((el) =>
    el.tagName === "TABLE"
      ? convertTableToOrg(el)
      : convertParagraphToOrg(el)
  ).map(x => x.trim()).filter(Boolean);

  // 4) First line → intro, rest → body
  const intro = contentLines.shift() || "";
  const body = contentLines.join("\n\n");

  // 5) MCQ options
  const choices = extractAnswerChoices(questionBlock);

  // 6) Assemble
  return (
    [
      `*** Question ${num}`,
      intro,
      body,
      choices,
    ].filter(Boolean).join("\n\n") + "\n"
  );
}


/**
 * Convert an HTML <p> element into an Org-mode string.
 * @param {HTMLParagraphElement} paraEl
 * @returns {string}
 */
function convertParagraphToOrg(paraEl) {
  if (paraEl.dataset?.pendo == "math-block") {
    const math = paraEl.querySelector('math annotation').textContent.trim();
    return `\$${math}\$`;
  }

  const spans = Array.from(paraEl.children)
  const lines = spans.map((span) => {
    if (span.dataset?.pendo == "math-block"){
      const math = span.querySelector('math annotation').textContent.trim();
      return `\$${math}\$`;
    } else {
      return span.textContent.trim();
    }
  });
  return lines.filter(Boolean).join(" ");
}

/**
 * Convert an HTML <table> element into an Org-mode table string.
 * @param {HTMLTableElement} tableEl
 * @returns {string}
 */
function convertTableToOrg(tableEl) {
  const rows = Array.from(tableEl.rows);
  const lines = rows.map((r) => {
    const cells = Array.from(r.cells).map((c) => c.textContent.trim());
    return `| ${cells.join(" | ")} |`;
  });

  if (lines.length > 1) {
    const colCount = rows[0].cells.length;
    // build a separator row like "|---+---+---|"
    const sep = "|" + Array(colCount).fill("---+").join("").slice(0, -1) + "|";
    lines.splice(1, 0, sep);
  }

  return lines.join("\n");
}


/**
 * Grab and format MCQ options from the question block.
 * @param {Element} questionBlock
 * @returns {string}
 */
function extractAnswerChoices(questionBlock) {
  const optionEls = questionBlock.parentNode.querySelectorAll(".rc-Option");
  if (!optionEls.length) return "";

  const isMulti = optionEls[0].querySelector("input")?.type === "checkbox";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const list =
    [...optionEls]
        .map((opt) => [...opt.querySelectorAll("p > .rc-CML p")].map(p => convertParagraphToOrg(p)).join(""))
        .map((choice, i) => `- [ ] ${letters[i]}. ${choice}`)
        .join("\n");

  return isMulti ? `Select all that apply:\n\n${list}` : list;
}

/**
 * Collect all questions on the page, convert to Org, copy to clipboard and log.
 */
function exportQuizAsOrg() {
  const blocks = document.querySelectorAll("[data-testid=legend]");
  const doc = Array.from(blocks).map(formatQuestionToOrg).join("\n");
  navigator.clipboard.writeText(doc);
  console.log(doc);
}

/** Insert the "Copy as Org Doc" button and wire up its click. */
function addButtonQuiz() {
  const btnHtml = `
    <button id="copy-org" class="css-1qi5els" type="button">Copy as Org Doc</button>`;
  const headerEl = document.querySelector('[data-testid="header-left"] h1');
  if (headerEl && !document.getElementById("copy-org")) {
    headerEl.insertAdjacentHTML("afterend", btnHtml);
    document
      .getElementById("copy-org")
      .addEventListener("click", exportQuizAsOrg);
  }
}
