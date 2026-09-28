function loadSelect2() {
  let jQuery = window.jQuery;
  let select2Element = jQuery(".select2");

  if (select2Element.length > 0) {
    select2Element.each(function (this: any) {
      let element = jQuery(this);

      element.wrap('<div class="position-relative"></div>').select2({
        language: "id",
        allowClear: true,
        placeholder: "Pilih Salah Satu",
        dropdownParent: element.parent(),
      });
    });
  }
}

function loadElementSelect2(element: any) {
  element.wrap('<div class="position-relative"></div>').select2({
    language: "id",
    allowClear: true,
    placeholder: "Pilih Salah Satu",
    dropdownParent: element.parent(),
  });
}

function loadSelect2Image() {
  let jQuery = window.jQuery;
  let select2ImageElement = jQuery(".select2-image");

  if (select2ImageElement.length > 0) {
    select2ImageElement.each(function (this: any) {
      let element = jQuery(this);

      element.wrap('<div class="position-relative"></div>').select2({
        language: "id",
        allowClear: true,
        placeholder: "Pilih Salah Satu",
        templateResult: _renderImageOption,
        templateSelection: _renderImageOption,
        dropdownParent: element.parent(),
        escapeMarkup: function (es: string) {
          return es;
        },
      });
    });
  }
}

function loadElementSelect2Image(element: any) {
  element.wrap('<div class="position-relative"></div>').select2({
    language: "id",
    allowClear: true,
    placeholder: "Pilih Salah Satu",
    templateResult: _renderImageOption,
    templateSelection: _renderImageOption,
    dropdownParent: element.parent(),
  });
}

function loadSelect2Multiple() {
  let jQuery = window.jQuery;
  let selectMultipleElement = jQuery(".select2-multiple");

  if (selectMultipleElement.length > 0) {
    selectMultipleElement.each(function (this: any) {
      let element = jQuery(this);

      element.wrap('<div class="position-relative"></div>').select2({
        language: "id",
        placeholder: "Pilih Beberapa",
        multiple: true,
        width: "100%",
        dropdownParent: element.parent(),
      });

      _bindSelect2MultipleBackspaceFix(element);
    });
  }
}

function loadElementSelect2Multiple(element: any) {
  element.wrap('<div class="position-relative"></div>').select2({
    language: "id",
    placeholder: "Pilih Beberapa",
    multiple: true,
    width: "100%",
    dropdownParent: element.parent(),
  });

  _bindSelect2MultipleBackspaceFix(element);
}

function loadSelect2Modal() {
  let jQuery = window.jQuery;
  let selectModalElement = jQuery(".select2-modal");

  if (selectModalElement.length > 0) {
    selectModalElement.each(function (this: any) {
      let element = jQuery(this);

      element.select2({
        language: "id",
        allowClear: true,
        placeholder: "Pilih Salah Satu",
        dropdownParent: element.parent(),
      });
    });
  }
}

function loadElementSelect2Modal(element: any) {
  let jQuery = window.jQuery;
  let modal = element.closest(".modal");

  element.select2({
    language: "id",
    allowClear: true,
    placeholder: "Pilih Salah Satu",
    dropdownParent: modal.length ? modal : element.parent(),
  });
}

function loadSelect2MultipleModal() {
  let jQuery = window.jQuery;
  let selectMultipleModalElement = jQuery(".select2-multiple-modal");

  if (selectMultipleModalElement.length > 0) {
    selectMultipleModalElement.each(function (this: any) {
      let element = jQuery(this);

      let modal = element.closest(".modal");

      let initSelect2 = () => {
        if (element.data("select2")) {
          return;
        }

        element.select2({
          language: "id",
          placeholder: "Pilih Beberapa",
          multiple: true,
          width: "100%",
          dropdownParent: modal.length ? modal : element.parent(),
        });

        _bindSelect2MultipleBackspaceFix(element);
      };

      if (modal.length && !modal.hasClass("show")) {
        modal.one("shown.bs.modal", initSelect2);
      } else {
        initSelect2();
      }
    });
  }
}

function loadElementSelect2MultipleModal(element: any) {
  let modal = element.closest(".modal");

  let initSelect2 = () => {
    if (element.data("select2")) {
      return;
    }

    element.select2({
      language: "id",
      placeholder: "Pilih Beberapa",
      multiple: true,
      width: "100%",
      dropdownParent: modal.length ? modal : element.parent(),
    });

    _bindSelect2MultipleBackspaceFix(element);
  };

  if (modal.length && !modal.hasClass("show")) {
    modal.one("shown.bs.modal", initSelect2);
  } else {
    initSelect2();
  }
}

// * =========================================================================================================================
// * Private Function
// * =========================================================================================================================

function _renderImageOption(option: { element: HTMLElement; text: string }) {
  let jQuery = window.jQuery;

  if (!option.element || !jQuery(option.element).data("image")) {
    return option.text;
  }

  let $image = `<span><img src="${jQuery(option.element).data("image")}" class="img-flag" /> ${option.text}</span>`;

  return $image;
}

function _bindSelect2MultipleBackspaceFix(element: any) {
  let syncSearchField = () => {
    let select2Instance = element.data("select2");

    if (!select2Instance) {
      return;
    }

    let searchField = select2Instance.$container.find(".select2-search__field");
    let value = element.val();
    let hasSelection = Array.isArray(value) ? value.length > 0 : Boolean(value);

    searchField.val("");
    searchField.css("width", hasSelection ? "0.75em" : "100%");
  };

  element.on("select2:select select2:unselect", function () {
    setTimeout(syncSearchField, 0);
  });
}

export {
  loadSelect2,
  loadElementSelect2,
  loadSelect2Image,
  loadElementSelect2Image,
  loadSelect2Multiple,
  loadElementSelect2Multiple,
  loadSelect2Modal,
  loadElementSelect2Modal,
  loadSelect2MultipleModal,
  loadElementSelect2MultipleModal,
};
