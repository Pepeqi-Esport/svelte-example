<script lang="ts">
  import { onMount, tick } from "svelte";

  import InputSkeleton from "$lib/components/InputSkeleton.svelte";
  import TextareaSkeleton from "$lib/components/TextareaSkeleton.svelte";

  import HashHelper from "$lib/helpers/hash_helper";

  import { cardAnimate } from "$lib/utils/animate";
  import { formatNumberElement } from "$lib/utils/formatter";
  import { loadRegex } from "$lib/utils/regex";

  import { fetchProductCategory, validateForm } from "./create";

  let isLoading = $state(true);

  let productCategory = $state<any[]>([]);

  let form = $state({
    productCategoryId: "",
    name: "",
    description: "",
    price: "",
    publishedAt: "",
    photoFile: null as File | null,
  });

  onMount(async () => {
    isLoading = true;

    let result = await fetchProductCategory();

    if (result.status) {
      productCategory = result.data;
    }

    isLoading = false;

    await tick();
    loadRegex();

    validateForm(form);
  });
</script>

<div class="row">
  <div class="col-xl">
    <form id="createForm" method="POST" action="javascript:void(0)" enctype="multipart/form-data">
      <div class="card {cardAnimate}">
        <div class="card-header sticky-element bg-label-primary d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row">
          <h5 class="card-title mb-sm-0">Tambah Data</h5>

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
                  <select class="form-select" name="productCategoryId" id="productCategoryId" bind:value={form.productCategoryId}>
                    <option value=""> Pilih salah satu </option>

                    {#each productCategory as row}
                      <option value={HashHelper.encrypt(row.id)}>
                        {row.name}
                      </option>
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
                  <div id="description-editor"></div>

                  <input type="hidden" name="description" id="description" bind:value={form.description} />
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
