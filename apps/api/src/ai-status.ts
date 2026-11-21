// What the rest of the app needs to know about the AI layer before phase 3 builds it: which
// adapter answers and whether the kill switch is on. The phase-3 provider exposes the same shape,
// so `createApp({ ai })` does not change when it arrives.
export interface AiStatus {
  provider: string;
  enabled: boolean;
}
