import { loadElementSelect2Modal } from "$lib/utils/select2";

function initSelect2(onChange: (value: string) => void) {
  let jQuery = window.jQuery;
  let filterProductCategoryIdElement = jQuery("#filterProductCategoryId");

  if (!filterProductCategoryIdElement.length) {
    return;
  }

  loadElementSelect2Modal(filterProductCategoryIdElement);

  filterProductCategoryIdElement.on("change", function () {
    onChange(String(filterProductCategoryIdElement.val() ?? ""));
  });
}

export { initSelect2 };
