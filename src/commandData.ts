import { allItems } from './allData';

export interface CommandParameter {
  type: 'literal' | 'choice' | 'string' | 'number' | 'player' | 'selector' | 'item' | 'entity' | 'block' | 'effect' | 'enchantment';
  name: string;
  optional?: boolean;
  choices?: string[];
  description?: string;
}

export interface CommandEntry {
  name: string;
  description: string;
  permission: number;
  aliases?: string[];
  syntax?: string;
  parameters?: CommandParameter[];
  note?: string;
  category?: CommandCategory;
}

export type CommandCategory =
  | '玩家管理'
  | '游戏模式'
  | '世界管理'
  | '物品与方块'
  | '实体与生物'
  | '信息与聊天'
  | '进度与记分板'
  | '服务器管理'
  | '命令执行'
  | '其他';

export const commandData: CommandEntry[] = [
  // ── 玩家管理 ──
  { name: '/ban', description: '将玩家加入封禁列表', permission: 3, category: '玩家管理', syntax: '/ban <玩家名> [原因]', parameters: [{ type: 'player', name: '玩家名' }, { type: 'string', name: '原因', optional: true }] },
  { name: '/ban-ip', description: '将 IP 地址加入封禁列表', permission: 3, category: '玩家管理', syntax: '/ban-ip <IP|玩家名> [原因]', parameters: [{ type: 'string', name: 'IP或玩家名' }, { type: 'string', name: '原因', optional: true }] },
  { name: '/banlist', description: '显示封禁列表', permission: 3, category: '玩家管理', syntax: '/banlist [players|ips]', parameters: [{ type: 'choice', name: '类型', optional: true, choices: ['players', 'ips'] }] },
  { name: '/deop', description: '撤销玩家的管理员权限', permission: 3, category: '玩家管理', syntax: '/deop <玩家名>', parameters: [{ type: 'player', name: '玩家名' }] },
  { name: '/kick', description: '将玩家踢出服务器', permission: 3, category: '玩家管理', syntax: '/kick <玩家名> [原因]', parameters: [{ type: 'player', name: '玩家名' }, { type: 'string', name: '原因', optional: true }] },
  { name: '/op', description: '授予玩家管理员权限', permission: 3, category: '玩家管理', syntax: '/op <玩家名>', parameters: [{ type: 'player', name: '玩家名' }] },
  { name: '/pardon', description: '解封玩家', permission: 3, category: '玩家管理', syntax: '/pardon <玩家名>', parameters: [{ type: 'player', name: '玩家名' }] },
  { name: '/pardon-ip', description: '解封指定 IP', permission: 3, category: '玩家管理', syntax: '/pardon-ip <IP>', parameters: [{ type: 'string', name: 'IP' }] },
  { name: '/whitelist', description: '管理服务器白名单', permission: 3, category: '玩家管理', syntax: '/whitelist (add|list|off|on|reload|remove)', parameters: [{ type: 'choice', name: '操作', choices: ['add', 'list', 'off', 'on', 'reload', 'remove'] }, { type: 'player', name: '玩家名', optional: true }] },
  { name: '/list', description: '列出服务器中的玩家', permission: 0, category: '玩家管理', syntax: '/list [uuids]', parameters: [{ type: 'literal', name: 'uuids', optional: true }] },
  { name: '/setidletimeout', description: '设置无操作玩家被踢出的延时（分钟）', permission: 3, category: '玩家管理', syntax: '/setidletimeout <分钟>', parameters: [{ type: 'number', name: '分钟' }] },
  { name: '/transfer', description: '将玩家转移到另一个服务器', permission: 3, category: '玩家管理', syntax: '/transfer <玩家名> <主机> [端口]', parameters: [{ type: 'player', name: '玩家名' }, { type: 'string', name: '主机' }, { type: 'number', name: '端口', optional: true }] },

  // ── 游戏模式 ──
  { name: '/defaultgamemode', description: '设置默认游戏模式', permission: 2, category: '游戏模式', syntax: '/defaultgamemode <模式>', parameters: [{ type: 'choice', name: '模式', choices: ['creative', 'survival', 'adventure', 'spectator'] }] },
  { name: '/gamemode', description: '更改玩家的游戏模式', permission: 2, category: '游戏模式', syntax: '/gamemode <模式> [玩家]', parameters: [{ type: 'choice', name: '模式', choices: ['creative', 'survival', 'adventure', 'spectator'] }, { type: 'player', name: '玩家', optional: true }] },
  { name: '/difficulty', description: '设置游戏难度', permission: 2, category: '游戏模式', syntax: '/difficulty <难度>', parameters: [{ type: 'choice', name: '难度', choices: ['peaceful', 'easy', 'normal', 'hard'] }] },

  // ── 世界管理 ──
  { name: '/time', description: '更改或查询世界时间', permission: 2, category: '世界管理', syntax: '/time (add|query|set) <值>', parameters: [
    { type: 'choice', name: '操作', choices: ['add', 'query', 'set'] },
    { type: 'choice', name: '值', choices: ['day', 'night', 'noon', 'midnight', 'daytime', 'gametime'], description: 'set: day=1000 night=13000 noon=6000 midnight=18000' }
  ] },
  { name: '/weather', description: '设置天气', permission: 2, category: '世界管理', syntax: '/weather <类型> [持续时间秒]', parameters: [{ type: 'choice', name: '类型', choices: ['clear', 'rain', 'thunder'] }, { type: 'number', name: '持续时间(秒)', optional: true }] },
  { name: '/gamerule', description: '更改或查询游戏规则', permission: 2, category: '世界管理', syntax: '/gamerule <规则> [值]', parameters: [
    { type: 'choice', name: '规则', choices: ['announceAdvancements', 'commandBlockOutput', 'disableElytraMovementCheck', 'disableRaids', 'doDaylightCycle', 'doEntityDrops', 'doFireTick', 'doInsomnia', 'doImmediateRespawn', 'doLimitedCrafting', 'doMobLoot', 'doMobSpawning', 'doPatrolSpawning', 'doTileDrops', 'doTraderSpawning', 'doVinesSpread', 'doWeatherCycle', 'doWardenSpawning', 'drowningDamage', 'enderPearlsVanishOnDeath', 'fallDamage', 'fireDamage', 'forgiveDeadPlayers', 'freezeDamage', 'globalSoundEvents', 'keepInventory', 'lavaSourceConversion', 'logAdminCommands', 'maxCommandChainLength', 'maxEntityCramming', 'mobExplosionDropDecay', 'mobGriefing', 'naturalRegeneration', 'playersNetherPortalCreativeDelay', 'playersNetherPortalDefaultDelay', 'playersSleepingPercentage', 'projectilesCanBreakBlocks', 'randomTickSpeed', 'reducedDebugInfo', 'sendCommandFeedback', 'showDeathMessages', 'snowAccumulationHeight', 'spawnRadius', 'spectatorsGenerateChunks', 'tntExplodes', 'tntExplosionDropDecay', 'universalAnger', 'waterSourceConversion'] },
    { type: 'choice', name: '值', optional: true, choices: ['true', 'false'] }
  ] },
  { name: '/seed', description: '显示世界种子', permission: 0, category: '世界管理', syntax: '/seed' },
  { name: '/worldborder', description: '管理世界边界', permission: 2, category: '世界管理', syntax: '/worldborder <操作> [参数]', parameters: [
    { type: 'choice', name: '操作', choices: ['add', 'center', 'damage', 'get', 'set', 'warning'] },
    { type: 'number', name: '距离/数值', optional: true }
  ] },
  { name: '/setworldspawn', description: '设置世界出生点', permission: 2, category: '世界管理', syntax: '/setworldspawn [坐标]', parameters: [{ type: 'string', name: '坐标', optional: true }] },
  { name: '/spawnpoint', description: '设置玩家出生点', permission: 2, category: '世界管理', syntax: '/spawnpoint [玩家] [坐标] [角度]', parameters: [{ type: 'player', name: '玩家', optional: true }, { type: 'string', name: '坐标', optional: true }] },
  { name: '/locate', description: '查找最近的结构/生物群系/兴趣点', permission: 2, category: '世界管理', syntax: '/locate (structure|biome|poi) <目标>', parameters: [
    { type: 'choice', name: '类型', choices: ['structure', 'biome', 'poi'] },
    { type: 'string', name: '目标' }
  ] },

  // ── 物品与方块 ──
  { name: '/give', description: '给予玩家物品', permission: 2, category: '物品与方块', syntax: '/give <玩家> <物品> [数量]', parameters: [{ type: 'player', name: '玩家' }, { type: 'item', name: '物品ID' }, { type: 'number', name: '数量', optional: true }] },
  { name: '/clear', description: '清除玩家物品栏', permission: 2, category: '物品与方块', syntax: '/clear [玩家] [物品] [数量]', parameters: [{ type: 'player', name: '玩家', optional: true }, { type: 'item', name: '物品ID', optional: true }, { type: 'number', name: '数量', optional: true }] },
  { name: '/clone', description: '复制区域方块', permission: 2, category: '物品与方块', syntax: '/clone <起点> <终点> <目标> [模式]', parameters: [{ type: 'string', name: '起点坐标' }, { type: 'string', name: '终点坐标' }, { type: 'string', name: '目标坐标' }, { type: 'choice', name: '模式', optional: true, choices: ['replace', 'masked', 'filtered'] }] },
  { name: '/fill', description: '填充区域方块', permission: 2, category: '物品与方块', syntax: '/fill <起点> <终点> <方块> [模式]', parameters: [{ type: 'string', name: '起点坐标' }, { type: 'string', name: '终点坐标' }, { type: 'block', name: '方块ID' }, { type: 'choice', name: '模式', optional: true, choices: ['destroy', 'hollow', 'keep', 'outline', 'replace'] }] },
  { name: '/fillbiome', description: '设置区域生物群系', permission: 2, category: '物品与方块', syntax: '/fillbiome <起点> <终点> <群系>' },
  { name: '/setblock', description: '放置/替换方块', permission: 2, category: '物品与方块', syntax: '/setblock <坐标> <方块> [模式]', parameters: [{ type: 'string', name: '坐标' }, { type: 'block', name: '方块ID' }, { type: 'choice', name: '模式', optional: true, choices: ['destroy', 'keep', 'replace'] }] },
  { name: '/item', description: '修改物品栏中的物品', permission: 2, category: '物品与方块', syntax: '/item (modify|replace) <目标> ...', parameters: [{ type: 'choice', name: '操作', choices: ['modify', 'replace'] }] },
  { name: '/loot', description: '生成战利品', permission: 2, category: '物品与方块', syntax: '/loot <操作> <目标> ...', parameters: [{ type: 'choice', name: '操作', choices: ['give', 'insert', 'spawn', 'replace'] }] },
  { name: '/recipe', description: '给予或剥夺合成配方', permission: 2, category: '物品与方块', syntax: '/recipe (give|take) <玩家> [配方]', parameters: [{ type: 'choice', name: '操作', choices: ['give', 'take'] }, { type: 'player', name: '玩家' }, { type: 'string', name: '配方', optional: true }] },
  { name: '/enchant', description: '附魔玩家手持物品', permission: 2, category: '物品与方块', syntax: '/enchant <玩家> <魔咒> [等级]', parameters: [{ type: 'player', name: '玩家' }, { type: 'enchantment', name: '魔咒ID' }, { type: 'number', name: '等级', optional: true }] },

  // ── 实体与生物 ──
  { name: '/summon', description: '生成实体', permission: 2, category: '实体与生物', syntax: '/summon <实体ID> [坐标] [NBT]', parameters: [{ type: 'entity', name: '实体ID' }, { type: 'string', name: '坐标', optional: true }] },
  { name: '/kill', description: '清除实体', permission: 2, category: '实体与生物', syntax: '/kill [目标]', parameters: [{ type: 'selector', name: '目标', optional: true }] },
  { name: '/damage', description: '对实体造成伤害', permission: 2, category: '实体与生物', syntax: '/damage <目标> <数值> [伤害类型]', parameters: [{ type: 'selector', name: '目标' }, { type: 'number', name: '伤害值' }, { type: 'string', name: '伤害类型', optional: true }] },
  { name: '/effect', description: '管理状态效果', permission: 2, category: '实体与生物', syntax: '/effect (give|clear) <目标> [效果] [秒] [等级] [隐藏粒子]', parameters: [
    { type: 'choice', name: '操作', choices: ['give', 'clear'] },
    { type: 'selector', name: '目标' },
    { type: 'string', name: '效果ID', optional: true },
    { type: 'number', name: '持续时间(秒)', optional: true }
  ] },
  { name: '/ride', description: '控制实体骑乘', permission: 2, category: '实体与生物', syntax: '/ride <目标> (mount|dismount|...)', parameters: [{ type: 'selector', name: '目标' }, { type: 'choice', name: '操作', choices: ['mount', 'dismount', 'start_riding', 'stop_riding'] }] },
  { name: '/tag', description: '修改实体标签', permission: 2, category: '实体与生物', syntax: '/tag <目标> (add|list|remove) [标签]', parameters: [{ type: 'selector', name: '目标' }, { type: 'choice', name: '操作', choices: ['add', 'list', 'remove'] }, { type: 'string', name: '标签名', optional: true }] },
  { name: '/teleport', description: '传送实体', permission: 2, category: '实体与生物', aliases: ['/tp'], syntax: '/tp <目标> [目的地]', parameters: [{ type: 'selector', name: '目标' }, { type: 'string', name: '目的地/坐标', optional: true }] },
  { name: '/spreadplayers', description: '将实体随机散布', permission: 2, category: '实体与生物', syntax: '/spreadplayers <中心X> <中心Z> <间距> <范围> <队伍> <目标>' },
  { name: '/attribute', description: '修改实体属性', permission: 2, category: '实体与生物', syntax: '/attribute <目标> <属性> (get|base|modifier) ...', parameters: [{ type: 'selector', name: '目标' }, { type: 'string', name: '属性ID' }, { type: 'choice', name: '操作', choices: ['get', 'base', 'modifier'] }] },
  { name: '/spectate', description: '旁观实体', permission: 2, category: '实体与生物', syntax: '/spectate [目标] [玩家]', parameters: [{ type: 'selector', name: '旁观目标', optional: true }, { type: 'player', name: '玩家', optional: true }] },
  { name: '/rotate', description: '旋转实体', permission: 2, category: '实体与生物', syntax: '/rotate <目标> <朝向>', parameters: [{ type: 'selector', name: '目标' }, { type: 'string', name: '朝向' }] },
  { name: '/swing', description: '控制实体手臂挥动', permission: 2, category: '实体与生物', syntax: '/swing <目标> <手臂>', parameters: [{ type: 'selector', name: '目标' }, { type: 'choice', name: '手臂', choices: ['mainhand', 'offhand'] }] },

  // ── 信息与聊天 ──
  { name: '/say', description: '向全服发送消息', permission: 2, category: '信息与聊天', syntax: '/say <消息>', parameters: [{ type: 'string', name: '消息' }] },
  { name: '/tellraw', description: '发送 JSON 文本消息', permission: 2, category: '信息与聊天', syntax: '/tellraw <目标> <JSON消息>', parameters: [{ type: 'player', name: '目标' }, { type: 'string', name: 'JSON消息' }] },
  { name: '/msg', description: '发送私信', permission: 0, category: '信息与聊天', aliases: ['/tell', '/w'], syntax: '/msg <玩家> <消息>', parameters: [{ type: 'player', name: '玩家' }, { type: 'string', name: '消息' }] },
  { name: '/me', description: '显示动作消息', permission: 0, category: '信息与聊天', syntax: '/me <动作>', parameters: [{ type: 'string', name: '动作描述' }] },
  { name: '/teammsg', description: '发送队伍消息', permission: 0, category: '信息与聊天', aliases: ['/tm'], syntax: '/teammsg <消息>', parameters: [{ type: 'string', name: '消息' }] },
  { name: '/help', description: '显示命令帮助', permission: 0, category: '信息与聊天', aliases: ['/?'], syntax: '/help [命令]', parameters: [{ type: 'string', name: '命令名', optional: true }] },
  { name: '/version', description: '显示服务器版本', permission: 0, category: '信息与聊天', syntax: '/version' },
  { name: '/title', description: '管理屏幕标题', permission: 2, category: '信息与聊天', syntax: '/title <玩家> (clear|reset|title|subtitle|actionbar|times)', parameters: [
    { type: 'player', name: '玩家' },
    { type: 'choice', name: '操作', choices: ['clear', 'reset', 'title', 'subtitle', 'actionbar', 'times'] },
    { type: 'string', name: '内容', optional: true }
  ] },

  // ── 进度与记分板 ──
  { name: '/advancement', description: '管理玩家进度', permission: 2, category: '进度与记分板', syntax: '/advancement (grant|revoke) <玩家> (everything|from|only|through|until) [进度]', parameters: [
    { type: 'choice', name: '操作', choices: ['grant', 'revoke'] },
    { type: 'player', name: '玩家' },
    { type: 'choice', name: '范围', choices: ['everything', 'from', 'only', 'through', 'until'] }
  ] },
  { name: '/scoreboard', description: '管理记分板', permission: 2, category: '进度与记分板', syntax: '/scoreboard (objectives|players) ...', parameters: [
    { type: 'choice', name: '类型', choices: ['objectives', 'players'] },
    { type: 'choice', name: '操作', optional: true, choices: ['add', 'list', 'modify', 'remove', 'setdisplay'] }
  ] },
  { name: '/team', description: '管理队伍', permission: 2, category: '进度与记分板', syntax: '/team (add|empty|join|leave|list|modify|remove)', parameters: [{ type: 'choice', name: '操作', choices: ['add', 'empty', 'join', 'leave', 'list', 'modify', 'remove'] }] },
  { name: '/bossbar', description: '管理 Boss 栏', permission: 2, category: '进度与记分板', syntax: '/bossbar (add|get|list|remove|set) ...', parameters: [{ type: 'choice', name: '操作', choices: ['add', 'get', 'list', 'remove', 'set'] }] },
  { name: '/experience', description: '管理玩家经验值', permission: 2, category: '进度与记分板', aliases: ['/xp'], syntax: '/xp (add|set|query) <玩家> <数值> [points|levels]', parameters: [
    { type: 'choice', name: '操作', choices: ['add', 'set', 'query'] },
    { type: 'player', name: '玩家' },
    { type: 'number', name: '数值', optional: true },
    { type: 'choice', name: '类型', optional: true, choices: ['points', 'levels'] }
  ] },
  { name: '/trigger', description: '触发记分板触发器', permission: 0, category: '进度与记分板', syntax: '/trigger <目标> [add|set] [值]' },

  // ── 服务器管理 ──
  { name: '/save-all', description: '保存服务器到硬盘', permission: 4, category: '服务器管理', syntax: '/save-all [flush]', parameters: [{ type: 'literal', name: 'flush', optional: true }] },
  { name: '/save-off', description: '关闭自动保存', permission: 4, category: '服务器管理', syntax: '/save-off' },
  { name: '/save-on', description: '开启自动保存', permission: 4, category: '服务器管理', syntax: '/save-on' },
  { name: '/stop', description: '关闭服务器', permission: 4, category: '服务器管理', syntax: '/stop' },
  { name: '/reload', description: '重新加载数据包', permission: 2, category: '服务器管理', syntax: '/reload' },
  { name: '/debug', description: '调试分析', permission: 3, category: '服务器管理', syntax: '/debug (start|stop|function)', parameters: [{ type: 'choice', name: '操作', choices: ['start', 'stop', 'function'] }] },
  { name: '/perf', description: '性能分析（10秒）', permission: 4, category: '服务器管理', syntax: '/perf (start|stop)', parameters: [{ type: 'choice', name: '操作', choices: ['start', 'stop'] }] },
  { name: '/jfr', description: 'JFR 分析', permission: 4, category: '服务器管理', syntax: '/jfr (start|stop)', parameters: [{ type: 'choice', name: '操作', choices: ['start', 'stop'] }] },
  { name: '/datapack', description: '管理数据包', permission: 2, category: '服务器管理', syntax: '/datapack (disable|enable|list) [名称]', parameters: [{ type: 'choice', name: '操作', choices: ['disable', 'enable', 'list'] }, { type: 'string', name: '数据包名', optional: true }] },
  { name: '/function', description: '运行函数', permission: 2, category: '服务器管理', syntax: '/function <函数名>', parameters: [{ type: 'string', name: '函数名(命名空间:路径)' }] },
  { name: '/schedule', description: '定时执行函数', permission: 2, category: '服务器管理', syntax: '/schedule (function|clear) ...', parameters: [{ type: 'choice', name: '操作', choices: ['function', 'clear'] }] },
  { name: '/forceload', description: '强制加载区块', permission: 2, category: '服务器管理', syntax: '/forceload (add|remove|query) [坐标]', parameters: [{ type: 'choice', name: '操作', choices: ['add', 'remove', 'query'] }] },
  { name: '/publish', description: '开放局域网', permission: 4, category: '服务器管理', syntax: '/publish [端口]', parameters: [{ type: 'number', name: '端口', optional: true }] },
  { name: '/unpublish', description: '停止局域网开放', permission: 4, category: '服务器管理', syntax: '/unpublish' },

  // ── 命令执行 ──
  { name: '/execute', description: '改变执行上下文并运行命令', permission: 2, category: '命令执行', syntax: '/execute (as|at|positioned|if|unless|run|...)', parameters: [
    { type: 'choice', name: '子命令', choices: ['align', 'anchored', 'as', 'at', 'facing', 'in', 'on', 'positioned', 'rotated', 'if', 'unless', 'run', 'store'] }
  ] },
  { name: '/data', description: '操作 NBT 数据', permission: 2, category: '命令执行', syntax: '/data (get|merge|modify|remove) ...', parameters: [{ type: 'choice', name: '操作', choices: ['get', 'merge', 'modify', 'remove'] }] },
  { name: '/return', description: '函数返回值', permission: 2, category: '命令执行', syntax: '/return <值>', parameters: [{ type: 'string', name: '返回值' }] },
  { name: '/random', description: '生成随机值', permission: 0, category: '命令执行', syntax: '/random (value|roll|reset) ...', parameters: [{ type: 'choice', name: '操作', choices: ['value', 'roll', 'reset'] }], note: '管理序列需要权限2' },
  { name: '/tick', description: '控制游戏刻', permission: 3, category: '命令执行', syntax: '/tick (query|rate|sprint|step|freeze|unfreeze)', parameters: [{ type: 'choice', name: '操作', choices: ['query', 'rate', 'sprint', 'step', 'freeze', 'unfreeze'] }] },
  { name: '/test', description: '运行游戏测试', permission: 2, category: '命令执行', syntax: '/test ...' },
  { name: '/stopwatch', description: '管理秒表', permission: 2, category: '命令执行', syntax: '/stopwatch (start|stop|reset|query|list)', parameters: [{ type: 'choice', name: '操作', choices: ['start', 'stop', 'reset', 'query', 'list'] }] },

  // ── 其他 ──
  { name: '/particle', description: '创建粒子效果', permission: 2, category: '其他', syntax: '/particle <名称> [坐标] [偏移] [速度] [数量]', parameters: [{ type: 'string', name: '粒子名称' }, { type: 'string', name: '坐标', optional: true }] },
  { name: '/playsound', description: '播放音效', permission: 2, category: '其他', syntax: '/playsound <音效> <来源> <目标> [坐标] [音量] [音高]', parameters: [{ type: 'string', name: '音效ID' }, { type: 'choice', name: '来源', choices: ['master', 'music', 'record', 'weather', 'block', 'hostile', 'neutral', 'player', 'ambient', 'voice'] }, { type: 'player', name: '目标' }] },
  { name: '/stopsound', description: '停止播放音效', permission: 2, category: '其他', syntax: '/stopsound <目标> [来源] [音效]', parameters: [{ type: 'player', name: '目标' }, { type: 'choice', name: '来源', optional: true, choices: ['master', 'music', 'record', 'weather', 'block', 'hostile', 'neutral', 'player', 'ambient', 'voice'] }] },
  { name: '/dialog', description: '管理对话框', permission: 2, category: '其他', syntax: '/dialog (show|clear) <玩家> ...', parameters: [{ type: 'choice', name: '操作', choices: ['show', 'clear'] }, { type: 'player', name: '玩家' }] },
  { name: '/place', description: '放置地物/拼图/结构', permission: 2, category: '其他', syntax: '/place (feature|jigsaw|structure|template) <目标> [坐标]', parameters: [{ type: 'choice', name: '类型', choices: ['feature', 'jigsaw', 'structure', 'template'] }, { type: 'string', name: '目标ID' }] },
  { name: '/fetchprofile', description: '获取玩家档案信息', permission: 2, category: '其他', syntax: '/fetchprofile <玩家名>', parameters: [{ type: 'player', name: '玩家名' }] },
  { name: '/waypoint', description: '管理路径点', permission: 2, category: '其他', syntax: '/waypoint (list|...)', parameters: [{ type: 'choice', name: '操作', choices: ['list'] }] },

  // 调试命令
  { name: '/warden_spawn_tracker', description: '设置幽匿尖啸体生成监守者的振动计数', permission: 2, category: '其他', note: '仅专用服务器，调试工具开启时可用' },
  { name: '/debugpath', description: '测试生物寻路', permission: 2, category: '其他', note: '仅专用服务器，调试工具开启时可用' },
  { name: '/debugmobspawning', description: '测试生物生成', permission: 2, category: '其他', note: '仅专用服务器，调试工具开启时可用' },
  { name: '/raid', description: '管理袭击', permission: 3, category: '其他', note: '仅专用服务器，调试工具开启时可用' },
  { name: '/serverpack', description: '配置服务端资源包', permission: 2, category: '其他', note: '仅专用服务器，调试工具开启时可用' },
  { name: '/spawn_armor_trims', description: '生成盔甲纹饰组合', permission: 2, category: '其他', note: '仅专用服务器，调试工具开启时可用' },
  { name: '/debugconfig', description: '调试网络配置阶段', permission: 3, category: '其他', note: '仅专用服务器，调试工具开启时可用' },
  { name: '/chase', description: '同步玩家移动（跨实例）', permission: 0, category: '其他', note: '仅当 MC_DEBUG_CHASE_COMMAND 启用时可用' },
];

/** 根据输入上下文获取自动补全建议 */
export function getAutocompleteSuggestions(input: string): { type: 'command' | 'parameter'; text: string; description?: string }[] {
  const trimmed = input.replace(/^\/+/, '').trim();
  if (!trimmed) {
    return commandData.map(c => ({ type: 'command' as const, text: c.name, description: c.description }));
  }

  const parts = trimmed.split(/\s+/);
  const firstPart = parts[0].toLowerCase();

  const matchedCommands = commandData.filter(c => {
    const cmdName = c.name.replace(/^\//, '').toLowerCase();
    const aliases = (c.aliases || []).map(a => a.replace(/^\//, '').toLowerCase());
    return cmdName.startsWith(firstPart) || aliases.some(a => a.startsWith(firstPart));
  });

  if (parts.length > 1 && matchedCommands.length === 1) {
    const cmd = matchedCommands[0];
    const exactMatch =
      cmd.name.replace(/^\//, '').toLowerCase() === firstPart ||
      (cmd.aliases || []).some(a => a.replace(/^\//, '').toLowerCase() === firstPart);

    if (exactMatch && cmd.parameters) {
      const argIndex = parts.length - 2;
      const param = cmd.parameters[argIndex];

      if (param && param.choices) {
        const currentArg = parts[parts.length - 1].toLowerCase();
        const matching = param.choices.filter(c => c.toLowerCase().startsWith(currentArg));
        return matching.length > 0
          ? matching.map(c => ({ type: 'parameter' as const, text: c, description: param.description }))
          : param.choices.map(c => ({ type: 'parameter' as const, text: c, description: param.description }));
      }

      // 智能补全：item / block / entity / effect / enchantment 类型从物品库搜索
      if (param && (param.type === 'item' || param.type === 'block' || param.type === 'entity' || param.type === 'effect' || param.type === 'enchantment')) {
        const currentArg = parts[parts.length - 1].toLowerCase();
        const matching = allItems
          .filter(item => item.id.toLowerCase().startsWith(currentArg) || item.name.includes(currentArg))
          .slice(0, 10);
        return matching.map(item => ({
          type: 'parameter' as const,
          text: item.id,
          description: `${item.name}`,
        }));
      }

      if (param) return [];
      return [];
    }
  }

  return matchedCommands.slice(0, 8).map(c => ({
    type: 'command' as const,
    text: c.name,
    description: c.syntax || c.description,
  }));
}

/** 命令分组 */
export const commandCategories: { key: CommandCategory; label: string }[] = [
  { key: '玩家管理', label: '👥 玩家管理' },
  { key: '游戏模式', label: '🎮 游戏模式' },
  { key: '世界管理', label: '🌍 世界管理' },
  { key: '物品与方块', label: '🧱 物品与方块' },
  { key: '实体与生物', label: '🐾 实体与生物' },
  { key: '信息与聊天', label: '💬 信息与聊天' },
  { key: '进度与记分板', label: '📊 进度与记分板' },
  { key: '服务器管理', label: '⚙️ 服务器管理' },
  { key: '命令执行', label: '🔧 命令执行' },
  { key: '其他', label: '📦 其他' },
];
