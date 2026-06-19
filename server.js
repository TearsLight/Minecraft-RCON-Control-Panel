const express = require('express');
const path = require('path');
const { Rcon } = require('rcon-client');

const app = express();
const port = process.env.PORT || 8080;

let rcon = null;
let connectionInfo = null;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

async function closeRcon() {
  if (!rcon) return;
  try {
    await rcon.end();
  } catch (error) {
    console.warn('RCON close error:', error.message || error);
  }
  rcon = null;
  connectionInfo = null;
}

function parsePlayerList(raw) {
  const players = {
    total: 0,
    max: 0,
    names: [],
  };

  if (typeof raw !== 'string') {
    raw = String(raw || '');
  }

  const match = raw.match(/There are (\d+) of a max of (\d+) players(?:[:]?\s*(.*))?/i);
  if (match) {
    players.total = Number(match[1]);
    players.max = Number(match[2]);
    if (match[3]) {
      players.names = match[3].split(',').map((name) => name.trim()).filter(Boolean);
    }
  }

  return players;
}

/** 判断 RCON 返回是否是错误消息（命令不存在等） */
function isErrorResponse(raw) {
  if (!raw) return false;
  return /^Unknown or incomplete command/i.test(raw) ||
    /^Incorrect argument/i.test(raw) ||
    /^Error: /i.test(raw) ||
    /<--\[HERE\]/.test(raw);
}

/** 安全地执行一条可选命令，失败或返回错误时返回 null */
async function tryCommand(cmd) {
  if (!rcon) return null;
  try {
    const result = String(await rcon.send(cmd));
    return isErrorResponse(result) ? null : result;
  } catch {
    return null;
  }
}

/** 尝试解析 TPS（Paper/Spigot 服务端） */
function parseTPS(raw) {
  if (!raw || isErrorResponse(raw)) return null;
  const match = raw.match(/TPS from last[\s\S]*?:\s*([\d.]+)\s*,?\s*([\d.]+)?\s*,?\s*([\d.]+)?/i);
  if (match) {
    return match[1];
  }
  const numMatch = raw.match(/([\d.]+)/);
  return numMatch ? numMatch[1] : null;
}

/** 尝试解析 MSPT（Paper/Spigot 服务端） */
function parseMSPT(raw) {
  if (!raw || isErrorResponse(raw)) return null;
  const match = raw.match(/MSPT[\s\S]*?:\s*([\d.]+)/i);
  if (match) return match[1];
  return null;
}

/** 尝试解析 mod 列表 */
function parseMods(raw) {
  if (!raw || isErrorResponse(raw)) return null;
  const lines = raw.split('\n').filter(Boolean);
  const mods = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // 跳过标题行和错误行
    if (trimmed.match(/^(Mod|Plugin|Server Mod|模组|Unknown|Usage:)/i)) continue;
    if (isErrorResponse(trimmed)) continue;
    // 提取 mod 名
    const cleaned = trimmed.replace(/^[-\s•]+/, '').replace(/\s+v?\d[\d.]*.*$/, '').trim();
    if (cleaned && cleaned.length < 100) mods.push(cleaned);
  }
  return mods.length > 0 ? mods : null;
}

app.post('/api/connect', async (req, res) => {
  const { host, port: portValue, password } = req.body;
  if (!host || !portValue || !password) {
    return res.status(400).json({ error: 'host、port、password 都不能为空' });
  }

  try {
    if (rcon) {
      await closeRcon();
    }

    rcon = await Rcon.connect({
      host,
      port: Number(portValue),
      password,
    });

    connectionInfo = {
      host,
      port: Number(portValue),
    };

    res.json({ ok: true, info: connectionInfo });
  } catch (error) {
    await closeRcon();
    res.status(500).json({ error: error.message || '连接失败' });
  }
});

app.post('/api/command', async (req, res) => {
  const { command } = req.body;
  if (!rcon) {
    return res.status(400).json({ error: '尚未连接 RCON' });
  }
  if (!command || !command.trim()) {
    return res.status(400).json({ error: 'command 不能为空' });
  }

  try {
    const response = await rcon.send(command.trim());
    res.json({ ok: true, response: String(response) });
  } catch (error) {
    res.status(500).json({ error: error.message || '命令执行失败' });
  }
});

app.post('/api/disconnect', async (req, res) => {
  if (!rcon) {
    return res.status(400).json({ error: '当前没有连接' });
  }

  try {
    await closeRcon();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message || '断开失败' });
  }
});

app.get('/api/server-info', async (req, res) => {
  if (!rcon) {
    return res.status(400).json({ error: '未连接 RCON' });
  }

  try {
    const listRaw = String(await rcon.send('list'));
    const players = parsePlayerList(listRaw);

    // 尝试获取版本（支持不同服务端）
    let versionRaw = await tryCommand('version');
    if (!versionRaw) versionRaw = await tryCommand('bukkit:version');
    if (!versionRaw) versionRaw = await tryCommand('minecraft:version');
    if (!versionRaw) versionRaw = await tryCommand('about');

    // 尝试获取 TPS / MSPT（Paper/Spigot 专有）
    const tpsRaw = await tryCommand('tps');
    const tps = parseTPS(tpsRaw);
    const mspt = parseMSPT(tpsRaw);

    // 尝试获取 mod 列表（Forge/Fabric）
    let modsRaw = await tryCommand('mods');
    if (!modsRaw) modsRaw = await tryCommand('forge mods');
    if (!modsRaw) modsRaw = await tryCommand('fabric mods');
    const mods = parseMods(modsRaw);

    res.json({
      ok: true,
      players,
      version: versionRaw || '未知',
      tps: tps || undefined,
      mspt: mspt || undefined,
      mods: mods || undefined,
      raw: {
        list: listRaw,
        version: versionRaw || undefined,
        tps: tpsRaw || undefined,
        mods: modsRaw || undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || '获取服务器信息失败' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`端口 ${port} 已被占用，请先释放该端口或修改环境变量 PORT。`);
  } else {
    console.error('启动服务器时发生错误：', error);
  }
  process.exit(1);
});
