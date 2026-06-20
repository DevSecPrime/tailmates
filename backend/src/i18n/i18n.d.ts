declare module 'i18next' {
  interface CustomTypeOptions {
    // allow any string as key
    resources: {
      translation: Record<string, string>;
    };
  }
}
