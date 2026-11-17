(() => {
  if (window.sdiImagePopupBound) return;
  window.sdiImagePopupBound = true;

  let dialog;
  let image;
  let opener;

  function prepareImages() {
    if (!/(^|\/)userguide(?:\/|$)/.test(window.location.pathname)) return;
    document.querySelectorAll("article img").forEach((thumbnail) => {
      if (!thumbnail.getAttribute("src")) return;
      let link = thumbnail.closest("a");
      if (link) {
        // Keep links to other pages or downloads working as authored.
        if (!link.classList.contains("sdi-image-popup") &&
            !/\.(avif|bmp|gif|ico|jpe?g|png|svg|webp)$/i.test(new URL(link.href).pathname)) return;
      } else {
        link = document.createElement("a");
        link.href = thumbnail.currentSrc || thumbnail.src;
        thumbnail.before(link);
        link.append(thumbnail);
      }
      link.classList.add("sdi-image-popup");
      if (!thumbnail.alt && !link.hasAttribute("aria-label")) {
        link.setAttribute("aria-label", document.documentElement.lang.startsWith("ja") ? "画像を拡大表示" : "Enlarge image");
      }
    });
  }

  function createDialog() {
    const japanese = document.documentElement.lang.startsWith("ja");
    dialog = document.createElement("dialog");
    dialog.className = "sdi-image-popup-dialog";
    dialog.setAttribute("aria-label", japanese ? "画像の拡大表示" : "Enlarged image");

    const close = document.createElement("button");
    close.type = "button";
    close.className = "sdi-image-popup-close";
    close.setAttribute("aria-label", japanese ? "閉じる" : "Close");
    close.textContent = "×";
    image = document.createElement("img");
    dialog.append(close, image);
    document.body.append(dialog);

    // As on the home page, clicking the image or its backdrop closes it.
    dialog.addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      document.documentElement.classList.remove("sdi-image-popup-open");
      image.removeAttribute("src");
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
      opener = null;
    });
  }

  // Capture image links before Material's instant-navigation click handler.
  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey ||
        event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element && event.target.closest("a.sdi-image-popup");
    if (!link || !link.querySelector("img") ||
        typeof HTMLDialogElement === "undefined" || !HTMLDialogElement.prototype.showModal) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    if (!dialog) createDialog();
    opener = link;
    image.src = link.href;
    image.alt = link.querySelector("img").alt || link.getAttribute("aria-label") || "";
    dialog.showModal();
    document.documentElement.classList.add("sdi-image-popup-open");
  }, true);

  if (typeof document$ !== "undefined") {
    document$.subscribe(() => {
      if (dialog && dialog.open) dialog.close();
      prepareImages();
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepareImages);
  } else {
    prepareImages();
  }
})();
