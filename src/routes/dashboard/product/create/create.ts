import { DateTime } from "luxon";

import ProductCategoryApi from "$lib/api/product_category_api";

import ProductApi from "$lib/api/product_api";

import FormatterHelper from "$lib/helpers/formatter_helper";
import HashHelper from "$lib/helpers/hash_helper";

import { blockCard, unblockCard } from "$lib/utils/block_ui";
import { loadElementDropify } from "$lib/utils/dropify";
import { loadElementDatetimeFlatpickr } from "$lib/utils/flatpickr";
import { notifyDanger, notifySuccess } from "$lib/utils/izi_toast";
import { loadElementQuill } from "$lib/utils/quill";
import { loadElementSelect2 } from "$lib/utils/select2";

let isResettingForm = false;

function validateForm(form: Record<any, any>) {
  let createFormDocumentElement = document.getElementById("createForm");

  let fv = FormValidation.formValidation(createFormDocumentElement, {
    fields: {
      productCategoryId: {
        validators: {
          notEmpty: {
            message: "Pilih kategori terlebih dahulu !",
          },
        },
      },

      name: {
        validators: {
          notEmpty: {
            message: "Nama tidak boleh kosong !",
          },
        },
      },

      description: {
        validators: {
          callback: {
            callback: function (selector: any, validator: any, abort: any) {
              let jQuery = window.jQuery;
              let descriptionElement = jQuery("#description");

              jQuery(".ql-toolbar").removeClass("border-danger border-2");
              jQuery(".ql-container").removeClass("border-danger border-2");

              if (descriptionElement.val() == "" || descriptionElement.val() == "<p><br></p>") {
                jQuery(".ql-toolbar").addClass("border-danger border-2");
                jQuery(".ql-container").addClass("border-danger border-2");

                return {
                  valid: false,
                  message: "Deskripsi tidak boleh kosong !",
                };
              }

              return {
                valid: true,
              };
            },
          },
        },
      },

      price: {
        validators: {
          notEmpty: {
            message: "Harga tidak boleh kosong !",
          },
        },
      },

      publishedAt: {
        validators: {
          callback: {
            callback: function () {
              let jQuery = window.jQuery;
              let publishedAtElement = jQuery("#publishedAt");
              let nextElement = publishedAtElement.next();

              nextElement.removeClass("is-invalid");

              if (publishedAtElement.val() == "") {
                nextElement.addClass("is-invalid");

                return {
                  valid: false,
                  message: "Diterbitkan pada tidak boleh kosong !",
                };
              }

              return {
                valid: true,
              };
            },
          },
        },
      },

      photoFile: {
        validators: {
          callback: {
            callback: function () {
              let jQuery = window.jQuery;
              let photoFileElement = jQuery("#photoFile");

              photoFileElement.parent().removeClass("border-danger border-2");

              if (photoFileElement.val() == "") {
                photoFileElement.parent().addClass("border-danger border-2");

                return {
                  valid: false,
                  message: "Foto tidak boleh kosong !",
                };
              }

              return {
                valid: true,
              };
            },
          },
        },
      },
    },
    plugins: {
      bootstrap5: new FormValidation.plugins.Bootstrap5({
        eleValidClass: "",
        rowSelector: ".mb-3",
      }),
      defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
      trigger: new FormValidation.plugins.Trigger(),
      submitButton: new FormValidation.plugins.SubmitButton(),
    },
    init: (instance: { on: (event: string, handler: (e: { element: HTMLElement; messageElement: HTMLElement }) => void) => void }) => {
      instance.on("plugins.message.placed", function (e) {
        if (e.element.parentElement?.classList.contains("input-group")) {
          e.element.parentElement.insertAdjacentElement("afterend", e.messageElement);
        }
      });
    },
  }).on("core.form.valid", async function () {
    Swal.fire({
      icon: "question",
      text: "Apakah Anda yakin ingin menyimpan data ini ?",
      showCancelButton: true,
      buttonsStyling: false,
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        blockCard();

        let productCategoryId = HashHelper.decrypt(form.productCategoryId);
        let price = FormatterHelper.convertToInteger(form.price);

        let publishedAtDateTime = DateTime.fromFormat(form.publishedAt, "yyyy-MM-dd HH:mm:ss");

        if (!publishedAtDateTime.isValid) {
          publishedAtDateTime = DateTime.fromFormat(form.publishedAt, "yyyy-MM-dd HH:mm");
        }

        let publishedAt = publishedAtDateTime.toFormat("yyyy-MM-dd HH:mm:ss");

        let result = await ProductApi.createProduct({
          productCategoryId: productCategoryId,
          name: form.name,
          description: form.description,
          price: price,
          publishedAt: publishedAt,
          photoFile: form.photoFile,
        });

        unblockCard();

        if (result.status) {
          notifySuccess(result.message);
          resetForm(form, fv);
        } else {
          notifyDanger(result.message);
        }
      }
    });
  });

  let jQuery = window.jQuery;

  let productCategoryIdElement = jQuery("#productCategoryId");
  loadElementSelect2(productCategoryIdElement);
  productCategoryIdElement.on("change.select2", () => {
    form.productCategoryId = productCategoryIdElement.val() ?? "";

    if (!isResettingForm) {
      fv.revalidateField("productCategoryId");
    }
  });

  let quillElement = loadElementQuill("#description-editor");
  quillElement.on("text-change", () => {
    let value = quillElement.root.innerHTML;
    form.description = value;

    if (!isResettingForm) {
      fv.revalidateField("description");
    }
  });

  let publishedAtElement = jQuery("#publishedAt");
  loadElementDatetimeFlatpickr(publishedAtElement);
  publishedAtElement.on("change", () => {
    form.publishedAt = String(publishedAtElement.val() ?? "");

    if (!isResettingForm) {
      fv.revalidateField("publishedAt");
    }
  });

  let photoFileElement = jQuery("#photoFile");
  loadElementDropify(photoFileElement);
  photoFileElement.on("change", () => {
    let input = photoFileElement.get(0) as HTMLInputElement | undefined;
    form.photoFile = input?.files?.[0] ?? null;

    if (!isResettingForm) {
      fv.revalidateField("photoFile");
    }
  });
}

async function fetchProductCategory() {
  let payload = {
    isPaginate: false,
    page: 1,
    perPage: 10,
    orderBy: "name",
    orderType: "asc",
  };

  return await ProductCategoryApi.getProductCategory(payload);
}

function resetForm(form: Record<any, any>, fv?: { resetForm: (reset?: boolean) => void } | null) {
  isResettingForm = true;

  let jQuery = window.jQuery;

  form.productCategoryId = "";
  form.name = "";
  form.description = "";
  form.price = "";
  form.publishedAt = "";
  form.photoFile = null;

  let productCategoryIdElement = jQuery("#productCategoryId");
  productCategoryIdElement.val("").trigger("change.select2");

  let descriptionEditor = document.getElementById("description-editor");
  let quillInstance = descriptionEditor ? Quill.find(descriptionEditor) : null;

  if (quillInstance) {
    quillInstance.setText("", "silent");
  }

  jQuery("#description").val("");
  jQuery(".ql-toolbar").removeClass("border-danger border-2");
  jQuery(".ql-container").removeClass("border-danger border-2");

  let publishedAtElement = jQuery("#publishedAt");
  let flatpickrInstance = (
    publishedAtElement.get(0) as HTMLElement & {
      _flatpickr?: { clear: (triggerChangeEvent?: boolean) => void };
    }
  )?._flatpickr;

  if (flatpickrInstance) {
    flatpickrInstance.clear(false);
  }

  publishedAtElement.next().removeClass("is-invalid");

  let photoFileElement = jQuery("#photoFile");
  let dropifyInstance = photoFileElement.data("dropify") as { clearElement?: () => void } | undefined;

  if (dropifyInstance?.clearElement) {
    dropifyInstance.clearElement();
  }

  photoFileElement.parent().removeClass("border-danger border-2");

  fv?.resetForm(false);
  isResettingForm = false;
}

export { validateForm, fetchProductCategory, resetForm };
