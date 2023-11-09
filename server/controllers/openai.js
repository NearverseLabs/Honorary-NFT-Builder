import dotenv from "dotenv";
import { openai } from "../index.js";
import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import Jimp from "jimp";

import { fileURLToPath } from "url";
import { model } from "mongoose";
import CountModel from "../CountModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const sampleRespone = {
  created: 1699436111,
  data: [
    {
      revised_prompt:
        "An image of a Siamese cat with white fur, sleek and lean in body structure. Its eyes are a deep, mesmerizing blue, standing out strikingly against the light fur. It's posed in a relaxed posture, showcasing its regal nature and elegance.",
      url: "https://oaidalleapiprodscus.blob.core.windows.net/private/org-6cR1k90WUMwY9QUS6Qx3rmSu/user-cAv2x8m9eJ9n1m9GO6YwQuDC/img-Qyl3Qhvo5tYyCj5jI0qaNRkB.png?st=2023-11-08T08%3A35%3A11Z&se=2023-11-08T10%3A35%3A11Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-11-08T04%3A33%3A23Z&ske=2023-11-09T04%3A33%3A23Z&sks=b&skv=2021-08-06&sig=c4ogNygPH6iFdKFpk8E1SdQmvIGKIOAcPOktpDo6xJg%3D",
    },
  ],
};

export const dalle = async (req, res) => {
  try {
    const { prompt } = req.body;
    let check = false;
    for (let i = 0; i <= textPrompt.length; i++) {
      const textPromLen = textPrompt[i].length;
      const subText = prompt.substring(0, textPromLen);
      if (textPrompt[i] === subText) {
        check = true;
        break;
      }
    }

    if (check === false) {
      res.status(200).json({
        photo: "You are under surveillance don't try to mess with the API :)",
      });
      return;
    }

    const response = await openai.createImage({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    const image_url = response.data;
    // console.log(image_url);
    const _id = "6533d9aef7df2cc4158c5706";
    // update the count by one with this id
    await CountModel.findByIdAndUpdate(_id, {
      $inc: { count: 1 },
    });

    res.status(200).json({ photo: response.data });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

const textPrompt = [
  "Craft an epic portrait, optimized to Twitter Profile picture aspect ratio, showcasing an adorable animated-male-baby-fox in a Pixar style.",
  "Create an epic portrait with a Disney style, optimized to Twitter Profile picture aspect ratio, featuring an adorable animated-male-baby-fox.",
  "Develop an epic portrait, optimized to Twitter Profile picture aspect ratio, capturing the charm of an adorable animated-male-baby-fox in a Looney-Tunes style.",
  "Generate an epic portrait, featuring an adorable animated-male-baby-fox, with a Pixar style that is optimized to Twitter Profile picture aspect ratio.",
  "Produce an epic portrait in a Disney style, optimized to Twitter Profile picture aspect ratio, showcasing the irresistible appeal of an adorable animated-male-baby-fox.",
  "Design an epic portrait, optimized to Twitter Profile picture aspect ratio, presenting an adorable animated-male-baby-fox in a Looney-Tunes style.",
  "Illustrate an epic portrait with a Disney style, featuring an adorable animated-male-baby-fox, optimized to Twitter Profile picture aspect ratio.",
  "Craft an epic portrait, capturing the essence of an adorable animated-male-baby-fox, in a Pixar style optimized to Twitter Profile picture aspect ratio.",
  "Create an epic portrait in a Disney style, optimized to Twitter Profile picture aspect ratio, portraying the lovable animated-male-baby-fox.",
  "Develop an epic portrait, featuring an adorable animated-male-baby-fox, with a Pixar style that is optimized to Twitter Profile picture aspect ratio.",
  "Generate an epic portrait in a Pixar style, optimized to Twitter Profile picture aspect ratio, showcasing the delightful animated-male-baby-fox.",
  "Produce an epic portrait, optimized to Twitter Profile picture aspect ratio, presenting an adorable animated-male-baby-fox in a Looney-Tunes style.",
  "Design an epic portrait with a Pixar style, featuring an adorable animated-male-baby-fox, optimized to Twitter Profile picture aspect ratio.",
  "Illustrate an epic portrait, capturing the captivating charm of an adorable animated-male-baby-fox, in a Disney style optimized to Twitter Profile picture aspect ratio.",
  "Craft an epic portrait in a Looney-Tunes style, optimized to Twitter Profile picture aspect ratio, showcasing the irresistible animated-male-baby-fox.",
  "Create an epic portrait, featuring an adorable animated-male-baby-fox, with a Disney style that is optimized to Twitter Profile picture aspect ratio.",
  "Develop an epic portrait in a Pixar style, optimized to Twitter Profile picture aspect ratio, portraying the endearing animated-male-baby-fox.",
  "Generate an epic portrait, optimized to Twitter Profile picture aspect ratio, presenting an adorable animated-male-baby-fox in a Disney style.",
  "Produce an epic portrait with a Looney-Tunes style, featuring an adorable animated-male-baby-fox, optimized to Twitter Profile picture aspect ratio.",
  "Design an epic portrait, capturing the essence of an adorable animated-male-baby-fox, in a Pixar style optimized to Twitter Profile picture aspect ratio.",
];
