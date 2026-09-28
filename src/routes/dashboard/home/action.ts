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

  let productCount = 0;
  let productCategoryCount = 0;

  let productResponse = await ProductApi.getProduct(payload);
  let productCategoryResponse = await ProductCategoryApi.getProductCategory(payload);

  if (productResponse.status) {
    productCount = productResponse.pagination.total;
  }

  if (productCategoryResponse.status) {
    productCategoryCount = productCategoryResponse.pagination.total;
  }

  return {
    productCount: productCount,
    productCategoryCount: productCategoryCount,
  };
}

export { fetchData };
