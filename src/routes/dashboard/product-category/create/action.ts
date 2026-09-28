import ProductCategoryApi from "$lib/api/product_category_api";

import { blockCard, unblockCard } from "$lib/utils/block_ui";
import { notifyDanger, notifySuccess } from "$lib/utils/izi_toast";
import Swal, { type SweetAlertResult } from "sweetalert2";

type FormValidationInstance = {
  resetForm: (reset?: boolean) => void;
} | null;

async function createData(createForm: Record<any, any>, fv: FormValidationInstance) {
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

      let result = await ProductCategoryApi.createProductCategory({
        name: createForm.name,
        description: createForm.description,
      });

      unblockCard();

      if (result.status) {
        notifySuccess(result.message);

        resetForm(createForm);
      } else {
        notifyDanger(result.error[0].message);
      }
    }
  });
}

function resetForm(createForm: Record<any, any>) {
  createForm.name = "";
  createForm.description = "";
}

export { createData, resetForm };
