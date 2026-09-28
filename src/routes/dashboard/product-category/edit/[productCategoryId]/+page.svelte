<script lang="ts">
  import { onMount } from "svelte";

  import { page } from "$app/state";

  import InputSkeleton from "$lib/components/InputSkeleton.svelte";
  import TextareaSkeleton from "$lib/components/TextareaSkeleton.svelte";

  import { cardAnimate } from "$lib/utils/animate";

  import { validateForm, fetchData, updateData } from "./edit";

  let isLoading = $state(true);

  let form = $state({
    productCategoryId: "",
    name: "",
    description: "",
  });

  if (page.params.productCategoryId) {
    form.productCategoryId = page.params.productCategoryId;
  }

  onMount(async () => {
    isLoading = true;

    let result = await fetchData(form.productCategoryId);

    form.name = result.data.name;
    form.description = result.data.description;

    isLoading = false;

    validateForm(async () => {
      await updateData(form);
    });
  });
</script>

<div class="row">
  <div class="col-xl">
    <form id="editForm" method="POST" action="javascript:void(0)" enctype="multipart/form-data">
      <div class="card {cardAnimate}">
        <div class="card-header sticky-element bg-label-primary d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row">
          <h5 class="card-title mb-sm-0">Ubah Data</h5>

          <div class="action-btns">
            <a href="/dashboard/product-category">
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
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
