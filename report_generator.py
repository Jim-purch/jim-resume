#!/usr/bin/env python3
"""
简历更新报告生成器 - 可视化报告模块
Author: Jim
Purpose: 将GitHub监控数据转换为可读的简历更新报告
"""

import json
from datetime import datetime
from typing import Dict, List, Any
from pathlib import Path
import os

class ResumeReportGenerator:
    """简历报告生成器"""
    
    def __init__(self):
        self.templates = {
            'markdown': self._generate_markdown_report,
            'html': self._generate_html_report,
            'text': self._generate_text_report
        }
    
    def generate_report(self, report_data: Dict[str, Any], format_type: str = 'markdown') -> str:
        """生成指定格式的报告"""
        if format_type not in self.templates:
            raise ValueError(f"不支持的格式: {format_type}")
        
        return self.templates[format_type](report_data)
    
    def _generate_markdown_report(self, data: Dict[str, Any]) -> str:
        """生成Markdown格式报告"""
        
        # 解析数据
        summary = data['summary']
        featured = data.get('featured_projects', [])
        recent = data.get('recent_updates', [])
        suggestions = data.get('update_suggestions', [])
        recommendations = data.get('recommendations', [])
        skill_matrix = data.get('skill_matrix', {})
        
        # 生成报告内容
        report = f"""# 🚀 GitHub仓库分析与简历更新报告

**生成时间**: {datetime.fromisoformat(data['generated_at']).strftime('%Y年%m月%d日 %H:%M')}

## 📊 项目概览

| 指标 | 数值 | 说明 |
|------|------|------|
| 总项目数 | **{summary['total_repos']}** | 包含公开和私有仓库 |
| 最近更新 | **{summary['recent_updates']}** | 近30天内有更新的项目 |
| 显著更新 | **{summary['significant_updates']}** | 值得在简历中突出的项目 |
| AI协作项目 | **{summary['ai_projects']}** | 体现AI专家能力的项目 |
| 平均复杂度 | **{summary['avg_complexity']:.2f}** | 项目技术复杂度评分(0-1) |

## 🌟 重点项目推荐

以下项目建议在简历中重点展示:

"""
        
        # 重点项目
        for i, project in enumerate(featured[:5], 1):
            ai_badge = " 🤖" if project['ai_collaboration'] else ""
            private_badge = " 🔒" if project['is_private'] else ""
            
            report += f"""### {i}. {project['name']}{ai_badge}{private_badge}

**项目类型**: {project['project_type']}  
**商业价值**: {project['business_value']}  
**复杂度评分**: {project['complexity_score']}/1.0  
**估算工期**: {project['estimated_duration']}

**项目描述**: {project['description']}

**核心技术栈**: {', '.join(project['tech_stack'][:5])}

**关键特性**:
{chr(10).join(f"- {feature}" for feature in project['key_features'])}

**建议角色**: {', '.join(project['role_suggestions'])}

---

"""
        
        # 最近更新项目
        if recent:
            report += f"""## 🔄 最近更新项目 ({len(recent)}个)

以下项目近期有重要更新，建议检查是否需要更新简历内容:

"""
            for project in recent[:10]:
                ai_indicator = "🤖 " if project['ai_collaboration'] else ""
                update_time = datetime.fromisoformat(project['last_updated'].replace('Z', '+00:00')).strftime('%m月%d日')
                
                report += f"""**{ai_indicator}{project['name']}** - {project['project_type']}  
*{update_time}更新* | 复杂度: {project['complexity_score']:.1f} | {project['business_value']}

"""
        
        # 技能矩阵
        if skill_matrix:
            report += """## 💪 技能矩阵分析

基于项目分析生成的技能使用频率统计:

| 技能/能力 | 项目数量 | 权重 |
|-----------|----------|------|
"""
            for skill, count in list(skill_matrix.items())[:15]:
                percentage = (count / summary['total_repos']) * 100
                bar = "█" * int(percentage / 10) + "░" * (10 - int(percentage / 10))
                report += f"| {skill} | {count} | {bar} {percentage:.0f}% |\n"
        
        # 更新建议
        if suggestions:
            report += f"""## 📝 简历更新建议

基于最近项目活动生成的具体更新建议:

"""
            for i, suggestion in enumerate(suggestions, 1):
                report += f"{i}. **{suggestion}**\n"
            
            report += "\n"
        
        # 优化建议
        if recommendations:
            report += f"""## 🎯 优化建议

基于整体项目分析的简历优化建议:

"""
            for i, rec in enumerate(recommendations, 1):
                report += f"{i}. {rec}\n"
            
            report += "\n"
        
        # 项目统计详情
        project_stats = data.get('project_stats', {})
        if project_stats:
            report += """## 📈 详细统计

### 项目类型分布
"""
            if 'project_types' in project_stats:
                for ptype, count in project_stats['project_types'].items():
                    percentage = (count / summary['total_repos']) * 100
                    report += f"- **{ptype}**: {count}个 ({percentage:.1f}%)\n"
            
            report += "\n### 技术栈使用统计\n"
            if 'tech_stack_usage' in project_stats:
                for tech, count in list(project_stats['tech_stack_usage'].items())[:10]:
                    report += f"- **{tech}**: {count}个项目\n"
        
        # 行动建议
        report += f"""
## 🚀 下一步行动

### 立即行动
1. **更新项目展示**: 重点突出前{len(featured)}个推荐项目
2. **技能标签更新**: 添加高频技术栈到技能列表
3. **角色定位优化**: 基于AI项目比例({summary['ai_projects']}/{summary['total_repos']})强化AI专家定位

### 中期规划
1. **开源贡献**: 考虑开源部分优秀私有项目
2. **项目文档**: 完善重点项目的README和技术文档
3. **社区影响**: 提升项目的star和fork数量

### 长期建议
1. **技术深度**: 在{list(skill_matrix.keys())[0] if skill_matrix else 'AI协作'}领域继续深耕
2. **商业价值**: 强化项目的实际业务价值展示
3. **行业影响**: 建立个人技术品牌和影响力

---

*本报告由GitHub仓库自动分析系统生成，数据更新时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        
        return report
    
    def _generate_html_report(self, data: Dict[str, Any]) -> str:
        """生成HTML格式报告"""
        # 这里可以实现HTML格式的报告生成
        # 为简化示例，这里返回一个基本的HTML结构
        markdown_content = self._generate_markdown_report(data)
        
        html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub简历更新报告</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
               line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                   color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }}
        .stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                  gap: 20px; margin: 30px 0; }}
        .stat-card {{ background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }}
        .stat-number {{ font-size: 2em; font-weight: bold; color: #007bff; }}
        .project-card {{ background: white; border: 1px solid #e9ecef; border-radius: 8px; 
                         padding: 20px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .ai-badge {{ background: #28a745; color: white; padding: 2px 8px; 
                     border-radius: 12px; font-size: 0.8em; }}
        .private-badge {{ background: #6c757d; color: white; padding: 2px 8px; 
                          border-radius: 12px; font-size: 0.8em; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 GitHub仓库分析与简历更新报告</h1>
        <p>生成时间: {datetime.fromisoformat(data['generated_at']).strftime('%Y年%m月%d日 %H:%M')}</p>
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">{data['summary']['total_repos']}</div>
            <div>总项目数</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{data['summary']['recent_updates']}</div>
            <div>最近更新</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{data['summary']['ai_projects']}</div>
            <div>AI协作项目</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{data['summary']['avg_complexity']:.2f}</div>
            <div>平均复杂度</div>
        </div>
    </div>
    
    <div class="content">
        <!-- 这里可以添加更多HTML内容 -->
        <pre style="white-space: pre-wrap; font-family: inherit;">{markdown_content}</pre>
    </div>
</body>
</html>"""
        
        return html
    
    def _generate_text_report(self, data: Dict[str, Any]) -> str:
        """生成纯文本格式报告"""
        markdown_content = self._generate_markdown_report(data)
        # 移除Markdown格式符号，保留纯文本
        import re
        
        # 简单的Markdown到纯文本转换
        text = re.sub(r'#{1,6}\s*', '', markdown_content)  # 移除标题符号
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # 移除粗体
        text = re.sub(r'\*(.*?)\*', r'\1', text)  # 移除斜体
        text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', text)  # 移除链接
        text = re.sub(r'`(.*?)`', r'\1', text)  # 移除代码标记
        
        return text
    
    def save_report(self, content: str, filename: str, format_type: str = 'markdown') -> str:
        """保存报告到文件"""
        extensions = {'markdown': '.md', 'html': '.html', 'text': '.txt'}
        
        if not filename.endswith(extensions[format_type]):
            filename += extensions[format_type]
        
        filepath = Path(filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return str(filepath)

def create_sample_report():
    """创建示例报告用于测试"""
    sample_data = {
        "generated_at": datetime.now().isoformat(),
        "summary": {
            "total_repos": 15,
            "recent_updates": 5,
            "significant_updates": 3,
            "ai_projects": 8,
            "avg_complexity": 0.68
        },
        "featured_projects": [
            {
                "name": "orderListForSale",
                "description": "订单列表转换为商业发票、装箱单、报关单等文档的专业工具",
                "project_type": "AI工具",
                "business_value": "高价值 - AI协作复杂项目",
                "complexity_score": 0.85,
                "ai_collaboration": True,
                "estimated_duration": "2-6个月",
                "tech_stack": ["AI/ML", "数据处理", "自动化", "Web开发"],
                "key_features": ["自动化处理", "AI集成", "数据处理", "文件管理"],
                "role_suggestions": ["AI协作专家", "产品经理"],
                "stars": 0,
                "last_updated": "2025-07-15T10:30:00Z",
                "is_private": True
            }
        ],
        "recent_updates": [
            {
                "name": "emailAutoProcess",
                "project_type": "自动化工具",
                "complexity_score": 0.7,
                "business_value": "中高价值 - AI应用项目",
                "ai_collaboration": True,
                "last_updated": "2025-08-01T15:20:00Z"
            }
        ],
        "skill_matrix": {
            "AI协作": 8,
            "数据处理": 6,
            "自动化": 5,
            "Web开发": 4,
            "Python": 12
        },
        "update_suggestions": [
            "发现 5 个最近更新的项目，建议更新项目展示部分",
            "新增 3 个AI协作项目，突出AI专家定位"
        ],
        "recommendations": [
            "AI协作项目比例很高，建议突出'AI协作专家'定位",
            "项目整体复杂度较高，体现了高级技术能力"
        ],
        "project_stats": {
            "project_types": {
                "AI工具": 8,
                "自动化工具": 4,
                "Web应用": 2,
                "其他工具": 1
            },
            "tech_stack_usage": {
                "Python": 12,
                "AI/ML": 8,
                "数据处理": 6,
                "自动化": 5
            }
        }
    }
    
    generator = ResumeReportGenerator()
    
    # 生成不同格式的报告
    formats = ['markdown', 'html', 'text']
    
    for fmt in formats:
        content = generator.generate_report(sample_data, fmt)
        filename = f"sample_resume_report.{fmt}"
        filepath = generator.save_report(content, filename, fmt)
        print(f"示例报告已生成: {filepath}")

if __name__ == "__main__":
    create_sample_report()