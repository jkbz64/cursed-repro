import { file } from "bun";
import axios from "axios";

import { GlobalFonts, createCanvas, loadImage } from "@napi-rs/canvas";

// If I change this font to other it sometimes fixes the issue too!
import POPPINS_REGULAR from "./Poppins.ttf" with { type: "file" };

// Fonts
GlobalFonts.register(
  Buffer.from(await file(POPPINS_REGULAR).arrayBuffer()),
  "Poppins"
);

const DPI = 3;
const canvas = createCanvas(320 * DPI, 300 * DPI);

const ctx = canvas.getContext("2d");
ctx.translate(0.5, 0.5);

// Background
ctx.fillStyle = "#FFFFFF";
ctx.beginPath();
ctx.rect(0, 0, 320 * DPI, 300 * DPI);
ctx.fill();

// Working text
ctx.font = 'bold 72px "Poppins"';
ctx.fillStyle = "#2B2B2B";
ctx.fillText("wow, i'm fine", 12 * DPI, 42 * DPI);

// FETCH: When i swap to using fetch it seems to work too!
/*
const image = await fetch(
  "https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg"
);
const doge = await loadImage(await image.arrayBuffer());
*/

/* AXIOS: Bricks when using provided font but when i change the font to other it works??? */
const image = await axios({
  method: "get",
  responseType: "arraybuffer",
  url: "https://upload.wikimedia.org/wikipedia/en/5/5f/Original_Doge_meme.jpg",
});
const doge = await loadImage(image.data);

// Let's brick text rendering, wow such breakage
ctx.drawImage(doge, 12 * DPI, 60 * DPI, 80 * DPI, 60 * DPI);

// Bricked text
ctx.font = 'bold 42px "Poppins"';
ctx.fillStyle = "#2B2B2B";
ctx.fillText("wow such corrupt, very bricked", 12 * DPI, 150 * DPI);

const content = await canvas.encode("png");
Bun.write("./out.png", content);
