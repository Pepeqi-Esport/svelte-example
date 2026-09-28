function _getDropifyOptions(element: any) {
  let allowedExtension = element.attr("data-allowed-file-extensions");
  let allowedExtensionText = "";

  if (allowedExtension) {
    let allowedExtensionSplit = allowedExtension.split(" ");
    let allowedExtensionLength = allowedExtensionSplit.length;

    if (allowedExtensionLength > 1) {
      for (let i = 0; i < allowedExtensionLength; i++) {
        if (i < allowedExtensionLength - 1) {
          allowedExtensionText += allowedExtensionSplit[i] + ", ";
        } else {
          allowedExtensionText += " atau " + allowedExtensionSplit[i];
        }
      }
    } else {
      allowedExtensionText = allowedExtension;
    }
  }

  let maxFileSize = element.attr("data-max-file-size");
  let maxFileSizeText = "";

  if (maxFileSize) {
    maxFileSizeText = maxFileSize.replace("K", "KB").replace("M", "MB").replace("G", "GB");
  }

  return {
    messages: {
      default: '<span class="dropify-message-custom"> Klik atau seret dan lepas file di sini </span>',
      replace: '<span class="dropify-message-custom"> Klik atau seret dan lepas file di sini </span>',
      remove: "Hapus",
      link: "Unduh",
      error: "",
    },
    error: {
      fileExtension: "Format file tidak valid (hanya menerima format " + allowedExtensionText + ")",
      fileSize: "Ukuran file terlalu besar (maksimal " + maxFileSizeText + ")",
    },
  };
}

function loadDropify() {
  let jQuery = window.jQuery;
  let dropifyElement = jQuery(".dropify");

  if (dropifyElement.length > 0) {
    dropifyElement.each(function (this: any) {
      let element = jQuery(this);

      element.dropify(_getDropifyOptions(element));
    });
  }
}

function loadElementDropify(element: any) {
  element.dropify(_getDropifyOptions(element));
}

export { loadDropify, loadElementDropify };
