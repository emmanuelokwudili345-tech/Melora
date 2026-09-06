import { sdk } from "@audius/sdk";

const apiKey = import.meta.env.VITE_AUDIUS_API_KEY;

if (!apiKey) {
  throw new Error("Audius API key is missing.");
}

export const audiusSdk = sdk({
  apiKey,
});