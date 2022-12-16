const STABILITY_API_KEY = "<YOUR-API-KEY-HERE>";

async function fetchFromStabilityAI(
  prompt,
  initImage
) {
  console.log("The prompt is", prompt);
  console.log("The initImage is", initImage);

  if (initImage == null) {
    console.log("Performing text-to-image...");
    return await textToImage(prompt);
  } else {
    console.log("Performing image-to-image...");
    return await imageToImage(prompt, initImage);
  }
}

async function textToImage(prompt) {
  const response = await fetch(
    "https://api.stability.ai/v1alpha/generation/stable-diffusion-768-v2-1/text-to-image",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: STABILITY_API_KEY,
      },
      body: JSON.stringify({
        cfg_scale: 7.5,
        clip_guidance_preset: "FAST_BLUE",
        height: 768,
        width: 768,
        samples: 1,
        sampler: "K_EULER_ANCESTRAL",
        steps: 50,
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
          {
            text: "ugly, asymmetrical, bad anatomy, Unappealing, Unsightly, Unpleasing to the eye, Inelegant, Unbalanced, Awkward, Clumsy, Unrefined, Unpolished, Unshapely, Unattractive, Unflattering, Unaesthetic, Plain, Unimpressive, Unremarkable, Uninteresting, Boring",
            weight: -1,
          },
        ],
      }),
    }
  )


  if (!response.ok) {
    throw new Error(`[text-to-image] Non-200 response: ${await response.text()}`);
  }

  const json = await response.json()

  return json["artifacts"][0]["base64"]
}

async function imageToImage(prompt, initImage) {
  console.log("initImage is", initImage);

  const data = new FormData();

  data.append("init_image", {
    uri: initImage,
    type: "image/png",
    name: "image.png"
  });

  data.append(
    "options",
    JSON.stringify({
      cfg_scale: 7.5,
      clip_guidance_preset: "FAST_BLUE",
      height: 768,
      width: 768,
      steps: 50,
      text_prompts: [
        {
          text: prompt,
          weight: 1,
        },
        {
          text: "ugly, asymmetrical, bad anatomy, Unappealing, Unsightly, Unpleasing to the eye, Inelegant, Unbalanced, Awkward, Clumsy, Unrefined, Unpolished, Unshapely, Unattractive, Unflattering, Unaesthetic, Plain, Unimpressive, Unremarkable, Uninteresting, Boring",
          weight: -1,
        },
      ],
    })
  );

  console.log("checking response");
  const response = await fetch(
    "https://api.stability.ai/v1alpha/generation/stable-diffusion-768-v2-1/image-to-image",
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: STABILITY_API_KEY,
      },
      body: data,
    }
  );

  if (!response.ok) {
    throw new Error(`[image-to-image] Non-200 response: ${await response.text()}`);
  }

  const json = await response.json()

  return json["artifacts"][0]["base64"]
}

module.exports = {
  fetchFromStabilityAI,
};
