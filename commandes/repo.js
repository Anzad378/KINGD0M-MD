const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou(
  { nomCom: "repo", categorie: "General", reaction: "📚" },
  async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    const { cm } = require(__dirname + "/../framework/zokou");

    try {
      let coms = {};
      let mode = "public";

      // Check bot mode (public or private)
      if ((s.MODE).toLowerCase() !== "yes") {
        mode = "private";
      }

      // Map commands by category (though not used in the reply for .repo)
      cm.map((com) => {
        if (!coms[com.categorie]) coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
      });

      // Set timezone and get current time/date
      moment.tz.setDefault('Etc/GMT');
      const time = moment().format('HH:mm:ss');
      const date = moment().format('DD/MM/YYYY');

      // Prepare the repo message with consistent styling
      const infoMsg = `
      KINGDOM 𝐌𝐃

◈━━━━━━━━━━━━━━━━◈
│❒ Yo ${nomAuteurMessage}, here’s the 411 on KINGDOM MD’s repo! 📦
│❒ *🔗 𝐆𝐢𝐭𝐇𝐮𝐛*:https://github.com/Anzad378/KINGD0M-MD/fork
│❒ *📩 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 channel*: https://whatsapp.com/channel/0029Vb6CC2dB4hdPp1CrYv0f
│❒ *💾 𝐑𝐀𝐌 𝐔𝐬𝐚𝐠𝐞*: ${format(os.totalmem() - os.freemem())} / ${format(os.totalmem())}
│❒ *👑 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫*: KINGDOM MD
│❒ *🌐 𝐌𝐨𝐝𝐞*: ${mode}
│❒ *📅 𝐃𝐚𝐭𝐞*: ${date}
│❒ *⏰ 𝐓𝐢𝐦𝐞 (GMT)*: ${time}
│❒ Powered by KINGDOM MD
◈━━━━━━━━━━━━━━━━◈
      `;

      // Get the bot's profile picture URL
      const lien = mybotpic();

      // Send the message with a video if the URL is a video (mp4 or gif)
      if (lien.match(/\.(mp4|gif)$/i)) {
        try {
          await zk.sendMessage(
            dest,
            {
              video: { url: lien },
              caption: infoMsg,
              footer: `Hey ${nomAuteurMessage}! I'm KINGDOM MD, created by KINGDOM MD😎`,
              gifPlayback: true,
            },
            { quoted: ms }
          );
        } catch (e) {
          console.error("Video sending error:", e);
          await repondre('KINGDOM 𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${nomAuteurMessage}, KINGDOM MD fumbled the video send: ${e.message} 😡 Here’s the repo info anyway! 😣\n${infoMsg}\n◈━━━━━━━━━━━━━━━━◈`);
        }
      }
      // Send the message with an image if the URL is an image (jpeg, png, jpg)
      else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
        try {
          await zk.sendMessage(
            dest,
            {
              image: { url: lien },
              caption: infoMsg,
              footer: `Hey ${nomAuteurMessage}! I'm KINGDOM MD, created by KINDOM MD  🇹🇿`,
            },
            { quoted: ms }
          );
        } catch (e) {
          console.error("Image sending error:", e);
          await repondre(`KINGDOM 𝐌𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ Yo ${nomAuteurMessage}, KINGDOM MD botched the image send: ${e.message} 😡 Here’s the repo info anyway! 😣\n${infoMsg}\n◈━━━━━━━━━━━━━━━━◈`);
        }
      }
      // Fallback to text-only message if no valid media is provided
      else {
        await repondre(infoMsg);
      }
    } catch (e) {
      console.error("Error in repo command:", e);
      await repondre(`KINGDOM M𝐃\n\n◈━━━━━━━━━━━━━━━━◈\n│❒ TOTAL BUST, ${nomAuteurMessage}! KINGDOM MD crashed while fetching repo info: ${e.message} 😡 Try again or flop! 😣\n◈━━━━━━━━━━━━━━━━◈`);
    }
  }
);
