<script lang="ts">
  import { onMount, tick } from "svelte";
  import Swal, { type SweetAlertResult } from "sweetalert2";

  import TableSkeleton from "$lib/components/TableSkeleton.svelte";
  import PaginationTable from "$lib/components/PaginationTable.svelte";

  import FormatterHelper from "$lib/helpers/formatter_helper";
  import HashHelper from "$lib/helpers/hash_helper";

  import { cardAnimate } from "$lib/utils/animate";
  import { formatNumberElement } from "$lib/utils/formatter";
  import { loadRegex } from "$lib/utils/regex";
  import "$lib/utils/select2_translation";

  import { fetchProductCategory, fetchData, deleteData, productCategorySelect2 } from "./index";

  let isLoading = $state(true);

  let productCategory = $state<any[]>([]);

  let table = $state({
    data: <any[]>[],
    pagination: <any>{},
  });

  let tableRequest = $state({
    page: 1,
    perPage: 10,
    orderBy: "name",
    orderType: "asc",
    filter: {
      productCategoryId: "",
      name: "",
      price: "",
    },
  });

  let tableSummary = $derived({
    lastPage: Number(table.pagination.last_page) || 1,
    total: Number(table.pagination.total) || 0,
  });

  async function handlePageChange(targetPage: number) {
    isLoading = true;
    tableRequest.page = targetPage;

    let result = await fetchData(tableRequest);

    table.data = result.data;
    table.pagination = result.pagination;

    isLoading = false;
  }

  async function handlePerPageChange() {
    isLoading = true;
    tableRequest.page = 1;

    let result = await fetchData(tableRequest);

    table.data = result.data;
    table.pagination = result.pagination;

    isLoading = false;
  }

  async function handleFilter(e: SubmitEvent) {
    e.preventDefault();

    let filterModal = document.getElementById("filterModal");

    if (filterModal) {
      let modal = bootstrap.Modal.getInstance(filterModal) || new bootstrap.Modal(filterModal);
      modal.hide();
    }

    isLoading = true;
    tableRequest.page = 1;

    let result = await fetchData(tableRequest);

    table.data = result.data;
    table.pagination = result.pagination;

    isLoading = false;
  }

  async function handleDelete(productId: string) {
    Swal.fire({
      icon: "question",
      text: "Apakah Anda yakin ingin menghapus data ini ?",
      showCancelButton: true,
      buttonsStyling: false,
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        await deleteData(productId);

        isLoading = true;
        tableRequest.page = 1;

        let result = await fetchData(tableRequest);

        table.data = result.data;
        table.pagination = result.pagination;

        isLoading = false;
      }
    });
  }

  onMount(async () => {
    isLoading = true;

    let result = await fetchProductCategory();

    productCategory = result.data;

    result = await fetchData(tableRequest);

    table.data = result.data;
    table.pagination = result.pagination;

    isLoading = false;

    await tick();

    loadRegex();

    productCategorySelect2(tableRequest);
  });
</script>

<div class="row">
  <div class="col-xl">
    <div class="card {cardAnimate}">
      <div class="card-header bg-label-primary d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row">
        <h5 class="card-title mb-sm-0">Tabel Produk</h5>

        <div>
          <button type="button" class="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#filterModal">
            <i class="icon-base ti tabler-filter me-1"></i>
            Filter
          </button>

          <a href="/dashboard/product/create">
            <button type="button" class="btn btn-primary">
              <i class="icon-base ti tabler-plus me-1"></i>
              Tambah
            </button>
          </a>
        </div>
      </div>

      <div class="card-body">
        <div class="d-flex align-items-center gap-2">
          <label class="form-label mb-0" for="perPage">Tampilkan</label>

          <select class="form-select w-auto" id="perPage" bind:value={tableRequest.perPage} onchange={handlePerPageChange}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <span class="text-muted">entri</span>
        </div>

        <div class="table-responsive">
          <table class="table table-bordered mt-5">
            <thead class="text-center">
              <tr>
                <th> No </th>

                <th> Kategori </th>

                <th> Nama </th>

                <th> Harga </th>

                <th> Diterbitkan Pada </th>

                <th> Foto </th>

                <th> Aksi </th>
              </tr>
            </thead>

            {#if isLoading}
              <TableSkeleton row={tableRequest.perPage} columns={7} />
            {:else}
              <tbody class="text-center">
                {#if table.data.length > 0}
                  {#each table.data as row, index}
                    <tr>
                      <td class="text-center">
                        {index + 1}
                      </td>

                      <td>
                        {row.product_category.name}
                      </td>

                      <td>
                        {row.name}
                      </td>

                      <td>
                        {FormatterHelper.formatNumber(row.price, true)}
                      </td>

                      <td>
                        {FormatterHelper.formatDatetime(row.published_at)}
                      </td>

                      <td>
                        {#if row.photo_file_url}
                          <a class="btn btn-sm btn-info" href={row.photo_file_url} data-lightbox="product-photo" data-title={row.name} aria-label="Lihat Foto">
                            <i class="icon-base ti tabler-photo"></i>
                          </a>
                        {:else}
                          <span class="text-muted">-</span>
                        {/if}
                      </td>

                      <td>
                        <div class="dropdown">
                          <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-label="Menu aksi">
                            <i class="icon-base ti tabler-dots-vertical"></i>
                          </button>

                          <div class="dropdown-menu">
                            <a class="dropdown-item text-success" href="/dashboard/product/edit/{HashHelper.encrypt(row.id)}">
                              <i class="icon-base ti tabler-edit me-1"></i>
                              Ubah
                            </a>

                            <!-- svelte-ignore a11y_invalid_attribute -->
                            <a class="dropdown-item text-danger" href="javascript:void(0);" onclick={() => handleDelete(HashHelper.encrypt(row.id))}>
                              <i class="icon-base ti tabler-trash me-1"></i>
                              Hapus
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  {/each}
                {:else}
                  <tr>
                    <td colspan="7" class="text-center">Tidak ada data yang tersedia pada tabel ini</td>
                  </tr>
                {/if}
              </tbody>
            {/if}
          </table>
        </div>
      </div>

      <div class="card-footer">
        <PaginationTable
          {isLoading}
          page={tableRequest.page}
          perPage={tableRequest.perPage}
          lastPage={tableSummary.lastPage}
          total={tableSummary.total}
          fetchData={handlePageChange} />
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="filterModal" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Filter</h5>

        <button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <form id="filterForm" method="GET" action="javascript:void(0)" enctype="multipart/form-data" onsubmit={handleFilter}>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="filterProductCategoryId"> Kategori </label>

                <select
                  class="form-select select2-modal"
                  name="filter[productCategoryId]"
                  id="filterProductCategoryId"
                  bind:value={tableRequest.filter.productCategoryId}>
                  <option value="">Pilih Salah Satu</option>

                  {#each productCategory as row}
                    <option value={HashHelper.encrypt(row.id)}>{row.name}</option>
                  {/each}
                </select>
              </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="filterName"> Nama </label>

                <input
                  type="text"
                  class="form-control"
                  name="filter[name]"
                  id="filterName"
                  bind:value={tableRequest.filter.name}
                  placeholder="Masukkan Nama"
                  autocomplete="off" />
              </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="filterPrice"> Harga </label>

                <div class="input-group">
                  <span class="input-group-text"> Rp </span>

                  <input
                    type="text"
                    class="form-control regex-number"
                    name="filter[price]"
                    id="filterPrice"
                    bind:value={tableRequest.filter.price}
                    onkeyup={(e) => {
                      formatNumberElement(e.currentTarget);
                      tableRequest.filter.price = (e.currentTarget as HTMLInputElement).value;
                    }}
                    onpaste={(e) => {
                      setTimeout(() => {
                        formatNumberElement(e.currentTarget);
                        tableRequest.filter.price = (e.currentTarget as HTMLInputElement).value;
                      }, 0);
                    }}
                    placeholder="Masukkan Harga"
                    autocomplete="off" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            <i class="icon-base ti tabler-x me-1"></i>
            Batal
          </button>

          <button type="submit" class="btn btn-primary">
            <i class="icon-base ti tabler-checkbox me-1"></i>
            Terapkan
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
