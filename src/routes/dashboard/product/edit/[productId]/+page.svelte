<script lang="ts">
  import { onMount, tick } from "svelte";

  import { page } from "$app/state";
  import InputSkeleton from "$lib/components/InputSkeleton.svelte";
  import TextareaSkeleton from "$lib/components/TextareaSkeleton.svelte";

  import HashHelper from "$lib/helpers/hash_helper";

  import { cardAnimate } from "$lib/utils/animate";
  import { formatNumberElement } from "$lib/utils/formatter";
  import { loadRegex } from "$lib/utils/regex";

  import { fetchData, fetchProductCategory, editData } from "./action";
  import { initDropify, initFlatpickr, initFormValidation, initSelect2 } from "./init";

  let isLoading = $state(true);

  let productCategory = $state<any[]>([]);

  let form = $state({
    productId: 0,
    productCategoryId: 0,
    productCategoryHashId: "",
    productCategoryName: "",
    name: "",
    description: "",
    price: "",
    publishedAt: "",
    photoFile: null as File | null,
    photoFileUrl: "",
  });

  let fv: ReturnType<typeof initFormValidation> = null;

  if (page.params.productId) {
    let productId = HashHelper.decrypt(page.params.productId);

    form.productId = productId;
  }

  onMount(async () => {
    isLoading = true;

    let result = await fetchProductCategory();

    if (result.status) {
      productCategory = result.data;
    }

    result = await fetchData(form.productId);

    let product = result.data;

    let productCategoryHashId = HashHelper.encrypt(product.product_category.id);

    form.productCategoryId = product.product_category.id;
    form.productCategoryHashId = productCategoryHashId;
    form.productCategoryName = product.product_category.name;
    form.name = product.name;
    form.description = product.description;
    form.price = product.price;
    form.publishedAt = product.publishedAt;
    form.photoFileUrl = product.photoFileUrl;

    isLoading = false;

    await tick();
    loadRegex();

    fv = initFormValidation(() => editData(form, fv));

    initSelect2((value) => {
      form.productCategoryHashId = value;
    }, fv);

    initFlatpickr((value) => {
      form.publishedAt = value;
    }, fv);

    initDropify((file) => {
      form.photoFile = file;
    }, fv);
  });
</script>

<div class="row">
  <div class="col-xl">
    <form id="editForm" method="POST" action="javascript:void(0)" enctype="multipart/form-data">
      <div class="card {cardAnimate}">
        <div class="card-header sticky-element bg-label-primary d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row">
          <h5 class="card-title mb-sm-0">Ubah Data</h5>

          <div class="action-btns">
            <a href="/dashboard/product">
              <button type="button" class="btn btn-secondary me-2">
                <i class="icon-base ti tabler-arrow-back-up me-1"></i>
                Kembali
              </button>
            </a>

            <button type="submit" class="btn btn-primary">
              <i class="icon-base ti tabler-checkbox me-1"></i>
              Simpan
            </button>
          </div>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="productCategoryId"> Kategori </label>

                {#if isLoading}
                  <InputSkeleton />
                {:else}
                  <select class="form-select" name="productCategoryId" id="productCategoryId" bind:value={form.productCategoryHashId}>
                    <option value={form.productCategoryHashId}>
                      {form.productCategoryName}
                    </option>

                    {#each productCategory as row}
                      {#if row.id != form.productCategoryId}
                        <option value={HashHelper.encrypt(row.id)}>
                          {row.name}
                        </option>
                      {/if}
                    {/each}
                  </select>
                {/if}
              </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="name"> Nama </label>

                {#if isLoading}
                  <InputSkeleton />
                {:else}
                  <input type="text" class="form-control" name="name" id="name" bind:value={form.name} placeholder="Masukkan Nama" autocomplete="off" />
                {/if}
              </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="description"> Deskripsi </label>

                {#if isLoading}
                  <TextareaSkeleton />
                {:else}
                  <textarea
                    class="form-control"
                    name="description"
                    id="description"
                    bind:value={form.description}
                    placeholder="Masukkan Deskripsi"
                    autocomplete="off"
                    cols="30"
                    rows="5"></textarea>
                {/if}
              </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="price"> Harga </label>

                {#if isLoading}
                  <InputSkeleton />
                {:else}
                  <div class="input-group">
                    <span class="input-group-text"> Rp </span>
                    <input
                      type="text"
                      class="form-control regex-number"
                      name="price"
                      id="price"
                      bind:value={form.price}
                      onkeyup={(e) => {
                        formatNumberElement(e.currentTarget);
                        form.price = (e.currentTarget as HTMLInputElement).value;
                      }}
                      onpaste={(e) => {
                        setTimeout(() => {
                          formatNumberElement(e.currentTarget);
                          form.price = (e.currentTarget as HTMLInputElement).value;
                        }, 0);
                      }}
                      placeholder="Masukkan Harga"
                      autocomplete="off" />
                  </div>
                {/if}
              </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="publishedAt"> Diterbitkan Pada </label>

                {#if isLoading}
                  <InputSkeleton />
                {:else}
                  <input
                    type="text"
                    class="form-control"
                    name="publishedAt"
                    id="publishedAt"
                    bind:value={form.publishedAt}
                    placeholder="Masukkan Diterbitkan Pada"
                    autocomplete="off" />
                {/if}
              </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="photoFile"> Foto </label>

                {#if isLoading}
                  <TextareaSkeleton />
                {:else}
                  <input type="file" name="photoFile" id="photoFile" data-allowed-file-extensions="jpg jpeg png" data-max-file-size="5M" />
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
