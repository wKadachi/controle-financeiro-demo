const fs = require('fs');
const path = require('path');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const CONFIG_FILE = path.join(__dirname, 'bot_config.json');

async function sendTelegramMessage(chatId, text, replyMarkup = null) {
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  };
  if (replyMarkup) {
    body.reply_markup = replyMarkup;
  }
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return await res.json();
}

async function startBot() {
  console.log('🤖 Bot Demo iniciado e aguardando mensagens...');
  let offset = 0;

  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset}&timeout=20`);
      const data = await res.json();

      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          if (update.message) {
            const chatId = update.message.chat.id;
            const userFirstName = update.message.from.first_name || 'Usuário Demo';
            const text = update.message.text || '';

            console.log('[Bot Demo] Nova mensagem recebida.');

            // Salva o Chat ID no arquivo de configuração
            fs.writeFileSync(CONFIG_FILE, JSON.stringify({ chatId, userFirstName, lastActive: new Date().toISOString() }, null, 2));

            // Responde o usuário
            const welcomeText = `🎉 *Olá, ${userFirstName}! Seu bot foi conectado com sucesso!*

Aqui é o seu assistente de *Controle Financeiro*. 
A sua planilha de demonstração já está conectada:
💰 *Receita do mês:* R$ 6.500,00
📊 *Total das contas:* R$ 3.890,00
💵 *Sobra prevista:* R$ 2.610,00

📅 *Status de Vencimentos:*
• *Aluguel Apartamento (R$ 1.800,00)* - Vencimento (07/11) [Pago ✅]
• *Internet Fibra (R$ 120,00)* - [Pago ✅]

✨ *O que você pode fazer por aqui:*
1️⃣ *Registrar despesa rápida:* Basta mandar por exemplo:
   \`Mercado 85,90 nubank\`
   \`Almoço 45 debito\`
2️⃣ *Receber alertas automáticos:* Te avisarei sempre antes do vencimento com botão para marcar como pago.
3️⃣ *Ver resumo:* Digite \`/resumo\` a qualquer momento!`;

            await sendTelegramMessage(chatId, welcomeText, {
              inline_keyboard: [
                [
                  { text: '📊 Ver Resumo', callback_data: 'cmd_resumo' },
                  { text: '📅 Próximas Contas', callback_data: 'cmd_contas' }
                ]
              ]
            });
          } else if (update.callback_query) {
            const callbackId = update.callback_query.id;
            const chatId = update.callback_query.message.chat.id;
            const dataAction = update.callback_query.data;

            if (dataAction === 'cmd_resumo') {
              await sendTelegramMessage(chatId, `📊 *Resumo Financeiro - Novembro/2026*\n\n• Receita: R$ 6.500,00\n• Contas do Mês: R$ 3.890,00\n• Sobra livre estimada: R$ 2.610,00\n• Contas em atraso: 0`);
            } else if (dataAction === 'cmd_contas') {
              await sendTelegramMessage(chatId, `📅 *Contas de Novembro*\n\n✅ Aluguel Apartamento - R$ 1.800,00 (07/11)\n⏳ Cartão Platinum - R$ 1.120,00 (05/11)\n⏳ Cartão Digital - R$ 330,00 (10/11)\n✅ Energia Elétrica - R$ 170,00 (12/11)\n✅ Internet Fibra - R$ 120,00 (15/11)\n✅ Plano de Saúde - R$ 350,00 (18/11)`);
            }
          }
        }
      }
    } catch (err) {
      console.error('Erro no polling do bot:', err.message);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

startBot();
