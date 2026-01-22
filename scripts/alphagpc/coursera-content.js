const createIndex = () => {
  const navPanel = document.querySelector('[aria-label="Collapse course outline"]').closest("[data-testid=left-nav]");
  const navItems = [...navPanel.querySelectorAll(".outline-single-item-content-wrapper")].map(e => e.querySelectorAll("div")[1]);

  // create a map of lesson titles to sequence numbers
  const sequenceNumToItem = Array.from(navItems)
    .filter((e) => /video/i.test(e.childNodes[1].textContent))
    .map((e) => e.childNodes[0].textContent)
    .map((e, i) => [e, String(i + 1).padStart(2, "0")]);
  return new Map(sequenceNumToItem);
};

function generateDownloadCommand(e) {
  const titleIndex = createIndex();
  // NOTE: may vary by course
  // const WEEKNUM = document
  //       .querySelector('[data-current-item=true]')
  //       .closest('.cds-AccordionRoot-container')
  //       .querySelector('.cds-AccordionHeader-labelGroup div')
  //       .textContent
  //       .split(" ")
  //       .at(1)
  //       .padStart(2, "0");

  const WEEKNUM = document
        .querySelector('[data-current-item=true]')
        .closest('.cds-AccordionRoot-container')
        .querySelector('.outline-single-item-content-wrapper div:nth-of-type(2) div')
        .textContent
        .split(" ")
        .at(1)
        .padStart(2, "0");

  const button = e.target;
  const header = button.previousElementSibling;
  if (header?.tagName !== "H1") {
    throw new Error("Could not find header");
  }

  let title = header.innerText;
  if (!/^\d+.+/.test(title)) {
    DEBUG && console.log(`[INFO] Title does not start with a sequence number.`);
    DEBUG && console.log(`[INFO] Checking index for: '${title}'`);
    if (titleIndex.has(title)) {
      DEBUG && console.log("[INFO] Found matching title in index.");
      title = `${WEEKNUM}-${titleIndex.get(title)}. ${title}`;
    } else {
      DEBUG && console.log("[WARNING] Matching title not found in index");
    }
  }

  const videoDownloadsCSS = 'a[data-track-page="focused_lex_video_item"]';
  const links = Array.from(document.querySelectorAll(videoDownloadsCSS));
  const mp4 = links.filter((e) => /mp4/i.test(e.innerText))[1]; // || ({ href: document.querySelector("video").src });
  const pdf = links.filter((e) => /pdf/i.test(e.innerText))[0];
  const vtt = links.filter((e) => /vtt/i.test(e.innerText))[0];
  const txt = links.filter((e) => /txt/i.test(e.innerText))[0];

  let command = [];
  const filename = title.replace(/\//g, "-").replace(/:/g, " -");
  const saveToBasename = `module${WEEKNUM}/${filename}`
  mp4 && command.push('wget -qO "' + saveToBasename + '.mp4" "' + mp4.href + '" &');
  pdf && command.push('wget -qO "' + saveToBasename + '.pdf" "' + pdf.href + '" &');
  vtt && command.push('wget -qO "' + saveToBasename + '.vtt" "' + vtt.href + '" &');
  txt && command.push('wget -qO "' + saveToBasename + '.txt" "' + txt.href + '" &');

  // transcript fallbacks
  if (!txt) {
    const transcriptTXT = document.querySelector(".rc-TranscriptHighlighter").textContent;
    saveTextAsDownload(`${saveToBasename}.txt`, transcriptTXT)
  }
  if (!vtt) {
    const transcriptVTT =
          [...document.querySelectorAll("[data-track-component=interactive_transcript] > div")]
          .map(e => [e.querySelector('button').childNodes[1].textContent, e.querySelector('.phrases').textContent].join('\n'))
          .join("\n\n")
    saveTextAsDownload(`${saveToBasename}.vtt`, transcriptVTT)
  }

  return command.join("\n");
}

function saveTextAsDownload(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;        // e.g., "note.txt"
  a.style.display = "none";
  document.body.appendChild(a);

  a.click();                    // triggers download to default folder
  a.remove();
  URL.revokeObjectURL(url);
}

function handleClick(e) {
  // Prevent multiple clicks
  if (e.target.disabled) return;
  e.target.disabled = true;
  e.target.textContent = "Processing...";

  // ensure all lessons are expanded
  document
    .querySelectorAll("h3 button[aria-expanded=false]")
    .forEach((e) => e.click());

  // Use setTimeout instead of MutationObserver for more reliability
  setTimeout(async () => {
    try {
      DEBUG && console.log("DOM has settled after expanding lessons.");
      toggleDownloads()

      const clipboardText = await navigator.clipboard.readText();
      const command = generateDownloadCommand(e);
      const script = /wget/.test(clipboardText)
        ? [clipboardText, command].join("\n")
        : command;
      console.log(script);
      await navigator.clipboard.writeText(script);

      console.log("Advancing to next page...");
      const nextButton = document.querySelector('button[aria-label="Go to next item"]');
      if (nextButton) {
        nextButton.click();
      }
    } catch (error) {
      console.error("Error processing download:", error);
      e.target.disabled = false;
      e.target.textContent = "Download";
    }
  }, 1000); // Give DOM time to settle after expanding lessons
}

const toggleDownloads = () => {
  const section = "button[data-testid=lecture-downloads-tab]";
  const downloadSection = document.querySelector(section);
  if (downloadSection) downloadSection.click();
};

function addButtonContent() {
    toggleDownloads();
    const btnHtml = `
      <button
        id="download-content"
        class="cds-131 cds-button-disableElevation cds-button-primary css-1md39p1"
        type="button">
        Download
      </button>`;
    const headerEl = document.querySelector('h1');
    if (headerEl && !document.getElementById("download-content")) {
      headerEl.insertAdjacentHTML("afterend", btnHtml);
      document
        .getElementById("download-content")
        .addEventListener("click", handleClick);
    }
}
