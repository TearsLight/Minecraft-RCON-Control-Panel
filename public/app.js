const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const connectForm = document.getElementById('connect-form');
const commandForm = document.getElementById('command-form');
const hostInput = document.getElementById('host');
const portInput = document.getElementById('port');
const passwordInput = document.getElementById('password');
const commandInput = document.getElementById('command');
const disconnectBtn = document.getElementById('disconnect-btn');
const sessionStatus = document.getElementById('session-status');
const loginMessage = document.getElementById('login-message');
const infoHost = document.getElementById('info-host');
const infoPort = document.getElementById('info-port');
const infoVersion = document.getElementById('info-version');
const infoPlayerCount = document.getElementById('info-player-count');
const playerList = document.getElementById('player-list');
const logOutput = document.getElementById('log-output');
const refreshInfoBtn = document.getElementById('refresh-info');
const cmdListBtn = document.getElementById('cmd-list');
const cmdVersionBtn = document.getElementById('cmd-version');
const cmdTimeDayBtn = document.getElementById('cmd-time-day');
const cmdWeatherClearBtn = document.getElementById('cmd-weather-clear');

const commandSuggestions = [
  'list',
  'version',
  'time set day',
  'time set night',
  'weather clear',
  'weather rain',
  'say Hello from RCON',
  'gamerule doDaylightCycle false',
  'gamemode creative @p',
  'gamemode survival @p',
  'op @p',
  'deop @p',
];

let serverConnected = false;
let statusRefreshTimer = null;

async function request(path, options = {}) {
  const response = await fetch(path, options);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || response.statusText || '请求失败');
  }
  return response.json();
}

function createLogLine(text, isError = false) {
  const line = document.createElement('div');
  line.className = `log-line${isError ? ' log-error' : ''}`;
  line.textContent = text;
  logOutput.prepend(line);
}

function setSessionStatus(text, isError = false) {
  sessionStatus.textContent = text;
  sessionStatus.style.color = isError ? 'var(--danger)' : 'var(--muted)';
}

function showDashboard() {
  loginScreen.classList.add('hidden');
  dashboard.classList.remove('hidden');
}

function showLogin() {
  loginScreen.classList.remove('hidden');
  dashboard.classList.add('hidden');
}

function updateInfoPanel(info) {
  infoHost.textContent = info.host || '-';
  infoPort.textContent = info.port || '-';
  infoVersion.textContent = info.version || '-';
  infoPlayerCount.textContent = info.players ? `${info.players.total}/${info.players.max}` : '-';

  if (info.players && info.players.names.length) {
    playerList.textContent = info.players.names.join('\n');
  } else {
    playerList.textContent = '暂无在线玩家';
  }
}

async function loadServerInfo() {
  try {
    const result = await request('/api/server-info');
    if (result.ok) {
      updateInfoPanel(result);
      createLogLine('已刷新服务器信息。');
    }
  } catch (error) {
    createLogLine(`刷新信息失败：${error.message}`, true);
  }
}

async function refreshStatus() {
  try {
    const result = await request('/api/status');
    serverConnected = result.connected;
    if (serverConnected) {
      setSessionStatus(`已连接 ${result.info.host}:${result.info.port}`);
      showDashboard();
      await loadServerInfo();
    } else {
      setSessionStatus('未连接', true);
      showLogin();
    }
  } catch (error) {
    setSessionStatus('无法获取状态', true);
    showLogin();
  }
}

connectForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginMessage.textContent = '';

  const host = hostInput.value.trim();
  const port = Number(portInput.value.trim());
  const password = passwordInput.value;

  if (!host || !port || !password) {
    loginMessage.textContent = '请填写服务器地址、端口和密码。';
    return;
  }

  try {
    const result = await request('/api/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, port, password }),
    });
    if (result.ok) {
      serverConnected = true;
      setSessionStatus(`已连接 ${result.info.host}:${result.info.port}`);
      createLogLine(`连接成功：${result.info.host}:${result.info.port}`);
      showDashboard();
      await loadServerInfo();
      if (!statusRefreshTimer) {
        statusRefreshTimer = setInterval(loadServerInfo, 15000);
      }
    }
  } catch (error) {
    loginMessage.textContent = `连接失败：${error.message}`;
    createLogLine(`连接失败：${error.message}`, true);
  }
});

commandForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const command = commandInput.value.trim();
  if (!command) {
    createLogLine('请输入要执行的命令。', true);
    return;
  }

  try {
    const result = await request('/api/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    createLogLine(`> ${command}`);
    createLogLine(result.response || '服务器返回空响应');
    commandInput.value = '';
  } catch (error) {
    createLogLine(`命令执行失败：${error.message}`, true);
  }
});

disconnectBtn.addEventListener('click', async () => {
  try {
    const result = await request('/api/disconnect', { method: 'POST' });
    if (result.ok) {
      serverConnected = false;
      setSessionStatus('已断开', true);
      showLogin();
      createLogLine('已断开 RCON 连接。');
      clearInterval(statusRefreshTimer);
      statusRefreshTimer = null;
    }
  } catch (error) {
    createLogLine(`断开失败：${error.message}`, true);
  }
});

refreshInfoBtn.addEventListener('click', async () => {
  await loadServerInfo();
});

cmdListBtn.addEventListener('click', async () => {
  commandInput.value = 'list';
  commandInput.focus();
});

cmdVersionBtn.addEventListener('click', async () => {
  commandInput.value = 'version';
  commandInput.focus();
});

cmdTimeDayBtn.addEventListener('click', async () => {
  commandInput.value = 'time set day';
  commandInput.focus();
});

cmdWeatherClearBtn.addEventListener('click', async () => {
  commandInput.value = 'weather clear';
  commandInput.focus();
});

showLogin();
setSessionStatus('未连接', true);
const options = document.getElementById('command-options');
if (options) {
  options.innerHTML = commandSuggestions.map((cmd) => `<option value="${cmd}"></option>`).join('');
}

refreshStatus();
