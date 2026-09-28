import flatpickr from "flatpickr";
import { Indonesian } from "flatpickr/dist/l10n/id.js";

function loadDateFlatpickr() {
  let jQuery = window.jQuery;
  let flatpickrDateElement = jQuery(".flatpickr-date");

  if (flatpickrDateElement.length > 0) {
    flatpickrDateElement.each(function (this: any) {
      flatpickr(this, {
        locale: Indonesian,
        altInput: true,
        dateFormat: "Y-m-d",
        altFormat: "j F Y",
        disableMobile: true,
      });
    });
  }
}

function loadElementDateFlatpickr(element: any) {
  flatpickr(element, {
    locale: Indonesian,
    altInput: true,
    dateFormat: "Y-m-d",
    altFormat: "j F Y",
    disableMobile: true,
  });
}

function loadDatetimeFlatpickr() {
  let jQuery = window.jQuery;
  let flatpickrDatetimeElement = jQuery(".flatpickr-datetime");

  if (flatpickrDatetimeElement.length > 0) {
    flatpickrDatetimeElement.each(function (this: any) {
      flatpickr(this, {
        locale: Indonesian,
        enableTime: true,
        altInput: true,
        dateFormat: "Y-m-d H:i",
        altFormat: "j F Y H:i",
        time_24hr: true,
        disableMobile: true,
      });
    });
  }
}

function loadElementDatetimeFlatpickr(element: any) {
  flatpickr(element, {
    locale: Indonesian,
    enableTime: true,
    altInput: true,
    dateFormat: "Y-m-d H:i",
    altFormat: "j F Y H:i",
    time_24hr: true,
    disableMobile: true,
  });
}

function loadTimeFlatpickr() {
  let jQuery = window.jQuery;
  let flatpickrTimeElement = jQuery(".flatpickr-time");

  if (flatpickrTimeElement.length > 0) {
    flatpickrTimeElement.each(function (this: any) {
      flatpickr(this, {
        locale: Indonesian,
        enableTime: true,
        noCalendar: true,
        altInput: true,
        dateFormat: "H:i",
        altFormat: "H:i",
        time_24hr: true,
        disableMobile: true,
      });
    });
  }
}

function loadElementTimeFlatpickr(element: any) {
  flatpickr(element, {
    locale: Indonesian,
    enableTime: true,
    noCalendar: true,
    altInput: true,
    dateFormat: "H:i",
    altFormat: "H:i",
    time_24hr: true,
    disableMobile: true,
  });
}

export {
  loadDateFlatpickr,
  loadElementDateFlatpickr,
  loadDatetimeFlatpickr,
  loadElementDatetimeFlatpickr,
  loadTimeFlatpickr,
  loadElementTimeFlatpickr,
};
