<script lang="ts">
  import { onMount } from "svelte";
  import Swal, { type SweetAlertResult } from "sweetalert2";

  import TableSkeleton from "$lib/components/TableSkeleton.svelte";
  import PaginationTable from "$lib/components/PaginationTable.svelte";

  import HashHelper from "$lib/helpers/hash_helper";

  import { cardAnimate } from "$lib/utils/animate";

  import { deleteData, fetchData } from ".";

  let isLoading = $state(true);

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
      name: "",
    },
  });

  let tableSummary = $derived({
    lastPage: Number(table.pagination.last_page) || 1,
    total: Number(table.pagination.total) || 0,
  });

  async function handlePerPageChange() {
    isLoading = true;
    tableRequest.page = 1;

    let result = await fetchData(tableRequest.page, tableRequest.perPage, tableRequest.orderBy, tableRequest.orderType, tableRequest.filter);

    table.data = result.data;
    table.pagination = result.pagination;

    isLoading = false;
  }

  async function handlePageChange(targetPage: number) {
    isLoading = true;
    tableRequest.page = targetPage;

    let result = await fetchData(tableRequest.page, tableRequest.perPage, tableRequest.orderBy, tableRequest.orderType, tableRequest.filter);

    table.data = result.data;
    table.pagination = result.pagination;

    isLoading = false;
  }

  async function handleFilter(event: SubmitEvent) {
    event.preventDefault();

    let filterModal = document.getElementById("filterModal");

    if (filterModal) {
      let modal = bootstrap.Modal.getInstance(filterModal) || new bootstrap.Modal(filterModal);
      modal.hide();
    }

    isLoading = true;
    tableRequest.page = 1;

    let result = await fetchData(tableRequest.page, tableRequest.perPage, tableRequest.orderBy, tableRequest.orderType, tableRequest.filter);

    table.data = result.data;
    table.pagination = result.pagination;

    isLoading = false;
  }

  async function handleDelete(productCategoryId: string) {
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
        await deleteData(productCategoryId);

        isLoading = true;
        tableRequest.page = 1;

        let result = await fetchData(tableRequest.page, tableRequest.perPage, tableRequest.orderBy, tableRequest.orderType, tableRequest.filter);

        table.data = result.data;
        table.pagination = result.pagination;

        isLoading = false;
      }
    });
  }

  onMount(async () => {
    isLoading = true;

    let result = await fetchData(tableRequest.page, tableRequest.perPage, tableRequest.orderBy, tableRequest.orderType, tableRequest.filter);

    table.data = result.data;
    table.pagination = result.pagination;

    isLoading = false;
  });
</script>

<div class="row">
  <div class="col-xl">
    <div class="card {cardAnimate}">
      <div class="card-header bg-label-primary d-flex justify-content-sm-between align-items-sm-center flex-column flex-sm-row">
        <h5 class="card-title mb-sm-0">Tabel Kategori Produk</h5>

        <div>
          <button type="button" class="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#filterModal">
            <i class="icon-base ti tabler-filter me-1"></i>
            Filter
          </button>

          <a href="/dashboard/product-category/create">
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
            <option value={1}>1</option>
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

                <th> Nama </th>

                <th> Aksi </th>
              </tr>
            </thead>

            {#if isLoading}
              <TableSkeleton row={tableRequest.perPage} columns={3} />
            {:else}
              <tbody class="text-center">
                {#if table.data.length > 0}
                  {#each table.data as row, index}
                    <tr>
                      <td class="text-center">
                        {index + 1}
                      </td>

                      <td>
                        {row.name}
                      </td>

                      <td>
                        <div class="dropdown">
                          <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown" aria-label="Menu aksi">
                            <i class="icon-base ti tabler-dots-vertical"></i>
                          </button>

                          <div class="dropdown-menu">
                            <a class="dropdown-item text-success" href="/dashboard/product-category/edit/{HashHelper.encrypt(row.id)}">
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
                    <td colspan="3" class="text-center">Tidak ada data yang tersedia pada tabel ini</td>
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
