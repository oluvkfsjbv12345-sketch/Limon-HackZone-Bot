/**
 * ═══════════════════════════════════════════════
 *   Command: menu
 *   Bot: 𒆜𝐋𝐢𝐦𝐨𝐧∬𝗛𝗮𝗰𝗸𝗭𝗼𝗻𝗲❦ MD
 * ═══════════════════════════════════════════════
 */

const config = require("../config");

module.exports = {
    name: "menu",
    aliases: ["help", "commands"],
    category: "general",
    description: "Show all available bot commands",

    async execute(sock, msg, ctx) {
        const { from, senderNumber, config: cfg, commands } = ctx;

        // ─── Group commands by category ─────────
        const categories = {};
        const seen = new Set();

        for (const [name, cmd] of commands.entries()) {
            if (seen.has(cmd.name)) continue;
            seen.add(cmd.name);

            const cat = cmd.category || "general";
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd);
        }

        // ─── Build menu text ────────────────────
        let menuText = "";
        menuText += `╔══════════════════════════════════╗\n`;
        menuText += `║  𒆜𝐋𝐢𝐦𝐨𝐧∬𝗛𝗮𝗰𝗸𝗭𝗼𝗻𝗲❦ MD\n`;
        menuText += `╚══════════════════════════════════╝\n\n`;
        menuText += `👤 *Owner:* ${cfg.ownerName}\n`;
        menuText += `🔰 *Prefix:* ${cfg.prefix}\n`;
        menuText += `📦 *Total Commands:* ${seen.size}\n`;
        menuText += `📡 *Channel:* ${cfg.channelName}\n\n`;

        for (const [cat, cmds] of Object.entries(categories)) {
            menuText += `┌───「 *${cat.toUpperCase()}* 」───\n`;
            for (const cmd of cmds) {
                menuText += `│ ▸ ${cfg.prefix}${cmd.name}\n`;
                if (cmd.description) {
                    menuText += `│    ↳ ${cmd.description}\n`;
                }
            }
            menuText += `└────────────────────\n\n`;
        }

        menuText += `> 💡 Type *${cfg.prefix}menu* anytime to see this list.\n`;
        menuText += `> 🌐 ${cfg.channelLink}`;

        // ─── Send with externalAdReply ──────────
        await sock.sendMessage(from, {
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: cfg.botName,
                    body: cfg.channelName,
                    thumbnailUrl: "https://i.ibb.co/6P5v0z9/wa-channel.jpg",
                    sourceUrl: cfg.channelLink,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                },
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363200367779016@newsletter",
                    newsletterName: cfg.channelName,
                    serverMessageId: 143
                }
            }
        }, { quoted: msg });
    }
};
