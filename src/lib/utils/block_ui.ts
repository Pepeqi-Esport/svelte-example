function blockCard() {
  let cardElementClass = ".card";

  let isDarkMode = false;

  if (document.documentElement.getAttribute("data-bs-theme") === "dark") {
    isDarkMode = true;
  }

  let bgColor = "rgba(" + window.Helpers.getCssVar("black-rgb") + ", 0.5)";

  if (isDarkMode) {
    bgColor = "rgba(30, 30, 30, 0.7)";
  }

  Block.standard(cardElementClass, {
    backgroundColor: bgColor,
    svgSize: "0px",
  });

  let customSpinnerHTML = `
    <div class="sk-wave mx-auto">
        <div class="sk-rect sk-wave-rect"></div>
        <div class="sk-rect sk-wave-rect"></div>
        <div class="sk-rect sk-wave-rect"></div>
        <div class="sk-rect sk-wave-rect"></div>
        <div class="sk-rect sk-wave-rect"></div>
    </div>
  `;

  let notiflixBlockElement = document.querySelector(cardElementClass + " .notiflix-block");

  if (notiflixBlockElement) {
    notiflixBlockElement.innerHTML = customSpinnerHTML;
  }
}

function unblockCard() {
  let cardElementClass = ".card";

  Block.remove(cardElementClass);
}

function blockElement(element: string) {
  let isDarkMode = false;

  if (document.documentElement.getAttribute("data-bs-theme") === "dark") {
    isDarkMode = true;
  }

  let bgColor = "rgba(" + window.Helpers.getCssVar("black-rgb") + ", 0.5)";

  if (isDarkMode) {
    bgColor = "rgba(30, 30, 30, 0.7)";
  }

  Block.standard(element, {
    backgroundColor: bgColor,
    svgSize: "0px",
  });

  let customSpinnerHTML = `
    <div class="sk-wave mx-auto">
        <div class="sk-rect sk-wave-rect"></div>
        <div class="sk-rect sk-wave-rect"></div>
        <div class="sk-rect sk-wave-rect"></div>
        <div class="sk-rect sk-wave-rect"></div>
        <div class="sk-rect sk-wave-rect"></div>
    </div>
  `;

  let notiflixBlockElement = document.querySelector(element + " .notiflix-block");

  if (notiflixBlockElement) {
    notiflixBlockElement.innerHTML = customSpinnerHTML;
  }
}

function unblockElement(element: string) {
  Block.remove(element);
}

export { blockCard, unblockCard, blockElement, unblockElement };
