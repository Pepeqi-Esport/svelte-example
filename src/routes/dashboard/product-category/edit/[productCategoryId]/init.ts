import { formValidation } from "@form-validation/core";
import { Bootstrap5 } from "@form-validation/plugin-bootstrap5";
import type { FrameworkOptions } from "@form-validation/plugin-framework";
import { SubmitButton } from "@form-validation/plugin-submit-button";
import { Trigger } from "@form-validation/plugin-trigger";
import { callback } from "@form-validation/validator-callback";
import { emailAddress } from "@form-validation/validator-email-address";
import { notEmpty } from "@form-validation/validator-not-empty";

function initFormValidation(onValid: () => void | Promise<void>) {
  const form = document.getElementById("editForm");

  if (!form) {
    return null;
  };

  return formValidation(form, {
    fields: {
      name: {
        validators: {
          notEmpty: {
            message: "Nama tidak boleh kosong !",
          },
        },
      },

      description: {
        validators: {
          notEmpty: {
            message: "Deskripsi tidak boleh kosong !",
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
    await onValid();
  });
}

export { initFormValidation };
