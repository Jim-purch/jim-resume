# 🚀 GitHub仓库自动监控与简历更新系统

## 📋 项目概述

这是一个智能化的GitHub仓库监控系统，能够自动分析你的所有GitHub项目，并生成结构化的简历更新报告。系统通过AI算法评估项目价值、技术复杂度和商业价值，帮助你及时更新简历内容。

### ✨ 核心功能

- 🔍 **自动仓库扫描**: 支持公开和私有仓库
- 🧠 **智能项目分析**: AI协作检测、技术栈识别、复杂度评分
- 📊 **多维度评估**: 商业价值、项目类型、开发工期估算
- 📋 **简历更新报告**: Markdown/HTML/文本多格式输出
- ⏰ **定时监控**: 支持每日/每周/定时检查
- 📧 **智能通知**: 邮件/钉钉/企业微信通知
- 📈 **趋势分析**: 技能矩阵、项目统计、发展建议

## 🏗️ 系统架构

```
github-resume-monitor/
├── github_monitor.py      # 核心监控模块
├── report_generator.py    # 报告生成器
├── scheduler.py          # 调度和通知系统
├── config.json          # 配置文件
├── requirements.txt     # 依赖包
├── data/               # 数据存储目录
│   ├── reports/       # 生成的报告
│   └── cache/         # 缓存数据
└── logs/              # 日志文件
```

## 🚀 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/Jim-purch/jim-resume.git
cd jim-resume

# 安装依赖
pip install -r requirements.txt

# 创建数据目录
mkdir -p data/reports data/cache logs
```

### 2. 配置设置

#### 获取GitHub Token
1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. 生成新的token，权限选择：`repo`, `user`, `read:org`
3. 保存token到环境变量或配置文件

#### 配置文件设置
编辑 `config.json`：

```json
{
  "github": {
    "token": "your-github-token",
    "username": "your-username",
    "include_private": true
  },
  "notifications": {
    "email": {
      "enabled": true,
      "sender_email": "your-email@outlook.com",
      "sender_password": "your-app-password",
      "recipients": ["your-email@outlook.com"]
    }
  }
}
```

#### 环境变量设置（推荐）
```bash
export GITHUB_TOKEN="your-github-token"
export GITHUB_USERNAME="your-username"
export EMAIL_USER="your-email@outlook.com"
export EMAIL_PASSWORD="your-app-password"
```

### 3. 运行系统

#### 单次分析
```bash
# 运行一次完整分析
python scheduler.py --once

# 运行分析但不发送通知
python scheduler.py --once --no-notification
```

#### 定时监控
```bash
# 启动定时监控（后台运行）
nohup python scheduler.py &

# 或使用systemd服务
sudo cp github-monitor.service /etc/systemd/system/
sudo systemctl enable github-monitor
sudo systemctl start github-monitor
```

## 📊 报告示例

系统会生成详细的分析报告，包含：

### 项目概览
- 总项目数、最近更新、AI项目统计
- 平均复杂度评分、技术栈分布

### 重点项目推荐
- 基于复杂度和商业价值的智能排序
- AI协作项目标识
- 技术栈、关键特性、角色建议

### 简历更新建议
- 具体的更新建议和行动项
- 新技能标签推荐
- 项目展示优化建议

## 🔧 高级配置

### 项目过滤配置
```json
{
  "analysis": {
    "project_filters": {
      "min_size_kb": 10,
      "exclude_forks": true,
      "exclude_archived": true,
      "include_languages": ["Python", "JavaScript", "TypeScript"],
      "exclude_languages": ["CSS", "HTML"]
    }
  }
}
```

### 复杂度权重调整
```json
{
  "analysis": {
    "complexity_weights": {
      "size": 0.3,
      "languages": 0.2,
      "stars": 0.1,
      "forks": 0.1,
      "readme_length": 0.1,
      "topics": 0.1,
      "recent_activity": 0.1
    }
  }
}
```

### 通知阈值设置
```json
{
  "thresholds": {
    "min_updates_for_notification": 1,
    "min_significant_updates": 1,
    "complexity_threshold": 0.5,
    "high_value_threshold": 0.7
  }
}
```

## 📱 集成方案

### 1. GitHub Actions自动化
创建 `.github/workflows/resume-monitor.yml`：

```yaml
name: Resume Monitor
on:
  schedule:
    - cron: '0 9 * * *'  # 每天9点运行
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - run: pip install -r requirements.txt
      - run: python scheduler.py --once
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          EMAIL_USER: ${{ secrets.EMAIL_USER }}
          EMAIL_PASSWORD: ${{ secrets.EMAIL_PASSWORD }}
```

### 2. Docker容器部署
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
CMD ["python", "scheduler.py"]
```

### 3. 钉钉/企业微信集成
```json
{
  "notifications": {
    "webhook": {
      "enabled": true,
      "type": "dingtalk",
      "url": "https://oapi.dingtalk.com/robot/send?access_token=xxx"
    }
  }
}
```

## 🎯 使用场景

### 场景1: 求职准备
- 定期监控项目更新
- 自动生成最新项目展示
- 识别高价值项目和技能

### 场景2: 个人品牌建设
- 跟踪技术栈发展趋势
- 识别影响力项目
- 规划技术发展路径

### 场景3: 团队管理
- 监控团队成员项目
- 评估技术能力发展
- 项目价值评估

## 📈 系统特性

### 智能分析算法
- **复杂度评分**: 代码量、语言多样性、社区活跃度综合评估
- **AI协作检测**: 基于关键词和项目特征的AI项目识别
- **商业价值评估**: 结合复杂度、技术栈、项目类型的价值评估
- **角色匹配**: 基于技术栈和项目特征的职位建议

### 数据安全
- 支持私有仓库访问
- 敏感信息本地存储
- 可配置的数据保留策略

### 扩展性
- 插件化的通知系统
- 可配置的分析算法
- 多格式报告输出

## 🔍 故障排除

### 常见问题

1. **GitHub API限制**
   - 使用认证token提高限制
   - 配置合理的请求间隔

2. **邮件发送失败**
   - 检查SMTP设置和认证
   - 使用应用专用密码

3. **私有仓库访问**
   - 确认token权限包含`repo`
   - 检查仓库访问权限

### 日志分析
```bash
# 查看运行日志
tail -f github_monitor.log

# 查看调度器日志
tail -f scheduler.log
```

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发环境
```bash
# 安装开发依赖
pip install -r requirements.txt

# 运行测试
python -m pytest tests/

# 代码格式化
black *.py
```

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🔗 相关链接

- [GitHub API文档](https://docs.github.com/en/rest)
- [简历优化指南](./RESUME_GUIDE.md)
- [部署指南](./DEPLOYMENT.md)

---

**作者**: Jim - AI协作专家 & 数字化产品经理  
**邮箱**: cxxvcheng@outlook.com  
**项目**: 通过AI工具创新驱动业务价值最大化