#!/bin/bash

# GitHub仓库监控系统 - 一键启动脚本
# Author: Jim
# Description: 自动化启动GitHub仓库监控和简历更新系统

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 图标定义
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
ROCKET="🚀"
GEAR="⚙️"
MONITOR="📊"

# 项目目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="GitHub Resume Monitor"

# 日志函数
log_info() {
    echo -e "${BLUE}${INFO} [INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}${SUCCESS} [SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}${WARNING} [WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}${ERROR} [ERROR]${NC} $1"
}

log_header() {
    echo -e "${PURPLE}${ROCKET} $1${NC}"
}

# 显示帮助信息
show_help() {
    cat << EOF
${PROJECT_NAME} - 一键启动脚本

用法: $0 [选项]

选项:
    -h, --help          显示此帮助信息
    -o, --once          运行一次分析后退出
    -n, --no-notify     运行时不发送通知
    -d, --daemon        后台运行（守护进程模式）
    -s, --setup         首次设置和安装依赖
    -c, --config        重新配置环境变量
    -t, --test          测试配置和连接
    --docker            使用Docker容器运行
    --stop              停止后台运行的进程
    --status            查看运行状态
    --logs              查看运行日志

示例:
    $0                  # 正常启动监控系统
    $0 --once           # 运行一次分析
    $0 --daemon         # 后台运行
    $0 --setup          # 首次安装设置
    $0 --docker         # 使用Docker运行
    $0 --stop           # 停止后台进程

EOF
}

# 检查环境
check_environment() {
    log_info "检查运行环境..."
    
    # 检查Python
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 未安装，请先安装Python 3.7+"
        exit 1
    fi
    
    local python_version=$(python3 --version | cut -d' ' -f2)
    log_success "Python版本: $python_version"
    
    # 检查pip
    if ! command -v pip3 &> /dev/null; then
        log_error "pip3 未安装"
        exit 1
    fi
    
    # 检查并激活虚拟环境
    if [[ "$VIRTUAL_ENV" == "" ]]; then
        if [[ -d "venv" ]]; then
            log_info "激活虚拟环境..."
            source venv/bin/activate
            log_success "虚拟环境已激活: $VIRTUAL_ENV"
        else
            log_warning "未检测到虚拟环境，建议使用虚拟环境"
            read -p "是否创建虚拟环境? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                create_virtual_env
            fi
        fi
    else
        log_success "虚拟环境: $VIRTUAL_ENV"
    fi
}

# 创建虚拟环境
create_virtual_env() {
    log_info "创建虚拟环境..."
    python3 -m venv venv
    source venv/bin/activate
    log_success "虚拟环境已创建并激活"
}

# 安装依赖
install_dependencies() {
    log_info "检查并安装依赖包..."
    
    if [[ ! -f "requirements.txt" ]]; then
        log_error "requirements.txt 文件不存在"
        exit 1
    fi
    
    # 检查是否需要安装或更新依赖
    if [[ ! -f ".deps_installed" ]] || [[ "requirements.txt" -nt ".deps_installed" ]]; then
        log_info "安装/更新依赖包..."
        pip3 install -r requirements.txt
        touch .deps_installed
        log_success "依赖包安装完成"
    else
        log_success "依赖包已是最新版本"
    fi
}

# 加载环境变量
load_env() {
    if [[ -f ".env" ]]; then
        log_info "加载环境变量..."
        # 使用Python安全加载.env文件
        python3 -c "
import os
from pathlib import Path

env_file = Path('.env')
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key.strip()] = value.strip()
                print(f'✅ {key.strip()}=***')
"
        source .env
        log_success "环境变量加载完成"
    else
        log_error ".env 文件不存在，请先运行配置"
        exit 1
    fi
}

# 验证配置
validate_config() {
    log_info "验证配置..."
    
    local missing_vars=()
    
    # 检查必需的环境变量
    required_vars=("GITHUB_TOKEN" "GITHUB_USERNAME")
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log_error "缺少必需的环境变量："
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        log_info "请编辑 .env 文件或运行 $0 --config 进行配置"
        exit 1
    fi
    
    log_success "配置验证通过"
}

# 测试GitHub连接
test_github_connection() {
    log_info "测试GitHub API连接..."
    
    python3 -c "
import os
import requests
import sys

token = os.getenv('GITHUB_TOKEN')
username = os.getenv('GITHUB_USERNAME')

if not token or not username:
    print('❌ GitHub配置缺失')
    sys.exit(1)

headers = {'Authorization': f'token {token}'}
response = requests.get('https://api.github.com/user', headers=headers)

if response.status_code == 200:
    user_data = response.json()
    print(f'✅ GitHub连接成功: {user_data.get(\"login\", \"Unknown\")}')
    print(f'ℹ️  API限制: {response.headers.get(\"X-RateLimit-Remaining\", \"Unknown\")}/{response.headers.get(\"X-RateLimit-Limit\", \"Unknown\")}')
else:
    print(f'❌ GitHub连接失败: {response.status_code}')
    if response.status_code == 401:
        print('   请检查GITHUB_TOKEN是否正确')
    sys.exit(1)
"
}

# 测试邮件配置（如果配置了的话）
test_email_config() {
    if [[ -n "$EMAIL_USER" && -n "$EMAIL_PASSWORD" ]]; then
        log_info "测试邮件配置..."
        python3 -c "
import os
import smtplib
from email.mime.text import MIMEText

try:
    smtp_server = os.getenv('SMTP_SERVER', 'smtp.outlook.com')
    smtp_port = int(os.getenv('SMTP_PORT', '587'))
    email_user = os.getenv('EMAIL_USER')
    email_password = os.getenv('EMAIL_PASSWORD')
    
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(email_user, email_password)
    server.quit()
    print('✅ 邮件配置测试成功')
except Exception as e:
    print(f'⚠️  邮件配置测试失败: {e}')
    print('   邮件通知将不可用，但系统仍可正常运行')
"
    else
        log_info "未配置邮件，跳过邮件测试"
    fi
}

# 创建必要目录
create_directories() {
    log_info "创建必要目录..."
    
    directories=("data" "data/reports" "data/cache" "logs")
    
    for dir in "${directories[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log_success "创建目录: $dir"
        fi
    done
}

# 运行系统
run_system() {
    local mode="$1"
    local no_notify="$2"
    
    log_header "启动 $PROJECT_NAME"
    
    case "$mode" in
        "once")
            log_info "运行一次分析..."
            if [[ "$no_notify" == "true" ]]; then
                python3 scheduler.py --once --no-notification
            else
                python3 scheduler.py --once
            fi
            ;;
        "daemon")
            log_info "启动后台守护进程..."
            nohup python3 scheduler.py > logs/monitor.log 2>&1 &
            local pid=$!
            echo $pid > .monitor.pid
            log_success "后台进程已启动，PID: $pid"
            log_info "日志文件: logs/monitor.log"
            ;;
        "normal"|*)
            log_info "启动交互模式..."
            python3 scheduler.py
            ;;
    esac
}

# Docker运行
run_docker() {
    log_info "使用Docker运行..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装"
        exit 1
    fi
    
    if [[ ! -f "docker-compose.yml" ]]; then
        log_error "docker-compose.yml 文件不存在"
        exit 1
    fi
    
    log_info "构建并启动Docker容器..."
    docker-compose up --build -d
    
    log_success "Docker容器已启动"
    log_info "查看日志: docker-compose logs -f"
    log_info "停止容器: docker-compose down"
}

# 停止后台进程
stop_daemon() {
    if [[ -f ".monitor.pid" ]]; then
        local pid=$(cat .monitor.pid)
        if ps -p $pid > /dev/null 2>&1; then
            log_info "停止后台进程 (PID: $pid)..."
            kill $pid
            rm .monitor.pid
            log_success "后台进程已停止"
        else
            log_warning "进程 $pid 不存在"
            rm .monitor.pid
        fi
    else
        log_warning "未找到后台进程PID文件"
    fi
    
    # 也尝试停止Docker
    if [[ -f "docker-compose.yml" ]] && command -v docker-compose &> /dev/null; then
        log_info "停止Docker容器..."
        docker-compose down
    fi
}

# 查看运行状态
show_status() {
    log_header "系统运行状态"
    
    # 检查本地进程
    if [[ -f ".monitor.pid" ]]; then
        local pid=$(cat .monitor.pid)
        if ps -p $pid > /dev/null 2>&1; then
            log_success "本地进程运行中 (PID: $pid)"
            echo "  内存使用: $(ps -o rss= -p $pid | awk '{print int($1/1024)" MB"}')"
            echo "  运行时间: $(ps -o etime= -p $pid | xargs)"
        else
            log_warning "PID文件存在但进程未运行"
        fi
    else
        log_info "本地进程未运行"
    fi
    
    # 检查Docker容器
    if command -v docker &> /dev/null && [[ -f "docker-compose.yml" ]]; then
        log_info "Docker容器状态:"
        docker-compose ps 2>/dev/null || echo "  未启动"
    fi
    
    # 显示最近日志
    if [[ -f "logs/monitor.log" ]]; then
        log_info "最近日志 (最后10行):"
        tail -10 logs/monitor.log
    fi
}

# 显示日志
show_logs() {
    if [[ -f "logs/monitor.log" ]]; then
        log_info "实时日志 (Ctrl+C退出):"
        tail -f logs/monitor.log
    else
        log_warning "日志文件不存在"
    fi
}

# 配置环境变量
configure_env() {
    log_header "环境变量配置"
    
    # 备份现有配置
    if [[ -f ".env" ]]; then
        cp .env .env.backup
        log_info "已备份现有配置到 .env.backup"
    fi
    
    # GitHub配置
    echo -e "${CYAN}=== GitHub 配置 ===${NC}"
    read -p "GitHub Token: " github_token
    read -p "GitHub Username [$GITHUB_USERNAME]: " github_username
    github_username=${github_username:-$GITHUB_USERNAME}
    
    # 邮件配置
    echo -e "${CYAN}=== 邮件通知配置 (可选) ===${NC}"
    read -p "邮箱地址: " email_user
    if [[ -n "$email_user" ]]; then
        read -s -p "邮箱密码/应用密码: " email_password
        echo
    fi
    
    # 写入.env文件
    cat > .env << EOF
# GitHub配置
GITHUB_TOKEN=$github_token
GITHUB_USERNAME=$github_username

# 邮件通知配置
EMAIL_USER=$email_user
EMAIL_PASSWORD=$email_password

# 系统配置
TZ=Asia/Shanghai
LOG_LEVEL=INFO

# 监控配置
MONITOR_INTERVAL_HOURS=6
DAILY_CHECK_TIME=09:00
WEEKLY_REPORT_TIME=MON:10:00

# 通知阈值
MIN_UPDATES_FOR_NOTIFICATION=1
MIN_SIGNIFICANT_UPDATES=1
COMPLEXITY_THRESHOLD=0.5

# 项目过滤
MIN_PROJECT_SIZE_KB=10
EXCLUDE_FORKS=true
EXCLUDE_ARCHIVED=true

# 报告配置
REPORT_FORMATS=markdown,html,json
KEEP_HISTORY_DAYS=30
MAX_FEATURED_PROJECTS=5
EOF
    
    log_success "环境变量配置完成"
}

# 首次设置
setup() {
    log_header "首次设置 - $PROJECT_NAME"
    
    # 检查环境
    check_environment
    
    # 安装依赖
    install_dependencies
    
    # 配置环境变量
    configure_env
    
    # 创建目录
    create_directories
    
    # 测试配置
    load_env
    validate_config
    test_github_connection
    test_email_config
    
    log_success "设置完成！"
    log_info "现在可以运行: $0 来启动监控系统"
}

# 主函数
main() {
    cd "$SCRIPT_DIR"
    
    # 激活虚拟环境（如果存在）
    if [[ -d "venv" && "$VIRTUAL_ENV" == "" ]]; then
        source venv/bin/activate
    fi
    
    # 解析命令行参数
    local mode="normal"
    local no_notify="false"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -o|--once)
                mode="once"
                shift
                ;;
            -n|--no-notify)
                no_notify="true"
                shift
                ;;
            -d|--daemon)
                mode="daemon"
                shift
                ;;
            -s|--setup)
                setup
                exit 0
                ;;
            -c|--config)
                configure_env
                exit 0
                ;;
            -t|--test)
                load_env
                validate_config
                test_github_connection
                test_email_config
                exit 0
                ;;
            --docker)
                run_docker
                exit 0
                ;;
            --stop)
                stop_daemon
                exit 0
                ;;
            --status)
                show_status
                exit 0
                ;;
            --logs)
                show_logs
                exit 0
                ;;
            *)
                log_error "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 运行前检查
    if [[ ! -f ".env" ]]; then
        log_error ".env 文件不存在"
        log_info "请先运行: $0 --setup 进行首次设置"
        exit 1
    fi
    
    # 检查环境（跳过虚拟环境创建）
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 未安装"
        exit 1
    fi
    
    if [[ ! -f "requirements.txt" ]]; then
        log_error "requirements.txt 不存在"
        exit 1
    fi
    
    # 安装依赖
    install_dependencies
    
    # 加载环境变量
    load_env
    
    # 验证配置
    validate_config
    
    # 创建目录
    create_directories
    
    # 运行系统
    run_system "$mode" "$no_notify"
}

# 脚本入口点
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi