import { formValidation } from "@form-validation/core";
import { Bootstrap5 } from "@form-validation/plugin-bootstrap5";
import type { FrameworkOptions } from "@form-validation/plugin-framework";
import { SubmitButton } from "@form-validation/plugin-submit-button";
import { Trigger } from "@form-validation/plugin-trigger";
import { callback } from "@form-validation/validator-callback";
import { emailAddress } from "@form-validation/validator-email-address";
import { notEmpty } from "@form-validation/validator-not-empty";

import { goto } from "$app/navigation";

import AuthApi from "$lib/api/auth_api";

import AuthHelper from "$lib/helpers/auth_helper";

import { blockCard, unblockCard } from "$lib/utils/block_ui";
import { notifyDanger } from "$lib/utils/izi_toast";

function validateForm(onValid: () => void) {
  let loginFormDocumentElement = document.getElementById("loginForm");

  if (!loginFormDocumentElement) {
    return null;
  };

  return formValidation(loginFormDocumentElement, {
    fields: {
      email: {
        validators: {
          notEmpty: {
            message: "Email tidak boleh kosong !"
          },

          emailAddress: {
            message: "Format email tidak valid !"
          },
        },
      },
      password: {
        validators: {
          notEmpty: {
            message: "Password tidak boleh kosong !"
          },
        },
      },
    },
    plugins: {
      bootstrap5: new Bootstrap5({
        eleValidClass: "",
        rowSelector: ".mb-3",
      } as FrameworkOptions),
      trigger: new Trigger(),
      submitButton: new SubmitButton(),
    },
    init: (instance) => {
      instance.registerValidator("callback", callback);
      instance.registerValidator("emailAddress", emailAddress);
      instance.registerValidator("notEmpty", notEmpty);

      instance.on("plugins.message.placed", (e) => {
        const event = e as { element: HTMLElement; messageElement: HTMLElement };
        if (event.element.parentElement?.classList.contains("input-group")) {
          event.element.parentElement.insertAdjacentElement("afterend", event.messageElement);
        }
      });
    },
  }).on("core.form.valid", async () => {
    onValid();
  });
}

async function authenticate(form: Record<any, any>) {
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

export { validateForm, authenticate, visiblePassword };
