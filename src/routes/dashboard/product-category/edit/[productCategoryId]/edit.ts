import { formValidation } from "@form-validation/core";
import { Bootstrap5 } from "@form-validation/plugin-bootstrap5";
import type { FrameworkOptions } from "@form-validation/plugin-framework";
import { SubmitButton } from "@form-validation/plugin-submit-button";
import { Trigger } from "@form-validation/plugin-trigger";
import { callback } from "@form-validation/validator-callback";
import { emailAddress } from "@form-validation/validator-email-address";
import { notEmpty } from "@form-validation/validator-not-empty";
import Swal, { type SweetAlertResult } from "sweetalert2";

import ProductCategoryApi from "$lib/api/product_category_api";

import HashHelper from "$lib/helpers/hash_helper";

import { blockCard, unblockCard } from "$lib/utils/block_ui";
import { notifyDanger, notifySuccess } from "$lib/utils/izi_toast";

function validateForm(onValid: () => void | Promise<void>) {
  const form = document.getElementById("editForm");

  if (!form) {
    return null;
  };

  return formValidation(form, {
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

async function fetchData(id: string) {
  let productCategoryId = HashHelper.decrypt(id);

  let payload = {
    productCategoryId: productCategoryId,
  };

  let response = await ProductCategoryApi.detailProductCategory(payload);

  return response;
}

async function updateData(form: Record<any, any>) {
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
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      blockCard();

      let productCategoryId = HashHelper.decrypt(form.productCategoryId);

      let result = await ProductCategoryApi.updateProductCategory({
        productCategoryId: productCategoryId,
        name: form.name,
        description: form.description,
      });

      unblockCard();

      if (result.status) {
        notifySuccess(result.message);
      } else {
        notifyDanger(result.error[0].message);
      }
    }
  });
}

export { validateForm, fetchData, updateData };
