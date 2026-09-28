import { goto } from "$app/navigation";

import AuthApi from "$lib/api/auth_api";

import AuthHelper from "$lib/helpers/auth_helper";

import { blockCard, unblockCard } from "$lib/utils/block_ui";
import { notifyDanger } from "$lib/utils/izi_toast";

type LoginForm = {
  email: string;
  password: string;
};

type FormValidationInstance = {
  resetForm: (reset?: boolean) => void;
} | null;

async function authenticate(loginForm: Record<any, any>, fv: FormValidationInstance) {
  blockCard();

  let result = await AuthApi.login({
    email: loginForm.email,
    password: loginForm.password,
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

export { authenticate, visiblePassword };
