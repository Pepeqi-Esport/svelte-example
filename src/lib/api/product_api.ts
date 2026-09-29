import axios from "axios";

import AuthHelper from "$lib/helpers/auth_helper";
import CheckHelper from "$lib/helpers/check_helper";

let API_URL = import.meta.env.VITE_API_URL;

export default class ProductApi {
  /**
   ** Get product
   *
   * @param request
   * @return object
   */
  public static async getProduct(request: any) {
    let url = `${API_URL}/api/product`;

    let session = AuthHelper.getSession();
    let token = session.token;

    let params = {
      is_paginate: request.isPaginate,
      page: request.page,
      per_page: request.perPage,
      order_by: request.orderBy,
      order_type: request.orderType,
      ...CheckHelper.isset(request.filter) && {
        filter: request.filter,
      },
    };

    return await axios.get(url, {
      params: params,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }).then(res => {
      return res.data;
    }).catch(err => {
      return err.response.data;
    });
  }

  /**
   ** Detail product
   *
   * @param request
   * @return object
   */
  public static async detailProduct(request: any) {
    let url = `${API_URL}/api/product/detail`;

    let session = AuthHelper.getSession();
    let token = session.token;

    let params = {
      product_id: request.productId,
    };

    return await axios.get(url, {
      params: params,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }).then(res => {
      return res.data;
    }).catch(err => {
      return err.response.data;
    });
  }

  /**
  ** Create product
  *
  * @param request
  * @return object
  */
  public static async createProduct(request: any) {
    let url = `${API_URL}/api/product/create`;

    let session = AuthHelper.getSession();
    let token = session.token;

    let formData = new FormData();

    formData.append('product_category_id', String(request.productCategoryId));
    formData.append('name', request.name);
    formData.append('description', request.description);
    formData.append('price', String(request.price));
    formData.append('published_at', request.publishedAt);

    if (request.photoFile) {
      formData.append('photo_file', request.photoFile);
    }

    return await axios.post(url, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }).then(res => {
      return res.data;
    }).catch(err => {
      return err.response.data;
    });
  }

  /**
 ** Update product
 *
 * @param request
 * @return object
 */
  public static async updateProduct(request: any) {
    let url = `${API_URL}/api/product/update`;

    let session = AuthHelper.getSession();
    let token = session.token;

    let formData = new FormData();

    formData.append('product_id', request.productId);
    formData.append('product_category_id', request.productCategoryId);
    formData.append('name', request.name);
    formData.append('description', request.description);
    formData.append('price', request.price);
    formData.append('published_at', request.publishedAt);

    if (request.photoFile) {
      formData.append('photo_file', request.photoFile);
    }

    return await axios.post(url, formData, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }).then(res => {
      return res.data;
    }).catch(err => {
      return err.response.data;
    });
  }

  /**
 ** Delete product
 *
 * @param request
 * @return object
 */
  public static async deleteProduct(request: any) {
    let url = `${API_URL}/api/product/delete`;

    let session = AuthHelper.getSession();
    let token = session.token;

    let params = {
      product_id: request.productId,
    };

    return await axios.delete(url, {
      params: params,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    }).then(res => {
      return res.data;
    }).catch(err => {
      return err.response.data;
    });
  }
}
