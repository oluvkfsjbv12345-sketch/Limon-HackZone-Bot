/**
 * ═══════════════════════════════════════════════
 *   𒆜𝐋𝐢𝐦𝐨𝐧∬𝗛𝗮𝗰𝗸𝗭𝗼𝗻𝗲❦ MD - Configuration
 * ═══════════════════════════════════════════════
 */

module.exports = {
    // ─── Bot Info ───────────────────────────────
    botName: "𒆜𝐋𝐢𝐦𝐨𝐧∬𝗛𝗮𝗰𝗸𝗭𝗼𝗻𝗲❦ MD",
    ownerName: "𒆜𝐋𝐢𝐦𝐨𝐧∬𝗛𝗮𝗰𝗸𝗭𝗼𝗻𝗲❦",
    prefix: ".",

    // ─── WhatsApp Channel ───────────────────────
    channelName: "✰დ𝐂𝐎𝐌𝐅𝐎𝐑𝐓ღ🎭 ☙𝐙𝐎𝐍𝐄∬",
    channelLink: "https://whatsapp.com/channel/0029VbE7KjkCMY0FOsFK7J04",

    // ─── Session ────────────────────────────────
    sessionName: "auth_info_baileys",
    sessionFolder: "./auth_info_baileys",

    // ─── Bot Behavior ───────────────────────────
    selfMode: false,          // true = only owner can use bot
    autoRead: true,           // auto-read incoming messages
    autoTyping: true,         // show typing indicator

    // ─── Messages ───────────────────────────────
    messages: {
        wait: "⏳ *Please wait...*",
        success: "✅ *Success!*",
        error: "❌ *An error occurred!*",
        ownerOnly: "⚠️ *This command is for the owner only!*",
        groupOnly: "⚠️ *This command can only be used in groups!*",
        adminOnly: "⚠️ *This command is for admins only!*",
        notFound: "❌ *Command not found!* Type *.menu* to see all commands."
    }
};
