// replicate.js
export async function gerarImagem(prompt, width, height, imageBase64 = null) {
  const replicateApiKey = import.meta.env.VITE_REPLICATE_API_KEY;

  const input = { prompt, width, height };
  if (imageBase64) input.image = imageBase64;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${replicateApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: import.meta.env.VITE_REPLICATE_MODEL_VERSION,
      input,
    }),
  });

  return response.json();
}
