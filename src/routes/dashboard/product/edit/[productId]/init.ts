import { formValidation, type Core } from "@form-validation/core";
import { Bootstrap5 } from "@form-validation/plugin-bootstrap5";
import type { FrameworkOptions } from "@form-validation/plugin-framework";
import { SubmitButton } from "@form-validation/plugin-submit-button";
import { Trigger } from "@form-validation/plugin-trigger";
import { callback } from "@form-validation/validator-callback";
import { emailAddress } from "@form-validation/validator-email-address";
import { notEmpty } from "@form-validation/validator-not-empty";

import { loadElementDropify } from "$lib/utils/dropify";
import { loadElementDatetimeFlatpickr } from "$lib/utils/flatpickr";
import { loadElementSelect2 } from "$lib/utils/select2";
import "$lib/utils/select2_translation";

function initFormValidation(onValid: () => void | Promise<void>) {
  const form = document.getElementById("editForm");

  if (!form) {
    return null;
  }

  return formValidation(form, {
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
          notEmpty: {
            message: "Deskripsi tidak boleh kosong !",
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
      bootstrap5: new Bootstrap5({
        eleValidClass: "",
        rowSelector: ".mb-3",
      } as FrameworkOptions),
      trigger: new Trigger(),
      submitButton: new SubmitButton(),
    },
    init: (instance) => {
      instance.registerValidator("callback", callback);
      instance.registerValidator("emailAddress", emailAddress);
      instance.registerValidator("notEmpty", notEmpty);

      instance.on("plugins.message.placed", (e) => {
        const event = e as { element: HTMLElement; messageElement: HTMLElement };

        if (event.element.parentElement?.classList.contains("input-group")) {
          event.element.parentElement.insertAdjacentElement("afterend", event.messageElement);
        }
      });
    },
  }).on("core.form.valid", async () => {
    await onValid();
  });
}

function initSelect2(onChange: (value: string) => void, fv: Core | null) {
  let jQuery = window.jQuery;
  let productCategoryIdElement = jQuery("#productCategoryId");

  if (!productCategoryIdElement.length) {
    return;
  }

  loadElementSelect2(productCategoryIdElement);

  productCategoryIdElement.on("change", function () {
    onChange(String(productCategoryIdElement.val() ?? ""));
    void fv?.revalidateField("productCategoryId");
  });
}

function initFlatpickr(onChange: (value: string) => void, fv: Core | null) {
  let jQuery = window.jQuery;
  let publishedAtElement = jQuery("#publishedAt");

  if (!publishedAtElement.length) {
    return;
  }

  loadElementDatetimeFlatpickr(publishedAtElement);

  publishedAtElement.on("change", function () {
    onChange(String(publishedAtElement.val() ?? ""));
    void fv?.revalidateField("publishedAt");
  });
}

function initDropify(onChange: (file: File | null) => void, fv: Core | null) {
  let jQuery = window.jQuery;
  let photoFileElement = jQuery("#photoFile");

  if (!photoFileElement.length) {
    return;
  }

  loadElementDropify(photoFileElement);

  photoFileElement.on("change", function () {
    let input = photoFileElement.toArray()[0] as HTMLInputElement | undefined;
    onChange(input?.files?.[0] ?? null);
    void fv?.revalidateField("photoFile");
  });
}

export { initFormValidation, initSelect2, initFlatpickr, initDropify };
