require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { execSync } = require('child_process');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_USER = 'Franco46-ochoa';

const BACKEND_REPO = 'proybackendgrupo14';
const FRONTEND_REPO = 'proyfrontendgrupo14';
const INTEGRANTES = ['Franco', 'Brian', 'Pricila', 'Fabri', 'Leo'];

// ─── 1. GitHub API ──────────────────────────────────────
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
      sha: c.sha.substring(0, 7),
    }));
  } catch { return []; }
}

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
  } catch { return []; }
}

// ─── 2. Lint y Tests ───────────────────────────────────
function runCommand(dir, cmd) {
  try {
    const out = execSync(cmd, { cwd: dir, timeout: 60000, encoding: 'utf8', stdio: 'pipe' });
    return { ok: true, output: out.slice(-2000) };
  } catch (e) {
    return { ok: false, output: (e.stdout || '') + '\n' + (e.stderr || '') };
  }
}

function checkRepo(dir, name) {
  const result = { name, lint: null, test: null };
  try {
    const pkg = require(`${dir}/package.json`);
    if (pkg.scripts?.lint) result.lint = runCommand(dir, 'npm run lint');
    if (pkg.scripts?.test) result.test = runCommand(dir, 'npm test');
  } catch { /* no package.json yet */ }
  return result;
}

// ─── 3. Gemini ──────────────────────────────────────────
async function generarResumenGemini(commits, prs, checks) {
  if (!GEMINI_API_KEY) return null;

  const totalCommits = commits.back.length + commits.front.length;
  const commitsPorPersona = {};
  for (const c of [...commits.back, ...commits.front]) {
    const nombre = c.autor || 'desconocido';
    commitsPorPersona[nombre] = (commitsPorPersona[nombre] || 0) + 1;
  }
  const quienNoCommiteo = INTEGRANTES.filter(n => !commitsPorPersona[n]);
  const totalPRs = prs.back.length + prs.front.length;

  let infoLintTest = '';
  for (const c of checks) {
    if (c.lint) infoLintTest += `\n${c.name} lint: ${c.lint.ok ? 'OK' : 'ERROR: ' + c.lint.output.slice(0, 400)}`;
    if (c.test) infoLintTest += `\n${c.name} test: ${c.test.ok ? 'OK' : 'ERROR: ' + c.test.output.slice(0, 400)}`;
  }

  const prompt = `Sos el Agente Reportero de SmartMargin AI. Generá un reporte diario en español con estos datos reales:

Commits backend: ${totalCommits} | Commits frontend: ${commits.front.length}
${Object.entries(commitsPorPersona).map(([k, v]) => `- ${k}: ${v} commits`).join('\n')}
${quienNoCommiteo.length > 0 ? '⚠ SIN ACTIVIDAD HOY: ' + quienNoCommiteo.join(', ') : 'Todos tuvieron actividad.'}
PRs abiertos sin revisar: ${totalPRs}
${infoLintTest}

Estructura del reporte (usá estos títulos exactos):
1. "📊 ACTIVIDAD" — una frase por persona
2. "⚠️ ALERTAS" — quién no commiteó y qué PRs están demorados
3. "🧪 TESTS Y LINT" — si hay errores, decí quién probablemente los causó según los commits del día. Ej: "Pricila probablemente rompió el build con su último commit en product-list.component.ts"
4. "🧠 RECOMENDACIÓN" — 1 consejo útil para mañana basado en lo que ves

Reglas:
- No inventes datos ni nombres de archivo que no aparezcan en los errores
- Máximo 200 palabras
- Usá emojis
- Si no hay errores, felicitá al equipo`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const json = await res.json();
    return json.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch { return null; }
}

// ─── 4. Telegram ────────────────────────────────────────
async function enviarTelegram(texto) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const partes = texto.match(/[\s\S]{1,4000}/g) || [texto];
  for (const p of partes) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: p, parse_mode: 'HTML' }),
      });
    } catch (e) { console.error('Telegram error:', e.message); }
  }
}

// ─── MAIN ───────────────────────────────────────────────
async function main() {
  console.log('🚀 Reportero SmartMargin AI iniciando...\n');

  // 1. GitHub
  console.log('📡 GitHub API...');
  const [commitsBack, commitsFront, prsBack, prsFront] = await Promise.all([
    getCommits(BACKEND_REPO), getCommits(FRONTEND_REPO),
    getOpenPRs(BACKEND_REPO), getOpenPRs(FRONTEND_REPO),
  ]);
  console.log(`   Backend:  ${commitsBack.length} commits, ${prsBack.length} PRs`);
  console.log(`   Frontend: ${commitsFront.length} commits, ${prsFront.length} PRs`);

  // 2. Lint + Tests
  console.log('🧪 Lint y Tests...');
  const checks = [
    checkRepo(require('path').resolve(__dirname, '../../..', 'proybackendgrupo14'), 'Backend'),
    checkRepo(require('path').resolve(__dirname, '../../..', 'proyfrontendgrupo14'), 'Frontend'),
  ];
  for (const c of checks) {
    const li = c.lint ? (c.lint.ok ? '✅' : '❌') : '—';
    const te = c.test ? (c.test.ok ? '✅' : '❌') : '—';
    console.log(`   ${c.name}: lint ${li} | test ${te}`);
  }

  // 3. Gemini
  const commits = { back: commitsBack, front: commitsFront };
  const prs = { back: prsBack, front: prsFront };
  console.log('🧠 Gemini...');
  const resumenIA = await generarResumenGemini(commits, prs, checks);
  console.log('   ' + (resumenIA ? 'resumen generado' : 'no disponible'));

  // 4. Armar reporte
  const hoy = new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  let reporte = `<b>🤖 REPORTE DIARIO — SmartMargin AI</b>\n<b>📅 ${hoy}</b>\n`;

  if (resumenIA) {
    reporte += `\n${resumenIA}`;
  } else {
    // Reporte básico sin IA
    reporte += `\n━━━━ 📊 ACTIVIDAD\n`;
    const todos = [...commitsBack.map(c => ({ ...c, repo: 'BE' })), ...commitsFront.map(c => ({ ...c, repo: 'FE' }))];
    for (const i of INTEGRANTES) {
      const suyos = todos.filter(c => c.autor?.toLowerCase().includes(i.toLowerCase()));
      if (suyos.length) {
        reporte += `\n✅ ${i} (${suyos.length}): ${suyos.map(c => c.mensaje.slice(0, 50)).join(', ')}`;
      } else {
        reporte += `\n⚠️ ${i} — sin actividad hoy`;
      }
    }
    if (prsBack.length + prsFront.length > 0) {
      reporte += `\n\n━━━━ 📌 PRs ABIERTOS\n`;
      for (const pr of [...prsBack, ...prsFront]) {
        const h = Math.round((Date.now() - new Date(pr.creado).getTime()) / 3600000);
        reporte += `\n📌 ${pr.autor} — ${pr.titulo} (${h}h)`;
      }
    }
  }

  // 5. Telegram
  console.log('📨 Telegram...');
  await enviarTelegram(reporte);
  console.log('✅ Listo!\n');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
