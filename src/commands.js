import axios from "axios";
import FormData from "form-data";
var Buffer = require("@craftzdog/react-native-buffer").Buffer;

const stabilityAPI = "dreamboot api";

async function stabilityAITxt2Img(
  prompt,

  refImage
) {
  console.log("The prompt is", prompt);
  console.log("The refImage is", refImage);

  if (refImage == null) {
    console.log("refImage is null");

    let response = await axios(
      "https://api.stability.ai/v1alpha/generation/stable-diffusion-768-v2-1/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: stabilityAPI,
        },
        data: {
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
        },
      }
    )
      .then((response) => response.data)
      .then(function (data) {
        return data["artifacts"][0]["base64"];
      })
      .catch(function (error) {
        console.log(error);
      });

    return response;
  } else {
    console.log("refImage is", refImage);

    var data = new FormData();
    data.append("init_image", Buffer.from(refImage, "binary"));

    data.append(
      "options",
      JSON.stringify({
        cfg_scale: 7.5,
        clip_guidance_preset: "FAST_BLUE",
        step_schedule_start: 0.6,
        step_schedule_end: 0.01,
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
    /*
      var config = {
        method: "post",
        url: "https://api.stability.ai/v1alpha/generation/stable-diffusion-768-v2-1/image-to-image",
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: stabilityAPI,
        },
        data: data,
      };
      let response = axios(config)
        .then((response) => response.data)
        .then(function (data) {
          return data["artifacts"][0]["base64"];
        })
        .catch(function (error) {
          console.log(error);
        });
  
      return response;
    }*/

    console.log("checking response");
    let response = await fetch(
      "https://api.stability.ai/v1alpha/generation/stable-diffusion-768-v2-1/image-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: stabilityAPI,
        },
        body: data,
      }
    );

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }
    return await response.text()["artifacts"][0]["base64"];
  }
}

module.exports = {
  stabilityAITxt2Img,
};
