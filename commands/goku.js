const axios = require('axios');

const gokuUserStates = {};

module.exports = {
    name: 'goku',
    desc: 'Interacts with the Goku AI character.',
    aliases: ['askgoku'],
    category: 'Fun',
    cooldown: 10,
    permission: 0,
    dmUser: true,
    run: async ({ sock, m, args }) => {
        if (!args[0]) {
            return m.reply(
                '╭────❒ ❌ Error ❒\n' +
                '├⬡ Please provide something to say to Goku.\n' +
                '├⬡ Usage: !goku [your message]\n' +
                '╰────────────❒'
            );
        }

        const message = args.join(' ');
        const userId = m.sender;

        try {
            const processingMsg = await m.reply(
                '╭────❒ ⏳ Talking to Goku ⏳ ❒\n' +
                '├⬡ Sending your message to Goku...\n' +
                '├⬡ Please wait for his Saiyan response!\n' +
                '╰───────────────────────────'
            );

            const apiUrl = `https://kaiz-apis.gleeze.com/api/goku?ask=${encodeURIComponent(message)}&uid=${encodeURIComponent(userId)}&key=8e3b0d39-d9d4-47a1-a125-0801eb103e7f`;
            const response = await axios.get(apiUrl);
            const gokuData = response.data;

            if (gokuData && gokuData.response && gokuData.character === 'Son Goku') {
                await sock.sendMessage(
                    m.chat,
                    { text: `🐉 Son Goku says:\n\n${gokuData.response}` },
                    { quoted: m }
                );
                await sock.sendMessage(m.chat, { delete: processingMsg.key });
            } else {
                await sock.sendMessage(m.chat, { delete: processingMsg.key });
                return m.reply(
                    '╭────❒ ❓ Hmm... ❒\n' +
                    '├⬡ Goku didn\'t respond this time or something went wrong.\n' +
                    '├⬡ Maybe try saying something else!\n' +
                    '╰────────────❒'
                );
            }
        } catch (error) {
            console.error('Error talking to Goku:', error);
            await sock.sendMessage(m.chat, { delete: processingMsg.key });
            return m.reply(
                '╭────❒ ❌ Error ❒\n' +
                '├⬡ An error occurred while trying to talk to Goku.\n' +
                '├⬡ Please try again later.\n' +
                '╰────────────❒'
            );
        }
    },
};