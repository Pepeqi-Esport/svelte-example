import ProductCategoryApi from "$lib/api/product_category_api";

import CheckHelper from "$lib/helpers/check_helper";
import HashHelper from "$lib/helpers/hash_helper";

import { blockCard, unblockCard } from "$lib/utils/block_ui";

import { notifyDanger, notifySuccess } from "$lib/utils/izi_toast";

async function fetchData(request: Record<any, any>) {
  let filterPayload: Record<any, any> = {};

  if (CheckHelper.isset(request.filter.name)) {
    filterPayload.name = request.filter.name;
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

  let response = await ProductCategoryApi.getProductCategory(payload);

  return response;
}

async function deleteData(hashId: string) {
  let productCategoryId = HashHelper.decrypt(hashId);

  let payload = {
    productCategoryId: productCategoryId,
  };

  blockCard();

  let response = await ProductCategoryApi.deleteProductCategory(payload);

  unblockCard();

  if (response.status) {
    notifySuccess(response.message);
  } else {
    notifyDanger(response.message);
  }
}

export { fetchData, deleteData };