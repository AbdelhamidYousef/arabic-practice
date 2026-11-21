/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute API origin for builds that do not share the web origin; empty otherwise. */
  readonly VITE_API_URL?: string;
}
