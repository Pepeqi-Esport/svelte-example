import Swal, { type SweetAlertResult } from "sweetalert2";

import ProductApi from "$lib/api/product_api";
import ProductCategoryApi from "$lib/api/product_category_api";

import FormatterHelper from "$lib/helpers/formatter_helper";
import HashHelper from "$lib/helpers/hash_helper";

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

async function createData(createForm: Record<any, any>, fv: FormValidationInstance) {
  await Swal.fire({
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

      let productCategoryId = HashHelper.decrypt(createForm.productCategoryId);
      let price = FormatterHelper.convertToInteger(createForm.price);
      let publishedAt = createForm.publishedAt + ":00";

      let result = await ProductApi.createProduct({
        productCategoryId: productCategoryId,
        name: createForm.name,
        description: createForm.description,
        price: price,
        publishedAt: publishedAt,
        photoFile: createForm.photoFile,
      });

      unblockCard();

      if (result.status) {
        notifySuccess(result.message);
        resetForm(createForm, fv);
      } else {
        notifyDanger(result.message);
      }
    }
  });
}

function resetForm(createForm: Record<any, any>, fv: FormValidationInstance) {
  createForm.productCategoryId = "";
  createForm.name = "";
  createForm.description = "";
  createForm.price = "";
  createForm.publishedAt = "";
  createForm.photoFile = null;

  let jQuery = window.jQuery;

  let productCategoryIdElement = jQuery("#productCategoryId");
  productCategoryIdElement.val("").trigger("change.select2");

  let publishedAtElement = jQuery("#publishedAt");
  let flatpickrInstance = (
    publishedAtElement.toArray()[0] as HTMLElement & {
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
}

export { fetchProductCategory, createData, resetForm };
