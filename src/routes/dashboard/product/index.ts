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

async function fetchData(request: Record<any, any>) {
  let filterPayload: Record<any, any> = {};

  if (CheckHelper.isset(request.filter.productCategoryId)) {
    let productCategoryId = HashHelper.decrypt(request.filter.productCategoryId);

    filterPayload.product_category_id = String(productCategoryId);
  }

  if (CheckHelper.isset(request.filter.name)) {
    filterPayload.name = request.filter.name;
  }

  if (CheckHelper.isset(request.filter.price)) {
    let price = FormatterHelper.convertToInteger(request.filter.price);

    filterPayload.price = price;
  }

  let payload = {
    isPaginate: true,
    page: request.page,
    perPage: request.perPage,
    orderBy: request.orderBy,
    orderType: request.orderType,
    ...(Object.keys(filterPayload).length > 0 && {
      filter: filterPayload,
    }),
  };

  let response = await ProductApi.getProduct(payload);

  return response;
}

async function deleteData(hashId: string) {
  let productId = HashHelper.decrypt(hashId);

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

  loadElementSelect2Modal(filterProductCategoryIdElement);

  filterProductCategoryIdElement.on("change", () => {
    tableRequest.filter.productCategoryId = filterProductCategoryIdElement.val() ?? "";
  });
}

export { fetchProductCategory, fetchData, deleteData, productCategorySelect2 };
