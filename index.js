/**
 * ═══════════════════════════════════════════════
 *   𒆜𝐋𝐢𝐦𝐨𝐧∬𝗛𝗮𝗰𝗸𝗭𝗼𝗻𝗲❦ MD - Main Bot Logic
 * ═══════════════════════════════════════════════
 */

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    jidDecode
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs-extra');
const config = require('./config');

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionFolder);
    const { version } = await fetchLatestBaileysVersion();

    console.log(`\n==============================================`);
    console.log(`  Starting ${config.botName}...`);
    console.log(`==============================================\n`);

    const client = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: [config.botName, 'Chrome', '1.0.0']
    });

    store.bind(client.ev);

    client.ev.on('creds.update', saveCreds);

    client.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('📌 QR Code generated. Scan it with your WhatsApp!');
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut
                : true;

            console.log(`⚠️ Connection closed. Reason: ${lastDisconnect?.error}`);

            if (shouldReconnect) {
                console.log('🔄 Reconnecting...');
                startBot();
            } else {
                console.log('❌ Session logged out. Delete auth folder and rescan QR.');
            }
        } else if (connection === 'open') {
            console.log(`\n✅ ${config.botName} is NOW ONLINE!`);
            console.log(`👤 Owner: ${config.ownerName}`);
            console.log(`📌 Prefix: ${config.prefix}\n`);
        }
    });

    // Handle incoming messages
    client.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek || !mek.message) return;

            // Ignore status broadcasts
            if (mek.key.remoteJid === 'status@broadcast') return;

            // Read receipts
            if (config.autoRead) {
                await client.readMessages([mek.key]);
            }

            const from = mek.key.remoteJid;
            const type = Object.keys(mek.message)[0];
            
            // Extract message text
            const body = (type === 'conversation') ? mek.message.conversation :
                         (type === 'imageMessage') ? mek.message.imageMessage.caption :
                         (type === 'videoMessage') ? mek.message.videoMessage.caption :
                         (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : '';

            if (!body || !body.startsWith(config.prefix)) return;

            const args = body.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            const sender = mek.key.participant || mek.key.remoteJid;
            const isGroup = from.endsWith('@g.us');

            console.log(`💬 Command received: ${command} from ${sender}`);

            // Typing indicator
            if (config.autoTyping) {
                await client.sendPresenceUpdate('composing', from);
            }

            // Command Handlers
            switch (command) {
                case 'menu':
                case 'help':
                    const menuText = `
*╭═══⪨ ${config.botName} ⪩═══╮*
*│* 👤 *Owner:* ${config.ownerName}
*│* 📌 *Prefix:* ${config.prefix}
*│* 📢 *Channel:* ${config.channelName}
*╰═══════════════════════╯*

*━━━━━━━ 📜 COMMANDS 📜 ━━━━━━━*

🔹 *${config.prefix}menu* - Show this menu
🔹 *${config.prefix}ping* - Check bot speed
🔹 *${config.prefix}owner* - Owner contact info
🔹 *${config.prefix}channel* - WhatsApp Channel link
🔹 *${config.prefix}alive* - Check if bot is running

*━━━━━━━ 📢 CHANNEL ━━━━━━━*
${config.channelLink}
`;
                    await client.sendMessage(from, { text: menuText }, { quoted: mek });
                    break;

                case 'ping':
                    const start = Date.now();
                    await client.sendMessage(from, { text: '🏓 Pinging...' }, { quoted: mek });
                    const end = Date.now();
                    await client.sendMessage(from, { text: `🚀 *Pong!* Speed: *${end - start}ms*` }, { quoted: mek });
                    break;

                case 'owner':
                    await client.sendMessage(from, {
                        text: `👤 *Bot Owner:* ${config.ownerName}\n📢 *Channel:* ${config.channelLink}`
                    }, { quoted: mek });
                    break;

                case 'channel':
                    await client.sendMessage(from, {
                        text: `📢 *Join our Official Channel:*\n\n*${config.channelName}*\n${config.channelLink}`
                    }, { quoted: mek });
                    break;

                case 'alive':
                    await client.sendMessage(from, {
                        text: `✅ *${config.botName}* is active and running smoothly!`
                    }, { quoted: mek });
                    break;

                default:
                    // Unknown command - do nothing or optionally send notFound message
                    break;
            }

        } catch (err) {
            console.error('Error in message handler:', err);
        }
    });
}

startBot();
