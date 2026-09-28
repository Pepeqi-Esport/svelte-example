import ProductApi from "$lib/api/product_api";
import ProductCategoryApi from "$lib/api/product_category_api";

import CheckHelper from "$lib/helpers/check_helper";
import FormatterHelper from "$lib/helpers/formatter_helper";
import HashHelper from "$lib/helpers/hash_helper";

import { blockCard, unblockCard } from "$lib/utils/block_ui";
import { notifyDanger, notifySuccess } from "$lib/utils/izi_toast";
import { loadElementSelect2Modal } from "$lib/utils/select2";

async function fetchProductCategory() {
  let payload = {
    isPaginate: false,
    page: 1,
    perPage: 10,
    orderBy: "name",
    orderType: "asc",
  };

  let response = await ProductCategoryApi.getProductCategory(payload);

  return response;
}

async function fetchData(page: number, perPage: number, orderBy: string, orderType: string, filterForm: Record<any, any>) {
  let filterPayload: Record<any, any> = {};

  if (CheckHelper.isset(filterForm.productCategoryId)) {
    let productCategoryId = HashHelper.decrypt(filterForm.productCategoryId);

    filterPayload.product_category_id = String(productCategoryId);
  }

  if (CheckHelper.isset(filterForm.name)) {
    filterPayload.name = filterForm.name;
  }

  if (CheckHelper.isset(filterForm.price)) {
    let price = FormatterHelper.convertToInteger(filterForm.price);

    filterPayload.price = price;
  }

  let payload = {
    isPaginate: true,
    page: page,
    perPage: perPage,
    orderBy: orderBy,
    orderType: orderType,
    ...(Object.keys(filterPayload).length > 0 && {
      filter: filterPayload,
    }),
  };

  let response = await ProductApi.getProduct(payload);

  return response;
}

async function deleteData(id: string) {
  let productId = HashHelper.decrypt(id);

  let payload = {
    productId: productId,
  };

  blockCard();

  let response = await ProductApi.deleteProduct(payload);

  unblockCard();

  if (response.status) {
    notifySuccess(response.message);
  } else {
    notifyDanger(response.message);
  }
}

function productCategorySelect2(tableRequest: Record<any, any>) {
  let jQuery = window.jQuery;
  let filterProductCategoryIdElement = jQuery("#filterProductCategoryId");

  if (!filterProductCategoryIdElement.length) {
    return;
  };

  loadElementSelect2Modal(filterProductCategoryIdElement);

  filterProductCategoryIdElement.on("change", () => {
    let value = String(filterProductCategoryIdElement.val() ?? "");

    tableRequest.filter.productCategoryId = value;
  });
}

export { fetchProductCategory, fetchData, deleteData, productCategorySelect2 };
