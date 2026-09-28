import { Block } from "notiflix";

let customSpinnerHTML = `
	<div class="sk-wave mx-auto">
		<div class="sk-rect sk-wave-rect"></div>
		<div class="sk-rect sk-wave-rect"></div>
		<div class="sk-rect sk-wave-rect"></div>
		<div class="sk-rect sk-wave-rect"></div>
		<div class="sk-rect sk-wave-rect"></div>
	</div>
`;

function getBlockBackgroundColor() {
  let isDarkMode = false;

  if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
    isDarkMode = true;
  }

  if (isDarkMode) {
    return 'rgba(30, 30, 30, 0.7)';
  }

  return `rgba(${window.Helpers.getCssVar('black-rgb')}, 0.5)`;
}

function applyCustomSpinner(selector: string) {
  let notiflixBlockElement = document.querySelector(`${selector} .notiflix-block`);

  if (notiflixBlockElement) {
    notiflixBlockElement.innerHTML = customSpinnerHTML;
  }
}

function blockCard() {
  let cardElementClass = '.card';

  Block.standard(cardElementClass, {
    backgroundColor: getBlockBackgroundColor(),
    svgSize: '0px'
  });

  applyCustomSpinner(cardElementClass);
}

function unblockCard() {
  Block.remove('.card');
}

function blockElement(element: string) {
  Block.standard(element, {
    backgroundColor: getBlockBackgroundColor(),
    svgSize: '0px'
  });

  applyCustomSpinner(element);
}

function unblockElement(element: string) {
  Block.remove(element);
}

export { blockCard, unblockCard, blockElement, unblockElement };
