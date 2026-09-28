import Swal, { type SweetAlertResult } from "sweetalert2";

import ProductApi from "$lib/api/product_api";
import ProductCategoryApi from "$lib/api/product_category_api";

import FormatterHelper from "$lib/helpers/formatter_helper";

import { blockCard, unblockCard } from "$lib/utils/block_ui";
import { notifyDanger, notifySuccess } from "$lib/utils/izi_toast";

type FormValidationInstance = {
  resetForm: (reset?: boolean) => void;
} | null;

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

async function fetchData(productId: number) {
  let payload = {
    productId: productId,
  };

  let response = await ProductApi.detailProduct(payload);

  return response;
}

async function editData(form: Record<any, any>, fv: FormValidationInstance) {
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

      let price = FormatterHelper.convertToInteger(form.price);
      let publishedAt = form.publishedAt + ":00";

      let result = await ProductApi.updateProduct({
        productId: form.productId,
        productCategoryId: form.productCategoryId,
        name: form.name,
        description: form.description,
        price: price,
        publishedAt: publishedAt,
        photoFile: form.photoFile,
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

export { fetchProductCategory, fetchData, editData };
