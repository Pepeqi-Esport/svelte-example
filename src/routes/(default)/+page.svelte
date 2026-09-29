<script lang="ts">
  import { onMount } from "svelte";

  import { cardAnimate } from "$lib/utils/animate";

  import { validateForm, visiblePassword } from "./login";

  let form = $state({
    email: "",
    password: "",
  });

  onMount(() => {
    validateForm(form);
  });
</script>

<div class="authentication-wrapper authentication-basic container-p-y">
  <div class="authentication-inner py-4">
    <div class="card {cardAnimate}">
      <div class="card-body">
        <div class="d-flex justify-content-center mb-2">
          <a href="/">
            <img src="/assets/dashboard/custom/image/logo/logo.png" width="80" alt="Logo" />
          </a>
        </div>

        <form id="loginForm" method="POST" action="javascript:void(0)" enctype="multipart/form-data">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <label class="form-label" for="email">Email</label>

                <input type="email" class="form-control" name="email" id="email" bind:value={form.email} placeholder="Masukkan Email" autocomplete="off" />
              </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3 form-password-toggle">
                <label class="form-label" for="password">Password</label>

                <div class="input-group">
                  <input
                    type="password"
                    class="form-control"
                    name="password"
                    id="password"
                    bind:value={form.password}
                    placeholder="············"
                    data-original-type="password"
                    autocomplete="off" />

                  <button type="button" class="input-group-text cursor-pointer" aria-label="Toggle password visibility" onclick={visiblePassword}>
                    <i class="icon-base ti tabler-eye-off" id="password-icon"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="mb-3">
                <button type="submit" class="btn btn-primary w-100">
                  <i class="icon-base ti tabler-login me-1"></i>
                  Masuk
                </button>
              </div>
            </div>
          </div>
        </form>

        <hr />

        <div class="mb-3">
          <a href="/google/oauth/redirect">
            <button type="button" class="btn btn-secondary w-100">
              <i class="icon-base ti tabler-brand-google me-1"></i>
              Google
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
