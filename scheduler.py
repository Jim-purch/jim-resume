#!/usr/bin/env python3
"""
自动化调度和通知系统
Author: Jim
Purpose: 定时监控GitHub仓库变化并发送通知
"""

import os
import json
import time
import schedule
import smtplib
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from pathlib import Path
import logging
from typing import Dict, List, Any, Optional

from github_monitor import GitHubMonitor
from report_generator import ResumeReportGenerator

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('scheduler.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class NotificationService:
    """通知服务类"""
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.email_config = config.get('email', {})
        self.webhook_config = config.get('webhook', {})
    
    def send_email_notification(self, subject: str, content: str, 
                              attachments: List[str] = None) -> bool:
        """发送邮件通知"""
        try:
            # 邮件配置
            smtp_server = self.email_config.get('smtp_server', 'smtp.outlook.com')
            smtp_port = self.email_config.get('smtp_port', 587)
            sender_email = self.email_config.get('sender_email')
            sender_password = self.email_config.get('sender_password')
            recipient_emails = self.email_config.get('recipients', [])
            
            if not all([sender_email, sender_password, recipient_emails]):
                logger.warning("邮件配置不完整，跳过邮件通知")
                return False
            
            # 创建邮件
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = ', '.join(recipient_emails)
            msg['Subject'] = subject
            
            # 添加邮件正文
            msg.attach(MIMEText(content, 'plain', 'utf-8'))
            
            # 添加附件
            if attachments:
                for file_path in attachments:
                    if Path(file_path).exists():
                        with open(file_path, 'rb') as attachment:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(attachment.read())
                        
                        encoders.encode_base64(part)
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename= {Path(file_path).name}'
                        )
                        msg.attach(part)
            
            # 发送邮件
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            text = msg.as_string()
            server.sendmail(sender_email, recipient_emails, text)
            server.quit()
            
            logger.info(f"邮件通知发送成功: {subject}")
            return True
            
        except Exception as e:
            logger.error(f"邮件发送失败: {e}")
            return False
    
    def send_webhook_notification(self, data: Dict[str, Any]) -> bool:
        """发送Webhook通知(钉钉、企业微信等)"""
        try:
            import requests
            
            webhook_url = self.webhook_config.get('url')
            webhook_type = self.webhook_config.get('type', 'dingtalk')
            
            if not webhook_url:
                logger.warning("Webhook配置不完整，跳过Webhook通知")
                return False
            
            # 根据不同平台格式化消息
            if webhook_type == 'dingtalk':
                payload = {
                    "msgtype": "markdown",
                    "markdown": {
                        "title": "GitHub简历更新报告",
                        "text": self._format_dingtalk_message(data)
                    }
                }
            elif webhook_type == 'wechat':
                payload = {
                    "msgtype": "markdown",
                    "markdown": {
                        "content": self._format_wechat_message(data)
                    }
                }
            else:
                payload = data
            
            response = requests.post(webhook_url, json=payload)
            if response.status_code == 200:
                logger.info("Webhook通知发送成功")
                return True
            else:
                logger.error(f"Webhook发送失败: {response.status_code}")
                return False
                
        except Exception as e:
            logger.error(f"Webhook发送失败: {e}")
            return False
    
    def _format_dingtalk_message(self, data: Dict[str, Any]) -> str:
        """格式化钉钉消息"""
        summary = data.get('summary', {})
        suggestions = data.get('update_suggestions', [])
        
        message = f"""# 🚀 GitHub简历更新报告

**生成时间**: {datetime.now().strftime('%Y-%m-%d %H:%M')}

## 📊 项目概览
- 总项目数: **{summary.get('total_repos', 0)}**
- 最近更新: **{summary.get('recent_updates', 0)}**
- AI项目: **{summary.get('ai_projects', 0)}**
- 平均复杂度: **{summary.get('avg_complexity', 0):.2f}**

## 📝 更新建议
"""
        
        for suggestion in suggestions[:3]:
            message += f"- {suggestion}\n"
        
        message += "\n> 详细报告请查看附件或邮件"
        
        return message
    
    def _format_wechat_message(self, data: Dict[str, Any]) -> str:
        """格式化企业微信消息"""
        return self._format_dingtalk_message(data)  # 格式类似

class GitHubScheduler:
    """GitHub监控调度器"""
    
    def __init__(self, config_file: str = 'config.json'):
        self.config_file = config_file
        self.config = self._load_config()
        self.monitor = None
        self.report_generator = ResumeReportGenerator()
        self.notification_service = NotificationService(self.config.get('notifications', {}))
        self.data_dir = Path(self.config.get('data_dir', 'data'))
        self.data_dir.mkdir(exist_ok=True)
        
        # 初始化监控器
        self._init_monitor()
    
    def _load_config(self) -> Dict[str, Any]:
        """加载配置文件"""
        config_path = Path(self.config_file)
        
        if config_path.exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            # 创建默认配置
            default_config = self._create_default_config()
            self._save_config(default_config)
            return default_config
    
    def _create_default_config(self) -> Dict[str, Any]:
        """创建默认配置"""
        return {
            "github": {
                "token": os.getenv('GITHUB_TOKEN', ''),
                "username": os.getenv('GITHUB_USERNAME', 'Jim-purch'),
                "include_private": True
            },
            "schedule": {
                "daily_check": "09:00",
                "weekly_report": "MON:10:00",
                "check_interval_hours": 6
            },
            "notifications": {
                "email": {
                    "enabled": True,
                    "smtp_server": "smtp.outlook.com",
                    "smtp_port": 587,
                    "sender_email": os.getenv('EMAIL_USER', ''),
                    "sender_password": os.getenv('EMAIL_PASSWORD', ''),
                    "recipients": [os.getenv('EMAIL_USER', '')]
                },
                "webhook": {
                    "enabled": False,
                    "type": "dingtalk",
                    "url": os.getenv('WEBHOOK_URL', '')
                }
            },
            "data_dir": "data",
            "report_formats": ["markdown", "html"],
            "thresholds": {
                "min_updates_for_notification": 1,
                "min_significant_updates": 1,
                "complexity_threshold": 0.5
            }
        }
    
    def _save_config(self, config: Dict[str, Any]):
        """保存配置文件"""
        with open(self.config_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
    
    def _init_monitor(self):
        """初始化GitHub监控器"""
        github_config = self.config.get('github', {})
        
        # 优先从环境变量获取，然后从配置文件获取
        token = os.getenv('GITHUB_TOKEN') or github_config.get('token')
        username = os.getenv('GITHUB_USERNAME') or github_config.get('username')
        
        if not token:
            logger.error("GitHub token未配置")
            logger.info("请设置环境变量 GITHUB_TOKEN 或在config.json中配置")
            return
        
        self.monitor = GitHubMonitor(token, username)
        logger.info(f"GitHub监控器初始化成功: {username}")
    
    def run_analysis(self, force_notification: bool = False) -> Optional[Dict[str, Any]]:
        """运行分析"""
        if not self.monitor:
            logger.error("GitHub监控器未初始化")
            return None
        
        try:
            logger.info("开始GitHub仓库分析...")
            
            # 获取仓库列表
            include_private = self.config['github'].get('include_private', True)
            repos = self.monitor.get_user_repos(include_private)
            
            # 分析所有项目
            analyses = []
            for repo in repos:
                analysis = self.monitor.analyze_project(repo)
                analyses.append(analysis)
            
            # 生成报告
            report_data = self.monitor.generate_resume_report(analyses)
            
            # 保存报告数据
            self._save_analysis_data(report_data)
            
            # 检查是否需要发送通知
            if self._should_send_notification(report_data) or force_notification:
                self._send_notifications(report_data)
            
            logger.info("分析完成")
            return report_data
            
        except Exception as e:
            logger.error(f"分析失败: {e}")
            return None

    def run_deep_analysis(self, force_notification: bool = False) -> Optional[Dict[str, Any]]:
        """运行深度分析（包含 AI 能力和哲学洞察）"""
        if not self.monitor:
            logger.error("GitHub监控器未初始化")
            return None
        
        try:
            logger.info("开始深度GitHub仓库分析...")
            
            # 获取仓库列表（深度模式）
            include_private = self.config['github'].get('include_private', True)
            repos = self.monitor.get_user_repos_deep(include_private)
            
            # 分析所有项目
            analyses = []
            for repo in repos:
                analysis = self.monitor.analyze_project(repo)
                analyses.append(analysis)
            
            # 生成深度报告
            report_data = self.monitor.generate_deep_report(analyses, repos)
            
            # 保存报告数据
            self._save_analysis_data(report_data, prefix="deep_report")
            
            # 检查是否需要发送通知
            if self._should_send_notification(report_data) or force_notification:
                self._send_notifications(report_data)
            
            logger.info("深度分析完成")
            return report_data
            
        except Exception as e:
            logger.error(f"深度分析失败: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def _save_analysis_data(self, report_data: Dict[str, Any], prefix: str = "report"):
        """保存分析数据"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # 保存JSON数据
        json_file = self.data_dir / f"{prefix}_{timestamp}.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, ensure_ascii=False, indent=2)
        
        # 生成不同格式的报告
        for fmt in self.config.get('report_formats', ['markdown']):
            content = self.report_generator.generate_report(report_data, fmt)
            report_file = self.data_dir / f"{prefix}_{timestamp}.{fmt}"
            self.report_generator.save_report(content, str(report_file), fmt)
        
        logger.info(f"报告已保存到: {self.data_dir}")
    
    def _should_send_notification(self, report_data: Dict[str, Any]) -> bool:
        """判断是否应该发送通知"""
        thresholds = self.config.get('thresholds', {})
        summary = report_data.get('summary', {})
        
        # 检查更新数量
        recent_updates = summary.get('recent_updates', 0)
        significant_updates = summary.get('significant_updates', 0)
        
        min_updates = thresholds.get('min_updates_for_notification', 1)
        min_significant = thresholds.get('min_significant_updates', 1)
        
        if recent_updates >= min_updates or significant_updates >= min_significant:
            return True
        
        # 检查是否有高价值项目更新
        featured_projects = report_data.get('featured_projects', [])
        high_value_updates = [
            p for p in featured_projects 
            if '高价值' in p.get('business_value', '')
        ]
        
        if high_value_updates:
            return True
        
        return False
    
    def _send_notifications(self, report_data: Dict[str, Any]):
        """发送通知"""
        summary = report_data.get('summary', {})
        
        # 准备邮件内容
        subject = f"GitHub简历更新报告 - {summary.get('recent_updates', 0)}个项目有更新"
        
        # 生成邮件正文
        email_content = self.report_generator.generate_report(report_data, 'text')
        
        # 准备附件
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        attachments = []
        
        for fmt in ['markdown', 'html']:
            report_file = self.data_dir / f"report_{timestamp}.{fmt}"
            if report_file.exists():
                attachments.append(str(report_file))
        
        # 发送邮件通知
        if self.config['notifications']['email'].get('enabled', False):
            self.notification_service.send_email_notification(
                subject, email_content, attachments
            )
        
        # 发送Webhook通知
        if self.config['notifications']['webhook'].get('enabled', False):
            self.notification_service.send_webhook_notification(report_data)
    
    def setup_schedule(self):
        """设置定时任务"""
        schedule_config = self.config.get('schedule', {})
        
        # 每日检查
        daily_time = schedule_config.get('daily_check', '09:00')
        schedule.every().day.at(daily_time).do(self.run_analysis)
        logger.info(f"已设置每日检查时间: {daily_time}")
        
        # 每周报告
        weekly_time = schedule_config.get('weekly_report', 'MON:10:00')
        day, time_part = weekly_time.split(':', 1)
        # 映射星期几缩写到完整名称
        day_mapping = {
            'MON': 'monday', 'TUE': 'tuesday', 'WED': 'wednesday',
            'THU': 'thursday', 'FRI': 'friday', 'SAT': 'saturday', 'SUN': 'sunday'
        }
        full_day = day_mapping.get(day.upper(), 'monday')
        getattr(schedule.every(), full_day).at(time_part).do(
            lambda: self.run_analysis(force_notification=True)
        )
        logger.info(f"已设置每周报告时间: {weekly_time}")
        
        # 定期检查
        interval_hours = schedule_config.get('check_interval_hours', 6)
        schedule.every(interval_hours).hours.do(self.run_analysis)
        logger.info(f"已设置定期检查间隔: {interval_hours}小时")
    
    def run_scheduler(self):
        """运行调度器"""
        logger.info("GitHub仓库监控调度器启动")
        
        # 设置定时任务
        self.setup_schedule()
        
        # 运行一次初始分析
        logger.info("执行初始分析...")
        self.run_analysis()
        
        # 开始调度循环
        logger.info("开始定时调度...")
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # 每分钟检查一次
        except KeyboardInterrupt:
            logger.info("调度器已停止")
    
    def run_once(self, notification: bool = True):
        """运行一次分析"""
        return self.run_analysis(force_notification=notification)

def main():
    """主函数"""
    import argparse
    
    # 加载.env文件
    env_file = Path('.env')
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
    
    parser = argparse.ArgumentParser(description='GitHub仓库监控调度器')
    parser.add_argument('--config', default='config.json', help='配置文件路径')
    parser.add_argument('--once', action='store_true', help='只运行一次分析')
    parser.add_argument('--deep', action='store_true', help='运行深度分析（包含 AI 能力和哲学洞察）')
    parser.add_argument('--no-notification', action='store_true', help='不发送通知')
    
    args = parser.parse_args()
    
    # 创建调度器
    scheduler = GitHubScheduler(args.config)
    
    if args.once or args.deep:
        # 运行一次
        if args.deep:
            print("开始深度分析（包含 AI 能力和哲学洞察）...")
            report = scheduler.run_deep_analysis(force_notification=not args.no_notification)
        else:
            report = scheduler.run_once(notification=not args.no_notification)
        
        if report:
            print("分析完成，报告已生成")
            if args.deep and 'deep_analysis' in report:
                deep = report['deep_analysis']
                print("\n=== 深度分析摘要 ===")
                print(f"AI 掌握程度: {deep.get('ai_profile', {}).get('overall_mastery', 'N/A')}")
                print(f"AI 哲学: {deep.get('ai_profile', {}).get('ai_philosophy', 'N/A')}")
                print(f"哲学宣言: {deep.get('philosophy', {}).get('philosophy_statement', 'N/A')}")
                print(f"核心价值观: {', '.join(deep.get('philosophy', {}).get('core_values', []))}")
        else:
            print("分析失败")
    else:
        # 运行调度器
        scheduler.run_scheduler()

if __name__ == "__main__":
    main()