<script lang="ts">
  import { onMount } from "svelte";

  import { cardAnimate } from "$lib/utils/animate";

  import { fetchData } from "./home";

  let isLoading = $state(true);

  let summary = $state({
    product: 0,
    productCategory: 0,
  });

  onMount(async () => {
    isLoading = true;

    let data = await fetchData();

    summary.product = data.product;
    summary.productCategory = data.productCategory;

    isLoading = false;
  });
</script>

<div class="row">
  <!-- * Product Category -->
  <div class="col-lg-6 col-md-6 col-sm-12">
    <div class="card {cardAnimate}">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="badge rounded-pill bg-label-info me-3 p-2">
            <i class="icon-base ti tabler-archive"></i>
          </div>

          <div class="card-info">
            <h5 class="mb-0">
              {#if isLoading}
                <span class="placeholder-glow">
                  <span class="placeholder col-12" aria-hidden="true"></span>
                </span>
              {:else}
                {summary.productCategory}
              {/if}
            </h5>

            <small> Kategori Produk </small>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- * Product -->
  <div class="col-lg-6 col-md-6 col-sm-12">
    <div class="card {cardAnimate}">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="badge rounded-pill bg-label-success me-3 p-2">
            <i class="icon-base ti tabler-file-text"></i>
          </div>

          <div class="card-info">
            <h5 class="mb-0">
              {#if isLoading}
                <span class="placeholder-glow">
                  <span class="placeholder col-12" aria-hidden="true"></span>
                </span>
              {:else}
                {summary.product}
              {/if}
            </h5>

            <small> Produk </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
