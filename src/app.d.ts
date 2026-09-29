// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FormValidation: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bootstrap: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Swal: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Quill: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iziToast: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Block: {
    standard: (selector: string, options?: Record<string, unknown>) => void;
    remove: (selector: string) => void;
  };

  interface JQuery {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select2: ((options?: Record<string, any> | string) => JQuery) & {
      amd?: {
        define: (name: string, deps: string[], factory: () => unknown) => unknown;
        require: unknown;
      };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flatpickr: (options?: Record<string, any>) => any;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dropify: (options?: Record<string, any>) => any;
  }

  interface Window {
    jQuery: JQueryStatic;
    templateName?: string;
    Helpers: {
      getCssVar: (name: string) => string;
      getStoredTheme?: (themeName?: string) => string;
      getPreferredTheme?: (themeName?: string) => string;
      setStoredTheme?: (templateName: string, theme: string) => void;
      setTheme?: (theme: string) => void;
      showActiveTheme?: (theme: string, focus?: boolean) => void;
      syncCustomOptions?: (theme: string) => void;
      switchImage?: (style: string) => void;
    };
  }
}

export { };
