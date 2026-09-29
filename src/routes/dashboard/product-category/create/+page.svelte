<script lang="ts">
  import { onMount } from "svelte";

  import { cardAnimate } from "$lib/utils/animate";

  import { validateForm } from "./create";

  let form = $state({
    name: "",
    description: "",
  });

  onMount(() => {
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

                <input type="text" class="form-control" name="name" id="name" bind:value={form.name} placeholder="Masukkan Nama" autocomplete="off" />
              </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="description"> Deskripsi </label>

                <textarea
                  class="form-control"
                  name="description"
                  id="description"
                  bind:value={form.description}
                  placeholder="Masukkan Deskripsi"
                  autocomplete="off"
                  cols="30"
                  rows="5"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</div>
