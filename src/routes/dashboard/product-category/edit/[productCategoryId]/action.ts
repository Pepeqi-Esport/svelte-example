import Swal, { type SweetAlertResult } from "sweetalert2";

import ProductCategoryApi from "$lib/api/product_category_api";

import { notifyDanger, notifySuccess } from "$lib/utils/izi_toast";

import { blockCard, unblockCard } from "$lib/utils/block_ui";

type FormValidationInstance = {
  resetForm: (reset?: boolean) => void;
} | null;

async function fetchData(productCategoryId: number) {
  let payload = {
    productCategoryId: productCategoryId,
  };

  let response = await ProductCategoryApi.detailProductCategory(payload);

  return response;
}

async function updateData(editForm: Record<any, any>, fv: FormValidationInstance) {
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

      let result = await ProductCategoryApi.updateProductCategory({
        productCategoryId: editForm.productCategoryId,
        name: editForm.name,
        description: editForm.description,
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

export { fetchData, updateData };
