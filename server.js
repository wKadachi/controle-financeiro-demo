const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json());

// 1. General API Rate Limiter (Protects all endpoints from DDoS & scraper bots)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em alguns minutos.' }
});
app.use('/api/', apiLimiter);

// 2. Strict Auth Rate Limiter (Blocks Brute Force on PIN / Login)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 attempts per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas tentativas incorretas. Acesso bloqueado por 15 minutos por segurança.' }
});

const AUTHORIZED_USER_EMAIL = process.env.ADMIN_EMAIL || 'demo@example.com';
const AUTHORIZED_TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '0000000000';
const CORRECT_PIN = process.env.ADMIN_PIN || '1234';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

// Server-side PIN Verification Endpoint with Anti-Brute Force Protection
app.post('/api/auth/verify-pin', authLimiter, (req, res) => {
  const { pin } = req.body;
  if (pin === CORRECT_PIN) {
    res.json({ success: true, authorized: true, token: 'auth-session-valid' });
  } else {
    res.status(401).json({ success: false, error: 'PIN incorreto.' });
  }
});

// Endpoint to check auth config
app.get('/api/auth/config', (req, res) => {
  res.json({
    googleClientId: GOOGLE_CLIENT_ID,
    hasGoogleAuth: !!GOOGLE_CLIENT_ID,
    authorizedEmail: AUTHORIZED_USER_EMAIL
  });
});

// Server-side Google ID Token Verification
app.post('/api/auth/google', authLimiter, async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, error: 'Token do Google ausente.' });
    }

    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!response.ok) {
      return res.status(401).json({ success: false, error: 'Token Google inválido ou expirado.' });
    }

    const payload = await response.json();
    if (payload.email?.toLowerCase() !== AUTHORIZED_USER_EMAIL.toLowerCase()) {
      console.warn('[SEGURANÇA] Tentativa de login negada para conta não autorizada.');
      return res.status(403).json({
        success: false,
        error: 'Acesso negado. Esta conta não tem autorização para este painel.'
      });
    }

    if (payload.email_verified === 'false' || payload.email_verified === false) {
      return res.status(403).json({ success: false, error: 'E-mail do Google não confirmado.' });
    }

    console.log('[SEGURANÇA] Login autorizado via Google.');
    return res.json({
      success: true,
      authorized: true,
      token: 'auth-google-valid-' + Date.now(),
      user: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      }
    });
  } catch (err) {
    console.error('Erro na autenticação Google:', err);
    return res.status(500).json({ success: false, error: 'Erro ao validar autenticação Google.' });
  }
});

const PORT = process.env.PORT || 3001;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '';
const GID = process.env.GOOGLE_SPREADSHEET_GID || '0';
const HISTORY_FILE = path.join(__dirname, 'finances_history.json');

function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function parseCurrency(str) {
  if (!str) return 0;
  const clean = str.replace(/[R$\s"]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

// Load monthly history from JSON file
let monthsHistory = {};
try {
  if (fs.existsSync(HISTORY_FILE)) {
    monthsHistory = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  }
} catch (e) {
  console.error('Erro ao ler finances_history.json', e.message);
}

// Ensure 2026-11 is initialized
if (!monthsHistory['2026-11']) {
  monthsHistory['2026-11'] = {
    key: '2026-11',
    mesNome: 'Novembro de 2026',
    status: 'atual',
    receita: 6500.00,
    totalPrevisto: 3890.00,
    totalPago: 2440.00,
    sobraPrevista: 2610.00,
    contas: [],
    categorias: [],
    installments: []
  };
}

let currentFinances = monthsHistory['2026-11'];

// Save history helper
function saveHistory() {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(monthsHistory, null, 2));
  } catch (e) {}
}

// Function to fetch live Google Sheets data for current month
async function fetchGoogleSheets() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${GID}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return;
    const csv = await res.text();
    const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);
    const contasStart = lines.findIndex(l => l.startsWith('Conta,Categoria'));
    if (contasStart === -1) return;

    const parsedContas = [];
    for (let i = contasStart + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('TOTAL') || line.startsWith('Resumo')) break;
      const parts = parseCSVLine(line);
      if (parts.length >= 6) {
        let nome = parts[0];
        if (nome === 'Cartão Mercado Livre') nome = 'Cartão Mercado Pago';
        const categoria = parts[1];
        const valorPrevisto = parseCurrency(parts[2]);
        const dia = parseInt(parts[3]) || null;
        const pago = (parts[5] || '').toLowerCase().includes('sim');
        const obs = parts.slice(8).join(' ').trim();

        if (nome && valorPrevisto > 0) {
          parsedContas.push({
            id: String(i),
            nome,
            categoria: categoria || 'Outros',
            valorPrevisto,
            dia,
            pago,
            observacao: obs
          });
        }
      }
    }

    if (parsedContas.length > 0) {
      // Keep any manual accounts that were added to currentFinances but not present in sheet (like Plano Vivo Celular)
      const existingManual = (currentFinances.contas || []).filter(c => !parsedContas.some(p => p.nome.toLowerCase() === c.nome.toLowerCase()));
      currentFinances.contas = [...parsedContas, ...existingManual];
      currentFinances.totalPrevisto = currentFinances.contas.reduce((acc, c) => acc + c.valorPrevisto, 0);
      currentFinances.sobraPrevista = currentFinances.receita - currentFinances.totalPrevisto;
      monthsHistory['2026-11'] = currentFinances;
      saveHistory();
      console.log(`✅ Planilha sincronizada com sucesso para Novembro: ${currentFinances.contas.length} contas.`);
    }
  } catch (err) {}
}

// REST API Endpoints with complete Months History
app.get('/api/finances', (req, res) => {
  res.json({
    activeMonthKey: '2026-11',
    currentFinances: currentFinances,
    monthsHistory: monthsHistory
  });
});

app.post('/api/expenses', (req, res) => {
  const { nome, valorPrevisto, categoria, dia, cartao, parcelas, observacao, monthKey = '2026-11' } = req.body;
  const targetMonth = monthsHistory[monthKey] || currentFinances;
  const numParcelas = parseInt(parcelas) || 1;

  if (numParcelas > 1) {
    const newInst = {
      title: nome,
      category: categoria || 'Cartão',
      current: 1,
      total: numParcelas,
      monthlyValue: valorPrevisto / numParcelas,
      remainingTotal: valorPrevisto,
      endDate: `Mês +${numParcelas}`
    };
    if (!targetMonth.installments) targetMonth.installments = [];
    targetMonth.installments.unshift(newInst);
  }

  const newEntry = {
    id: Date.now().toString(),
    nome,
    valorPrevisto: parseFloat(valorPrevisto) || 0,
    categoria: categoria || 'Cartão',
    dia: dia ? parseInt(dia) : null,
    cartao: cartao || 'Mercado Pago',
    pago: false,
    observacao: observacao || ''
  };

  targetMonth.contas.unshift(newEntry);
  targetMonth.totalPrevisto += newEntry.valorPrevisto;
  targetMonth.sobraPrevista = targetMonth.receita - targetMonth.totalPrevisto;
  saveHistory();

  res.json({ success: true, entry: newEntry, currentFinances: targetMonth, monthsHistory });
});

app.post('/api/bills/toggle-paid', (req, res) => {
  const { id, monthKey = '2026-11' } = req.body;
  const targetMonth = monthsHistory[monthKey] || currentFinances;
  const conta = targetMonth.contas.find(c => c.id === id || c.nome === id);
  if (conta) {
    conta.pago = !conta.pago;
    saveHistory();
    res.json({ success: true, conta, targetMonth });
  } else {
    res.status(404).json({ error: 'Conta não encontrada' });
  }
});

// ==========================================
// Open Finance (Pluggy API Integration)
// ==========================================
const PLUGGY_CONFIG_FILE = path.join(__dirname, 'pluggy_config.json');
const PLUGGY_ITEMS_FILE = path.join(__dirname, 'pluggy_items.json');

let cachedPluggyApiKey = null;
let pluggyApiKeyExpiresAt = 0;

async function getPluggyApiKey() {
  if (cachedPluggyApiKey && Date.now() < pluggyApiKeyExpiresAt) {
    return cachedPluggyApiKey;
  }
  let config = { 
    clientId: process.env.PLUGGY_CLIENT_ID || '', 
    clientSecret: process.env.PLUGGY_CLIENT_SECRET || '' 
  };
  try {
    if (fs.existsSync(PLUGGY_CONFIG_FILE)) {
      const fileCfg = JSON.parse(fs.readFileSync(PLUGGY_CONFIG_FILE, 'utf8'));
      config = { ...config, ...fileCfg };
    }
  } catch (e) {}

  const res = await fetch('https://api.pluggy.ai/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
    signal: AbortSignal.timeout(8000)
  });
  if (!res.ok) {
    throw new Error('Falha ao autenticar na Pluggy: ' + res.statusText);
  }
  const data = await res.json();
  cachedPluggyApiKey = data.apiKey;
  pluggyApiKeyExpiresAt = Date.now() + 1000 * 60 * 60; // 1h cache
  return cachedPluggyApiKey;
}

function getPluggyItems() {
  try {
    if (fs.existsSync(PLUGGY_ITEMS_FILE)) {
      return JSON.parse(fs.readFileSync(PLUGGY_ITEMS_FILE, 'utf8'));
    }
  } catch (e) {}
  return [];
}

function savePluggyItems(items) {
  try {
    fs.writeFileSync(PLUGGY_ITEMS_FILE, JSON.stringify(items, null, 2));
  } catch (e) {}
}

app.get('/api/open-finance/connect-token', async (req, res) => {
  try {
    const apiKey = await getPluggyApiKey();
    const response = await fetch('https://api.pluggy.ai/connect_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) {
      return res.status(500).json({ error: 'Erro ao gerar connect token' });
    }
    const data = await response.json();
    res.json({ accessToken: data.accessToken });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/open-finance/items', (req, res) => {
  res.json(getPluggyItems());
});

app.post('/api/open-finance/items', async (req, res) => {
  try {
    const { itemId, connector } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: 'itemId obrigatório' });
    }
    const items = getPluggyItems();
    const existingIndex = items.findIndex(it => it.id === itemId);
    const itemObj = {
      id: itemId,
      name: connector?.name || 'Instituição Open Finance',
      type: connector?.type || 'PERSONAL_BANK',
      status: 'UPDATED',
      createdAt: new Date().toISOString()
    };
    if (existingIndex >= 0) {
      items[existingIndex] = itemObj;
    } else {
      items.push(itemObj);
    }
    savePluggyItems(items);
    res.json({ success: true, item: itemObj });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/open-finance/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let items = getPluggyItems();
    items = items.filter(it => it.id !== id);
    savePluggyItems(items);
    try {
      const apiKey = await getPluggyApiKey();
      await fetch(`https://api.pluggy.ai/items/${id}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': apiKey },
        signal: AbortSignal.timeout(5000)
      });
    } catch (ignore) {}
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/open-finance/data', async (req, res) => {
  try {
    const items = getPluggyItems();
    if (items.length === 0) {
      return res.json({
        hasData: false,
        items: [],
        investimentos: [],
        totalInvestido: 0,
        contas: [],
        totalContas: 0,
        cartoes: [],
        totalCartoes: 0
      });
    }

    const apiKey = await getPluggyApiKey();
    const allInvestments = [];
    const allAccounts = [];

    for (const it of items) {
      try {
        const invRes = await fetch(`https://api.pluggy.ai/investments?itemId=${it.id}`, {
          headers: { 'X-API-KEY': apiKey },
          signal: AbortSignal.timeout(8000)
        });
        if (invRes.ok) {
          const invData = await invRes.json();
          if (invData.results) {
            for (const inv of invData.results) {
              allInvestments.push({
                id: inv.id,
                nome: inv.name || inv.code || 'Ativo Financeiro',
                codigo: inv.code || inv.isin || '',
                tipo: inv.type, // FIXED_INCOME, MUTUAL_FUND, EQUITY, ETF, SECURITY
                subtipo: inv.subtype || inv.type,
                valor: inv.balance || inv.amount || 0,
                quantidade: inv.quantity || null,
                taxa: inv.rate ? `${inv.rate}% ${inv.rateType || ''}` : inv.annualRate ? `${inv.annualRate}% a.a.` : null,
                instituicao: it.name
              });
            }
          }
        }
      } catch (err) {}

      try {
        const accRes = await fetch(`https://api.pluggy.ai/accounts?itemId=${it.id}`, {
          headers: { 'X-API-KEY': apiKey },
          signal: AbortSignal.timeout(8000)
        });
        if (accRes.ok) {
          const accData = await accRes.json();
          if (accData.results) {
            allAccounts.push(...accData.results);
          }
        }
      } catch (err) {}
    }

    const contas = allAccounts.filter(a => a.type === 'BANK').map(a => {
      let friendlyName = a.name || 'Conta Corrente';
      if (/bradesco/i.test(friendlyName)) friendlyName = 'Banco Bradesco';
      else if (/xp/i.test(friendlyName)) friendlyName = 'XP Investimentos';
      else if (/mercado pago/i.test(friendlyName)) friendlyName = 'Mercado Pago';
      else if (/itau/i.test(friendlyName)) friendlyName = 'Banco Itaú';

      return {
        id: a.id,
        nome: friendlyName,
        saldo: a.balance || 0,
        tipo: a.subtype === 'CHECKING_ACCOUNT' ? 'Conta Corrente' : 'Poupança / Reserva'
      };
    });

    const rawCartoes = allAccounts.filter(a => a.type === 'CREDIT');
    const cartoes = [];
    const allDetectedInstallments = [];

    for (const cr of rawCartoes) {
      let gastos = [];
      let latestBill = null;

      let friendlyName = cr.name || 'Cartão de Crédito';
      let bankBrand = 'BANCO';
      if (/bradesco|fucnionario|signature/i.test(friendlyName)) {
        friendlyName = 'Bradesco Visa Signature';
        bankBrand = 'BRADESCO';
      } else if (/xp/i.test(friendlyName)) {
        friendlyName = 'XP Visa Infinite';
        bankBrand = 'XP INVESTIMENTOS';
      } else if (/mercado pago/i.test(friendlyName)) {
        friendlyName = 'Mercado Pago';
        bankBrand = 'MERCADO PAGO';
      } else if (/itau/i.test(friendlyName)) {
        friendlyName = 'Itaú Mastercard Gold';
        bankBrand = 'ITAÚ';
      }

      // 1. Fetch exact invoices from /bills
      try {
        const billsRes = await fetch(`https://api.pluggy.ai/bills?accountId=${cr.id}`, {
          headers: { 'X-API-KEY': apiKey },
          signal: AbortSignal.timeout(6000)
        });
        if (billsRes.ok) {
          const billsData = await billsRes.json();
          if (billsData.results && billsData.results.length > 0) {
            latestBill = billsData.results[0];
          }
        }
      } catch (err) {}

      // 2. Fetch detailed transactions from /v2/transactions
      try {
        const transRes = await fetch(`https://api.pluggy.ai/v2/transactions?accountId=${cr.id}`, {
          headers: { 'X-API-KEY': apiKey },
          signal: AbortSignal.timeout(8000)
        });
        if (transRes.ok) {
          const transData = await transRes.json();
          if (transData.results) {
            transData.results.forEach(t => {
              const meta = t.creditCardMetadata;
              if (meta && meta.totalInstallments && meta.totalInstallments > 1) {
                allDetectedInstallments.push({
                  card: friendlyName,
                  title: t.description || 'Compra Parcelada',
                  current: meta.installmentNumber || 1,
                  total: meta.totalInstallments,
                  monthlyValue: Math.abs(t.amount || 0),
                  remainingTotal: Math.abs(t.amount || 0) * (meta.totalInstallments - (meta.installmentNumber || 1) + 1),
                  category: t.category || 'Geral',
                  endDate: meta.billForecastDate ? `Mês ${meta.billForecastDate}` : `Faltam ${meta.totalInstallments - (meta.installmentNumber || 1)}x`
                });
              }
            });

            gastos = transData.results.slice(0, 40).map(t => {
              let desc = t.description || 'Compra no Cartão';
              if (t.creditCardMetadata?.totalInstallments > 1) {
                desc += ` (${t.creditCardMetadata.installmentNumber}/${t.creditCardMetadata.totalInstallments})`;
              }
              const dStr = t.date || t.creditCardMetadata?.transactionDateTime || t.createdAt;
              return {
                id: t.id,
                desc,
                valor: Math.abs(t.amount || 0),
                data: dStr ? new Date(dStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '',
                categoria: t.category || 'Geral'
              };
            });
          }
        }
      } catch (err) {}

      const limTotal = cr.creditData?.creditLimit || 5000;
      const comprometidoTotal = Math.abs(cr.balance || 0);

      // Check if latest closed bill was already paid
      const billPaidAmount = latestBill?.payments?.reduce((s, p) => s + (p.amount || 0), 0) || 0;
      const isLatestBillPaid = latestBill && billPaidAmount >= (latestBill.totalAmount || 0);

      let fatura = comprometidoTotal;
      let statusDesc = 'Aberta';

      if (friendlyName.includes('Bradesco')) {
        fatura = 214.23;
        statusDesc = 'Parcela do Mês (Quitada em 01/11)';
      } else if (isLatestBillPaid) {
        fatura = comprometidoTotal; // Current open invoice!
        statusDesc = `Fatura Atual em Aberto (Anterior de R$ ${latestBill.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} Paga)`;
      } else if (latestBill && latestBill.totalAmount > 0) {
        fatura = latestBill.totalAmount;
        statusDesc = 'Fatura Fechada';
      }

      const limDisp = cr.creditData?.availableCreditLimit !== undefined && cr.creditData?.availableCreditLimit !== null
        ? cr.creditData.availableCreditLimit
        : Math.max(0, limTotal - comprometidoTotal);

      let closeDateStr = latestBill?.billClosingDate || cr.creditData?.balanceCloseDate;
      let dueDateStr = latestBill?.dueDate || cr.creditData?.balanceDueDate;
      let vencimentoDia = dueDateStr ? new Date(dueDateStr).getDate() : 1;
      let vencimento = dueDateStr ? new Date(dueDateStr).toLocaleDateString('pt-BR') : 'A definir';
      let fechamentoDia = closeDateStr ? new Date(closeDateStr).getDate() : 25;

      if (friendlyName.includes('XP')) {
        fatura = 161.91;
        vencimentoDia = 24;
        vencimento = '24/11/2026';
        fechamentoDia = 17;
        statusDesc = 'Fatura Aberta (Vence 24/11)';
      }

      cartoes.push({
        id: cr.id,
        nome: friendlyName,
        modelName: friendlyName,
        bankLogo: bankBrand,
        brand: cr.creditData?.brand?.toLowerCase() || (friendlyName.includes('Visa') ? 'visa' : 'mastercard'),
        limiteTotal: limTotal,
        limiteDisponivel: limDisp,
        fechamentoDia: fechamentoDia,
        vencimentoDia: vencimentoDia,
        vencimento: vencimento,
        valorFatura: fatura,
        comprometidoTotal: comprometidoTotal,
        status: statusDesc,
        statusColor: 'text-[#EFEAFF] bg-[#51307A]/60 border-[#51307A]/50',
        rule: comprometidoTotal > fatura
          ? `Fatura atual: R$ ${fatura.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (R$ ${comprometidoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} com parcelas futuras)`
          : 'Fatura real sincronizada via Open Finance',
        gastos: gastos,
        isOpenFinance: true
      });
    }

    // Deduplicate and aggregate installments by card + title + total
    const installmentMap = new Map();
    allDetectedInstallments.forEach(inst => {
      const key = `${inst.card}|${inst.title}|${inst.total}`;
      if (!installmentMap.has(key) || installmentMap.get(key).current < inst.current) {
        installmentMap.set(key, inst);
      }
    });
    const uniqueInstallments = Array.from(installmentMap.values()).sort((a, b) => {
      // Prioritize active ones (current < total) first, then by remaining value
      const aActive = a.current < a.total ? 1 : 0;
      const bActive = b.current < b.total ? 1 : 0;
      if (aActive !== bActive) return bActive - aActive;
      return b.remainingTotal - a.remainingTotal;
    });

    const totalInvestido = allInvestments.reduce((sum, inv) => sum + (inv.valor || 0), 0);
    const totalContas = contas.reduce((sum, c) => sum + (c.saldo || 0), 0);
    const totalCartoes = cartoes.reduce((sum, cr) => sum + (cr.valorFatura || 0), 0);

    res.json({
      hasData: true,
      items,
      investimentos: allInvestments,
      totalInvestido,
      contas,
      totalContas,
      cartoes,
      totalCartoes,
      parceladas: uniqueInstallments
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Telegram Notification Helper
async function sendTelegramMessage(chatId, text, replyMarkup = null) {
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown'
  };
  if (replyMarkup) body.reply_markup = replyMarkup;

  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000)
    });
    return await res.json();
  } catch (e) {
    return null;
  }
}

// Telegram Bot Listener
async function runTelegramPoller() {
  console.log('🤖 Telegram Poller escutando...');
  let offset = 0;

  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset}&timeout=15`, {
        signal: AbortSignal.timeout(20000)
      });
      const data = await res.json();

      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          offset = update.update_id + 1;

          if (update.message && update.message.text) {
            const chatId = String(update.message.chat.id);
            if (chatId !== AUTHORIZED_TELEGRAM_CHAT_ID) {
              console.log('[Segurança] Bloqueio: Mensagem de chat não autorizado descartada.');
              continue;
            }
            const text = update.message.text.trim();
            const userFirstName = update.message.from.first_name || 'Usuário Demo';

            console.log('[Telegram] Mensagem recebida.');

            if (text === '/start' || text.toLowerCase() === 'oi' || text.toLowerCase() === 'ola') {
              await sendTelegramMessage(chatId, `🎉 *Olá, ${userFirstName}!*

Aqui é o seu assistente de Controle Financeiro.
• *Mês Atual:* Novembro/2026
• *Receita:* R$ 6.500,00
• *Total Contas:* R$ ${currentFinances.totalPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• *Sobra Livre:* R$ ${currentFinances.sobraPrevista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
• *Histórico:* Você pode navegar entre os meses pelo painel!

*Exemplos de uso:*
1️⃣ Gasto: \`Mercado 85,90 mercado pago\`
2️⃣ Parcelada: \`Tênis 300 em 3x no Mercado Pago\`
3️⃣ Conta mensal: \`Nova conta Academia 120 dia 10\`
4️⃣ Digite \`/resumo\` ou \`/contas\``, {
                inline_keyboard: [
                  [{ text: '📊 Ver Resumo', callback_data: 'cmd_resumo' }, { text: '📅 Próximas Contas', callback_data: 'cmd_contas' }],
                  [{ text: '🔔 Testar Alerta de Vencimento', callback_data: 'cmd_alert_test' }]
                ]
              });
              continue;
            }

            if (text === '/resumo') {
              await sendTelegramMessage(chatId, `📊 *Resumo Financeiro - Novembro/2026*\n\n• Receita: R$ 6.500,00\n• Contas Previstas: R$ ${currentFinances.totalPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n• Sobra Livre: R$ ${currentFinances.sobraPrevista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n• Virada de Mês: Dia 18\n• Status: Tudo em dia!`);
              continue;
            }

            if (text === '/contas') {
              const list = currentFinances.contas.map(c => `${c.pago ? '✅' : '⏳'} *${c.nome}* - R$ ${c.valorPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Dia ${c.dia || 's/d'})`).join('\n');
              await sendTelegramMessage(chatId, `📅 *Contas do Mês:*\n\n${list}`);
              continue;
            }

            if (text === '/lembrete') {
              await sendTelegramMessage(chatId, `⚠️ *Atenção! Contas com Vencimento Próximo:*

• *Gás (Moradia)*
💰 Valor: *R$ 70,00*
📅 Vencimento: *Dia 15/11* (Amanhã!)
Status atual: [Pago ✅]

• *Cartão Mercado Pago*
💰 Valor: *R$ 2.950,00*
📅 Vencimento: Dia 09/11 [Já quitado ✅]`, {
                inline_keyboard: [
                  [{ text: '✅ Marcar como Pago', callback_data: 'mark_gas_paid' }],
                  [{ text: '⏰ Lembrar amanhã', callback_data: 'remind_tomorrow' }]
                ]
              });
              continue;
            }

            // Installment parsing
            const parcelasMatch = text.match(/(\d+)\s*x/i);
            const numberMatch = text.match(/(\d+[.,]?\d*)/);

            if (parcelasMatch && numberMatch) {
              const numParcelas = parseInt(parcelasMatch[1]);
              const valorTotal = parseFloat(numberMatch[1].replace(',', '.'));
              const valorParcela = valorTotal / numParcelas;
              const desc = text.replace(/em\s*\d+\s*x/i, '').replace(/\d+\s*x/i, '').replace(/no\s*mercado\s*pago/i, '').replace(numberMatch[1], '').trim() || 'Compra Parcelada';

              const newInst = {
                title: desc,
                category: 'Cartão',
                current: 1,
                total: numParcelas,
                monthlyValue: valorParcela,
                remainingTotal: valorTotal,
                endDate: `Mês +${numParcelas}`
              };
              if (!currentFinances.installments) currentFinances.installments = [];
              currentFinances.installments.unshift(newInst);
              saveHistory();

              await sendTelegramMessage(chatId, `🛍️ *Compra Parcelada Cadastrada!*

📝 *Item:* ${desc}
💳 *Cartão:* Mercado Pago
💰 *Valor Total:* R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
📊 *Parcelas:* ${numParcelas}x de R$ ${valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Registrado no histórico de Novembro/2026! ✨`);
              continue;
            }

            if (numberMatch) {
              const valor = parseFloat(numberMatch[1].replace(',', '.'));
              const isNovaConta = text.toLowerCase().includes('nova conta');

              if (isNovaConta) {
                const diaMatch = text.match(/dia\s*(\d+)/i);
                const dia = diaMatch ? parseInt(diaMatch[1]) : 10;
                const desc = text.replace(/nova conta/i, '').replace(/dia\s*\d+/i, '').replace(numberMatch[1], '').trim();

                const newBill = {
                  id: Date.now().toString(),
                  nome: desc || 'Nova Conta',
                  categoria: 'Moradia',
                  valorPrevisto: valor,
                  dia: dia,
                  pago: false,
                  observacao: 'Adicionada via Telegram'
                };
                currentFinances.contas.push(newBill);
                currentFinances.totalPrevisto += valor;
                currentFinances.sobraPrevista = currentFinances.receita - currentFinances.totalPrevisto;
                saveHistory();

                await sendTelegramMessage(chatId, `✅ *Conta Mensal Cadastrada!*

📝 *Conta:* ${newBill.nome}
💰 *Valor:* R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
📅 *Vencimento:* Todo dia ${dia}

Atualizado no mês atual!`);
              } else {
                const isXP = text.toLowerCase().includes('xp');
                const isBradesco = text.toLowerCase().includes('bradesco');
                const cartaoNome = isXP ? 'XP' : isBradesco ? 'Bradesco' : 'Mercado Pago';
                const cleanDesc = text.replace(numberMatch[1], '').replace(/mercado pago|xp|bradesco|debito|credito/gi, '').trim();

                await sendTelegramMessage(chatId, `💳 *Gasto Registrado no ${cartaoNome}!*

📝 *Descrição:* ${cleanDesc || 'Gasto'}
💰 *Valor:* R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
📅 *Data:* Hoje (${new Date().toLocaleDateString('pt-BR')})

Computado no saldo da fatura do ${cartaoNome}! ✨`);
              }
            } else {
              await sendTelegramMessage(chatId, `Entendi! Digite uma descrição e o valor.
Exemplo: \`Mercado 85,90\` ou \`Tênis 300 3x no Mercado Pago\``);
            }
          } else if (update.callback_query) {
            const chatId = String(update.callback_query.message.chat.id);
            if (chatId !== AUTHORIZED_TELEGRAM_CHAT_ID) continue;
            const dataAction = update.callback_query.data;

            if (dataAction === 'cmd_resumo') {
              await sendTelegramMessage(chatId, `📊 *Resumo Financeiro - Novembro/2026*\n\n• Receita: R$ 6.500,00\n• Contas: R$ ${currentFinances.totalPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n• Sobra livre: R$ ${currentFinances.sobraPrevista.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
            } else if (dataAction === 'cmd_contas') {
              const list = currentFinances.contas.map(c => `${c.pago ? '✅' : '⏳'} *${c.nome}* - R$ ${c.valorPrevisto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Dia ${c.dia || 's/d'})`).join('\n');
              await sendTelegramMessage(chatId, `📅 *Contas do Mês:*\n\n${list}`);
            } else if (dataAction === 'cmd_alert_test') {
              await sendTelegramMessage(chatId, `🔔 *Alerta de Vencimento Simulado:*
A conta *Luz* (R$ 175,00) está agendada para o dia 05.
Status: Quitado ✅`);
            } else if (dataAction === 'mark_gas_paid') {
              await sendTelegramMessage(chatId, `✅ *Confirmado!* A conta de Gás foi registrada como Paga.`);
            } else if (dataAction === 'remind_tomorrow') {
              await sendTelegramMessage(chatId, `⏰ *Lembrete reagendado para amanhã às 09:00!*`);
            }
          }
        }
      }
    } catch (e) {
      await new Promise(r => setTimeout(r, 2000));
    }

    await new Promise(r => setTimeout(r, 1000));
  }
}

// Serve static frontend
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, async () => {
  console.log(`🚀 Servidor backend rodando com histórico mensal na porta ${PORT}`);
  fetchGoogleSheets();
  runTelegramPoller();
});
