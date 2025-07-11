export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt, width, height, imageBase64 } = req.body;

  if (!prompt || !width || !height) {
    return res.status(400).json({ error: 'Parâmetros ausentes' });
  }

  const replicateApiKey = process.env.REPLICATE_API_KEY;
  const modelVersion = process.env.REPLICATE_MODEL_VERSION;

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${replicateApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: modelVersion,
        input: {
          prompt,
          width,
          height,
          ...(imageBase64 && { image: imageBase64 }),
        },
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar imagem' });
  }
}
