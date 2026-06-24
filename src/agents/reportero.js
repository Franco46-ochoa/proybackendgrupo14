require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_USER = 'Franco46-ochoa';

const BACKEND_REPO = 'proybackendgrupo14';
const FRONTEND_REPO = 'proyfrontendgrupo14';

const INTEGRANTES = ['Franco', 'Brian', 'Pricila', 'Fabri', 'Leo'];

// ─── 1. Obtener commits del día ──────────────────────────
async function getCommits(repo) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const url = `https://api.github.com/repos/${GITHUB_USER}/${repo}/commits?since=${since.toISOString()}&per_page=50`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(c => ({
      autor: c.commit.author.name,
      mensaje: c.commit.message.split('\n')[0],
      fecha: c.commit.author.date,
    }));
  } catch {
    return [];
  }
}

// ─── 2. Obtener PRs abiertos ─────────────────────────────
async function getOpenPRs(repo) {
  const url = `https://api.github.com/repos/${GITHUB_USER}/${repo}/pulls?state=open&per_page=20`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(pr => ({
      titulo: pr.title,
      rama: pr.head.ref,
      autor: pr.user.login,
      creado: pr.created_at,
      url: pr.html_url,
    }));
  } catch {
    return [];
  }
}

// ─── 3. Generar resumen con Gemini ───────────────────────
async function generarResumenGemini(commitsBack, commitsFront, prsBack, prsFront) {
  if (!GEMINI_API_KEY) return null;

  const totalBack = commitsBack.length;
  const totalFront = commitsFront.length;

  const commitsPorPersona = {};
  for (const c of [...commitsBack, ...commitsFront]) {
    const nombre = c.autor || 'desconocido';
    commitsPorPersona[nombre] = (commitsPorPersona[nombre] || 0) + 1;
  }

  const quienNoCommiteo = INTEGRANTES.filter(n => !commitsPorPersona[n]);

  const prompt = `Sos el Agente Reportero de SmartMargin AI. Generá un reporte diario breve y profesional con estos datos:

Commits en backend: ${totalBack}
Commits en frontend: ${totalFront}
PRs abiertos sin mergear: ${prsBack.length + prsFront.length}
${Object.entries(commitsPorPersona).map(([k, v]) => `- ${k}: ${v} commits`).join('\n')}
${quienNoCommiteo.length > 0 ? 'Sin actividad hoy: ' + quienNoCommiteo.join(', ') : 'Todos tuvieron actividad hoy.'}

Formato:
- Usá emojis (✅⚠️🔍📌🧠)
- Máximo 150 palabras
- Incluí una recomendación para mañana
- No inventes datos, usá solo lo que te paso
- Respondé en español`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

// ─── 4. Enviar mensaje a Telegram ────────────────────────
async function enviarTelegram(texto) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const maxLen = 4000;
  const mensajes = texto.length > maxLen
    ? [texto.substring(0, maxLen - 3) + '...']
    : [texto];

  for (const msg of mensajes) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: msg,
          parse_mode: 'HTML',
        }),
      });
    } catch (e) {
      console.error('Error enviando a Telegram:', e.message);
    }
  }
}

// ─── MAIN ────────────────────────────────────────────────
async function main() {
  console.log('🚀 Reportero SmartMargin AI iniciando...\n');

  // 1. Obtener datos de GitHub
  console.log('📡 Consultando GitHub API...');
  const [commitsBack, commitsFront, prsBack, prsFront] = await Promise.all([
    getCommits(BACKEND_REPO),
    getCommits(FRONTEND_REPO),
    getOpenPRs(BACKEND_REPO),
    getOpenPRs(FRONTEND_REPO),
  ]);

  const totalCommits = commitsBack.length + commitsFront.length;
  const totalPRs = prsBack.length + prsFront.length;

  console.log(`   Backend:  ${commitsBack.length} commits, ${prsBack.length} PRs abiertos`);
  console.log(`   Frontend: ${commitsFront.length} commits, ${prsFront.length} PRs abiertos`);

  // 2. Construir reporte base
  const hoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  let reporte = `<b>🤖 REPORTE DIARIO — SmartMargin AI</b>\n`;
  reporte += `<b>📅 ${hoy}</b>\n\n`;
  reporte += `<b>━━━━━━━━━━━━━━━━━━━━━━━━</b>\n`;
  reporte += `<b>📊 ACTIVIDAD DEL EQUIPO</b>\n`;
  reporte += `<b>━━━━━━━━━━━━━━━━━━━━━━━━</b>\n\n`;

  if (totalCommits === 0) {
    reporte += `⚠️ <b>Sin commits hoy</b> en ninguno de los dos repos.\n\n`;
  } else {
    const todos = [...commitsBack.map(c => ({ ...c, repo: 'backend' })), ...commitsFront.map(c => ({ ...c, repo: 'frontend' }))];
    for (const integrante of INTEGRANTES) {
      const suyos = todos.filter(c => c.autor && c.autor.toLowerCase().includes(integrante.toLowerCase()));
      if (suyos.length > 0) {
        reporte += `✅ <b>${integrante}</b> (${suyos.length} commits)\n`;
        for (const c of suyos) {
          reporte += `  • ${c.mensaje.substring(0, 60)} (<i>${c.repo}</i>)\n`;
        }
        reporte += '\n';
      } else {
        reporte += `⚠️ <b>${integrante}</b> (0 commits hoy)\n`;
        reporte += `  Sin actividad en las últimas 24hs\n\n`;
      }
    }
  }

  reporte += `<b>━━━━━━━━━━━━━━━━━━━━━━━━</b>\n`;
  reporte += `<b>🔍 PULL REQUESTS ABIERTOS (${totalPRs})</b>\n`;
  reporte += `<b>━━━━━━━━━━━━━━━━━━━━━━━━</b>\n\n`;

  if (totalPRs === 0) {
    reporte += `✅ No hay PRs pendientes de revisión.\n\n`;
  } else {
    for (const pr of [...prsBack, ...prsFront]) {
      const horas = Math.round((Date.now() - new Date(pr.creado).getTime()) / 3600000);
      reporte += `📌 <b>${pr.rama}</b> — ${pr.autor}\n`;
      reporte += `   Abierto hace ${horas}h: <a href="${pr.url}">${pr.titulo.substring(0, 80)}</a>\n\n`;
    }
  }

  // 3. Intentar resumen con Gemini
  console.log('🧠 Consultando Gemini...');
  const resumenIA = await generarResumenGemini(commitsBack, commitsFront, prsBack, prsFront);

  if (resumenIA) {
    reporte += `<b>━━━━━━━━━━━━━━━━━━━━━━━━</b>\n`;
    reporte += `<b>🧠 ANÁLISIS DEL AGENTE (Gemini)</b>\n`;
    reporte += `<b>━━━━━━━━━━━━━━━━━━━━━━━━</b>\n\n`;
    reporte += resumenIA;
    console.log('   Gemini: resumen generado');
  } else {
    console.log('   Gemini: no disponible (sin API key o falló)');
  }

  // 4. Enviar a Telegram
  console.log('📨 Enviando a Telegram...');
  await enviarTelegram(reporte);
  console.log('✅ Reporte enviado a Telegram!\n');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
