const venom = require('venom-bot');
const mysql = require('mysql2');
const moment = require('moment-timezone');
const qrcode = require('qrcode-terminal');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'whatsapp_bot'
});

db.connect(err => {
    if (err) throw err;
    console.log("Banco de dados conectado!");
});

venom.create().then(client => {
    console.log('Bot do WhatsApp Iniciado!');

    client.onMessage(async message => {
        if (message.body && message.from.endsWith('@c.us')) {
            const numero = message.from.replace('@c.us', '');
            const texto = message.body;

            const regexMensagem = /agendar\{(.*?)\}/i;
            const regexData = /data\{(.*?)\}/i;

            const mensagemMatch = texto.match(regexMensagem);
            const dataMatch = texto.match(regexData);

            if (mensagemMatch && dataMatch) {
                const mensagem = mensagemMatch[1];
                const dataEnvio = dataMatch[1];
                
                const partesData = dataEnvio.split('/');
                if (partesData.length !== 3) {
                    return client.sendText(message.from, "❌ Formato de data inválido! Use: DD/MM/AAAA");
                }
                
                const dataFormatada = moment(`${partesData[2]}-${partesData[1]}-${partesData[0]} 00:00:00`, 'YYYY-MM-DD HH:mm:ss')
                    .format('YYYY-MM-DD HH:mm:ss');

                db.query(
                    "INSERT INTO mensagens_agendadas (numero, mensagem, data_envio) VALUES (?, ?, ?)",
                    [numero, mensagem, dataFormatada],
                    (err) => {
                        if (err) {
                            console.log("Erro ao agendar mensagem:", err);
                            client.sendText(message.from, "❌ Erro ao agendar mensagem.");
                        } else {
                            console.log(`✅ Mensagem agendada para ${numero} no dia ${dataEnvio}`);
                            client.sendText(message.from, `✅ Sua mensagem foi agendada para ${dataEnvio}.`);
                        }
                    }
                );
            } else {
                client.sendText(message.from, "⚠️ Formato inválido! Use:\n\nagendar{Sua mensagem} data{DD/MM/AAAA}");
            }
        }
    });
}).catch(err => console.log(err));
