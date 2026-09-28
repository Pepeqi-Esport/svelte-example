import ProductApi from "$lib/api/product_api";
import ProductCategoryApi from "$lib/api/product_category_api";

async function fetchData() {
  let payload = {
    isPaginate: true,
    page: 1,
    perPage: 10,
    orderBy: "name",
    orderType: "asc",
  };

  let product = 0;
  let productCategory = 0;

  let response = await ProductApi.getProduct(payload);

  if (response.status) {
    product = response.pagination.total;
  }

  response = await ProductCategoryApi.getProductCategory(payload);

  if (response.status) {
    productCategory = response.pagination.total;
  }

  return {
    product: product,
    productCategory: productCategory,
  };
}

export { fetchData };
