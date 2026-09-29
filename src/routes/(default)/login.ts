import { goto } from "$app/navigation";

import AuthApi from "$lib/api/auth_api";

import AuthHelper from "$lib/helpers/auth_helper";

import { blockCard, unblockCard } from "$lib/utils/block_ui";
import { notifyDanger } from "$lib/utils/izi_toast";

function validateForm(form: Record<any, any>) {
  let loginFormDocumentElement = document.getElementById("loginForm");

  FormValidation.formValidation(loginFormDocumentElement, {
    fields: {
      email: {
        validators: {
          notEmpty: {
            message: "Email tidak boleh kosong !",
          },

          emailAddress: {
            message: "Format email tidak valid !",
          },
        },
      },

      password: {
        validators: {
          notEmpty: {
            message: "Password tidak boleh kosong !",
          },
        },
      },
    },
    plugins: {
      bootstrap5: new FormValidation.plugins.Bootstrap5({
        eleValidClass: "",
        rowSelector: ".mb-3",
      }),
      defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
      trigger: new FormValidation.plugins.Trigger(),
      submitButton: new FormValidation.plugins.SubmitButton(),
    },
    init: (instance: { on: (event: string, handler: (e: { element: HTMLElement; messageElement: HTMLElement }) => void) => void }) => {
      instance.on("plugins.message.placed", function (e) {
        if (e.element.parentElement?.classList.contains("input-group")) {
          e.element.parentElement.insertAdjacentElement("afterend", e.messageElement);
        }
      });
    },
  }).on("core.form.valid", async function () {
    blockCard();

    let result = await AuthApi.login({
      email: form.email,
      password: form.password,
    });

    unblockCard();

    if (result.status) {
      let user = result.data;
      let token = result.token.access_token;
      let expiredAt = result.token.expired_at;

      AuthHelper.saveSession(user, token, expiredAt);

      await goto("/dashboard/home");
    } else {
      notifyDanger(result.error[0].message);
    }
  });
}

function visiblePassword() {
  let jQuery = window.jQuery;

  let passwordElement = jQuery("#password");
  let passwordIconElement = jQuery("#password-icon");
  let originalType = passwordElement.data("original-type");

  if (originalType == "password") {
    passwordElement.attr("type", "text");
    passwordElement.data("original-type", "text");
    passwordIconElement.attr("class", "icon-base ti tabler-eye");
  } else {
    passwordElement.attr("type", "password");
    passwordElement.data("original-type", "password");
    passwordIconElement.attr("class", "icon-base ti tabler-eye-off");
  }
}

export { validateForm, visiblePassword };
