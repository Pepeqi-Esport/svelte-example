import ProductCategoryApi from "$lib/api/product_category_api";

import { blockCard, unblockCard } from "$lib/utils/block_ui";
import { notifyDanger, notifySuccess } from "$lib/utils/izi_toast";

function validateForm(form: Record<any, any>) {
  let createFormDocumentElement = document.getElementById("createForm");

  FormValidation.formValidation(createFormDocumentElement, {
    fields: {
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

        let result = await ProductCategoryApi.createProductCategory({
          name: form.name,
          description: form.description,
        });

        unblockCard();

        if (result.status) {
          notifySuccess(result.message);

          resetForm(form);
        } else {
          notifyDanger(result.error[0].message);
        }
      }
    });
  });
}

function resetForm(form: Record<any, any>) {
  form.name = "";
  form.description = "";
}

export { validateForm, resetForm };
