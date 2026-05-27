#!/bin/bash
set -e

# ── HTML Design Skill ──────────────────────────
# 自包含入口脚本。所有路径相对于脚本自身。
# GitHub: https://github.com/Zealous1Epoch/html-design-skill
# ───────────────────────────────────────────────

SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"
WEB_DIR="$SKILL_DIR/web"

# ── 依赖检查 ──────────────────────────────────
check_deps() {
  if ! command -v node &>/dev/null; then
    echo "错误: 需要 Node.js (>= 18)。请先安装: https://nodejs.org"
    exit 1
  fi
  local node_ver=$(node -v | cut -d. -f1 | tr -d 'v')
  if [ "$node_ver" -lt 18 ]; then
    echo "错误: Node.js 版本过低 (需要 >= 18，当前 $(node -v))"
    exit 1
  fi
}

# ── 首次安装依赖 ──────────────────────────────
install_deps() {
  if [ ! -d "$WEB_DIR/node_modules" ]; then
    echo ""
    echo "  首次运行，正在安装依赖..."
    cd "$WEB_DIR" && npm install --silent 2>&1 | tail -1
    echo "  依赖安装完成。"
    echo ""
  fi
}

# ── 查找空闲端口 ──────────────────────────────
find_port() {
  local port=5199
  while lsof -i :$port &>/dev/null 2>&1; do
    port=$((port + 1))
    [ $port -gt 5299 ] && break
  done
  echo $port
}

# ── 主流程 ────────────────────────────────────

echo ""
echo "  HTML Design Skill"
echo "  ─────────────────"
echo ""

check_deps
install_deps

PORT=$(find_port)
PID_FILE="/tmp/html-design-skill-$PORT.pid"

# 启动 Vite dev server
cd "$WEB_DIR"
npx vite --port "$PORT" --host 2>&1 &
VITE_PID=$!
echo $VITE_PID > "$PID_FILE"

# 等待服务就绪
for i in $(seq 1 15); do
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" 2>/dev/null | grep -q 200; then
    break
  fi
  sleep 0.5
done

# 打开浏览器
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "http://localhost:$PORT"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  xdg-open "http://localhost:$PORT" 2>/dev/null || true
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
  start "http://localhost:$PORT" 2>/dev/null || true
fi

echo ""
echo "  配置页面: http://localhost:$PORT"
echo ""
echo "  在浏览器中完成设计选择后:"
echo "    · 点击「完成并返回」→ 结果自动回传"
echo "    · 或复制 Prompt 后按 Enter"

# 等待结果文件
RESULT_FILE="$HOME/.html-design/result.txt"

# 清除旧结果
rm -f "$RESULT_FILE"

echo "  等待配置完成..."
echo ""

# 轮询等待结果文件（最多等 5 分钟）
WAITED=0
while [ ! -f "$RESULT_FILE" ] && [ $WAITED -lt 300 ]; do
  sleep 1
  WAITED=$((WAITED + 1))
done

# 读取并输出结果
if [ -f "$RESULT_FILE" ]; then
  echo ""
  cat "$RESULT_FILE"
  echo ""
  echo "---"
  echo "  已获取设计规范。请按照以上规范生成 HTML 页面。"
  rm -f "$RESULT_FILE"
else
  # 超时，手动输入
  read -r -p "  等待超时。按 Enter 继续，或在终端中粘贴你的设计 Prompt..."
fi

# 清理
kill $VITE_PID 2>/dev/null || true
rm -f "$PID_FILE"

echo ""
