#!/usr/bin/env bash

echo "=========================================================="
echo "🚀 正在启动 Wujie (无界) 微前端企业级管理系统 + Hono 多语言服务..."
echo "=========================================================="

# 1. 启动 Hono 服务端 (Port 3000)
(cd server && npm run dev) &
PID_SERVER=$!

# 2. 启动 运营中心 (Port 5101)
(cd ops-app && npm run dev) &
PID_OPS=$!

# 3. 启动 财务中心 (Port 5102)
(cd finance-app && npm run dev) &
PID_FINANCE=$!

# 4. 启动 主基座系统 (Port 5100)
(cd main-app && npm run dev) &
PID_MAIN=$!

echo ""
echo "🌟 所有服务已在后台启动："
echo "   [Hono 后端服务] server:      http://localhost:3000"
echo "   [主基座系统]     main-app:    http://localhost:5100"
echo "   [运营中心子项]   ops-app:     http://localhost:5101"
echo "   [财务中心子项]   finance-app: http://localhost:5102"
echo ""
echo "💡 提示："
echo "   1. 访问主基座 http://localhost:5100 体验统一微前端后台管理及顶部语言切换 (中/英 同步)。"
echo "   2. 分别访问 http://localhost:5101 与 http://localhost:5102 可测试子系统的独立运行与 IndexedDB 离线缓存。"
echo "   3. 按 Ctrl + C 可一键停止全部 4 个服务。"
echo "=========================================================="

trap "kill $PID_SERVER $PID_OPS $PID_FINANCE $PID_MAIN 2>/dev/null; exit 0" INT TERM EXIT
wait
