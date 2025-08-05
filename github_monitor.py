#!/usr/bin/env python3
"""
GitHub仓库监控与简历更新报告生成器
Author: Jim
Purpose: 自动化监控GitHub仓库变化，生成简历更新建议
"""

import os
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import logging
from pathlib import Path
from dataclasses import dataclass, asdict
from collections import defaultdict

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('github_monitor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class Repository:
    """仓库信息数据类"""
    name: str
    full_name: str
    description: str
    language: str
    languages: Dict[str, int]
    topics: List[str]
    stars: int
    forks: int
    created_at: str
    updated_at: str
    pushed_at: str
    size: int
    open_issues: int
    is_private: bool
    readme_content: str = ""
    license: Optional[str] = None
    homepage: Optional[str] = None

@dataclass
class ProjectAnalysis:
    """项目分析结果"""
    repo: Repository
    tech_stack: List[str]
    project_type: str
    business_value: str
    complexity_score: float
    ai_collaboration: bool
    estimated_duration: str
    key_features: List[str]
    role_suggestions: List[str]

class GitHubMonitor:
    """GitHub仓库监控器"""
    
    def __init__(self, token: str, username: str):
        self.token = token
        self.username = username
        self.headers = {
            'Authorization': f'token {token}',
            'Accept': 'application/vnd.github.v3+json'
        }
        self.base_url = 'https://api.github.com'
        
        # 技术栈映射
        self.tech_mapping = {
            'Python': ['AI/ML', '数据处理', '自动化', 'Web开发'],
            'JavaScript': ['前端开发', 'Web应用', 'Node.js', 'React'],
            'TypeScript': ['前端框架', '企业级应用', '类型安全'],
            'HTML': ['Web前端', '用户界面'],
            'CSS': ['界面设计', '响应式布局'],
            'Go': ['微服务', '云原生', '高性能'],
            'Java': ['企业应用', '后端服务', 'Spring'],
            'Dockerfile': ['容器化', 'DevOps', '部署自动化'],
            'Shell': ['运维自动化', '脚本工具']
        }
        
        # AI协作关键词
        self.ai_keywords = [
            'ai', 'ml', 'gpt', 'claude', 'llm', 'ocr', 'automation',
            'intelligent', 'smart', 'neural', 'model', 'openai',
            'chatgpt', 'anthropic', 'machine learning', 'deep learning'
        ]
        
        # 项目类型分类
        self.project_types = {
            'AI工具': ['ai', 'ml', 'ocr', 'tts', 'nlp', 'cv'],
            '自动化工具': ['automation', 'script', 'tool', 'process'],
            'Web应用': ['web', 'app', 'frontend', 'backend', 'api'],
            '数据处理': ['data', 'analysis', 'etl', 'database'],
            '企业系统': ['enterprise', 'business', 'management', 'crm'],
            '开发工具': ['dev', 'tool', 'utility', 'helper'],
            '移动应用': ['mobile', 'android', 'ios', 'app'],
            '游戏': ['game', 'unity', 'engine'],
            '区块链': ['blockchain', 'crypto', 'web3', 'defi'],
            '物联网': ['iot', 'sensor', 'embedded', 'arduino']
        }

    def get_user_repos(self, include_private: bool = True) -> List[Repository]:
        """获取用户所有仓库"""
        logger.info(f"获取用户 {self.username} 的仓库列表...")
        
        repos = []
        page = 1
        per_page = 100
        
        while True:
            url = f"{self.base_url}/user/repos"
            params = {
                'page': page,
                'per_page': per_page,
                'sort': 'updated',
                'direction': 'desc'
            }
            
            if include_private:
                params['visibility'] = 'all'
            
            response = requests.get(url, headers=self.headers, params=params)
            if response.status_code != 200:
                logger.error(f"获取仓库失败: {response.status_code}")
                break
                
            batch_repos = response.json()
            if not batch_repos:
                break
                
            for repo_data in batch_repos:
                # 获取仓库语言分布
                languages = self.get_repo_languages(repo_data['full_name'])
                
                # 获取README内容
                readme = self.get_readme_content(repo_data['full_name'])
                
                repo = Repository(
                    name=repo_data['name'],
                    full_name=repo_data['full_name'],
                    description=repo_data.get('description', ''),
                    language=repo_data.get('language', ''),
                    languages=languages,
                    topics=repo_data.get('topics', []),
                    stars=repo_data['stargazers_count'],
                    forks=repo_data['forks_count'],
                    created_at=repo_data['created_at'],
                    updated_at=repo_data['updated_at'],
                    pushed_at=repo_data['pushed_at'],
                    size=repo_data['size'],
                    open_issues=repo_data['open_issues_count'],
                    is_private=repo_data['private'],
                    readme_content=readme,
                    license=repo_data.get('license', {}).get('name') if repo_data.get('license') else None,
                    homepage=repo_data.get('homepage')
                )
                repos.append(repo)
            
            page += 1
            if len(batch_repos) < per_page:
                break
        
        logger.info(f"成功获取 {len(repos)} 个仓库")
        return repos

    def get_repo_languages(self, repo_full_name: str) -> Dict[str, int]:
        """获取仓库语言分布"""
        url = f"{self.base_url}/repos/{repo_full_name}/languages"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        return {}

    def get_readme_content(self, repo_full_name: str) -> str:
        """获取README内容"""
        url = f"{self.base_url}/repos/{repo_full_name}/readme"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code == 200:
            content = response.json()
            # GitHub API返回base64编码的内容
            import base64
            try:
                return base64.b64decode(content['content']).decode('utf-8')
            except:
                return ""
        return ""

    def analyze_project(self, repo: Repository) -> ProjectAnalysis:
        """分析项目特征"""
        # 技术栈分析
        tech_stack = []
        for lang, bytes_count in repo.languages.items():
            if lang in self.tech_mapping:
                tech_stack.extend(self.tech_mapping[lang])
        
        # 去重并排序
        tech_stack = list(set(tech_stack))
        
        # 项目类型识别
        project_type = self._classify_project_type(repo)
        
        # AI协作检测
        ai_collaboration = self._detect_ai_collaboration(repo)
        
        # 复杂度评分
        complexity_score = self._calculate_complexity(repo)
        
        # 商业价值评估
        business_value = self._assess_business_value(repo)
        
        # 估算开发时长
        estimated_duration = self._estimate_duration(repo, complexity_score)
        
        # 关键特性提取
        key_features = self._extract_key_features(repo)
        
        # 角色建议
        role_suggestions = self._suggest_roles(repo, tech_stack, ai_collaboration)
        
        return ProjectAnalysis(
            repo=repo,
            tech_stack=tech_stack,
            project_type=project_type,
            business_value=business_value,
            complexity_score=complexity_score,
            ai_collaboration=ai_collaboration,
            estimated_duration=estimated_duration,
            key_features=key_features,
            role_suggestions=role_suggestions
        )

    def _classify_project_type(self, repo: Repository) -> str:
        """项目类型分类"""
        text_to_analyze = f"{repo.name} {repo.description} {' '.join(repo.topics)} {repo.readme_content}".lower()
        
        scores = {}
        for project_type, keywords in self.project_types.items():
            score = sum(1 for keyword in keywords if keyword in text_to_analyze)
            if score > 0:
                scores[project_type] = score
        
        if scores:
            return max(scores, key=scores.get)
        return "其他工具"

    def _detect_ai_collaboration(self, repo: Repository) -> bool:
        """检测AI协作特征"""
        text_to_analyze = f"{repo.name} {repo.description} {' '.join(repo.topics)} {repo.readme_content}".lower()
        
        return any(keyword in text_to_analyze for keyword in self.ai_keywords)

    def _calculate_complexity(self, repo: Repository) -> float:
        """计算项目复杂度 (0-1)"""
        score = 0.0
        
        # 代码行数权重
        if repo.size > 10000:
            score += 0.3
        elif repo.size > 1000:
            score += 0.2
        elif repo.size > 100:
            score += 0.1
        
        # 语言多样性
        lang_count = len(repo.languages)
        if lang_count > 5:
            score += 0.2
        elif lang_count > 3:
            score += 0.15
        elif lang_count > 1:
            score += 0.1
        
        # 社区活跃度
        if repo.stars > 50:
            score += 0.1
        elif repo.stars > 10:
            score += 0.05
        
        if repo.forks > 20:
            score += 0.1
        elif repo.forks > 5:
            score += 0.05
        
        # README长度
        if len(repo.readme_content) > 5000:
            score += 0.1
        elif len(repo.readme_content) > 1000:
            score += 0.05
        
        # 主题标签
        if len(repo.topics) > 5:
            score += 0.1
        elif len(repo.topics) > 2:
            score += 0.05
        
        return min(score, 1.0)

    def _assess_business_value(self, repo: Repository) -> str:
        """评估商业价值"""
        complexity = self._calculate_complexity(repo)
        ai_collab = self._detect_ai_collaboration(repo)
        
        if complexity > 0.7 and ai_collab:
            return "高价值 - AI协作复杂项目"
        elif complexity > 0.5 and ai_collab:
            return "中高价值 - AI应用项目"
        elif complexity > 0.7:
            return "中高价值 - 复杂技术项目"
        elif ai_collab:
            return "中等价值 - AI工具应用"
        elif complexity > 0.4:
            return "中等价值 - 实用工具"
        else:
            return "基础价值 - 学习项目"

    def _estimate_duration(self, repo: Repository, complexity: float) -> str:
        """估算项目时长"""
        if complexity > 0.8:
            return "2-6个月"
        elif complexity > 0.6:
            return "1-3个月"
        elif complexity > 0.4:
            return "2-6周"
        elif complexity > 0.2:
            return "1-2周"
        else:
            return "数天"

    def _extract_key_features(self, repo: Repository) -> List[str]:
        """提取关键特性"""
        features = []
        
        # 从描述和README中提取
        text = f"{repo.description} {repo.readme_content}".lower()
        
        feature_keywords = {
            '自动化处理': ['auto', 'automatic', 'batch', 'process'],
            'AI集成': ['ai', 'gpt', 'claude', 'ml', 'intelligent'],
            'Web界面': ['web', 'ui', 'interface', 'dashboard'],
            'API接口': ['api', 'rest', 'endpoint', 'service'],
            '数据处理': ['data', 'csv', 'json', 'database'],
            '图像处理': ['image', 'ocr', 'cv', 'vision'],
            '文件管理': ['file', 'folder', 'document', 'export'],
            '实时处理': ['real-time', 'live', 'monitor', 'watch'],
            '批量操作': ['batch', 'bulk', 'multiple', 'mass'],
            '跨平台': ['cross-platform', 'multi-platform', 'universal']
        }
        
        for feature, keywords in feature_keywords.items():
            if any(keyword in text for keyword in keywords):
                features.append(feature)
        
        return features[:5]  # 最多返回5个特性

    def _suggest_roles(self, repo: Repository, tech_stack: List[str], ai_collab: bool) -> List[str]:
        """建议项目角色"""
        roles = []
        
        if ai_collab:
            roles.append("AI协作专家")
        
        if any(t in tech_stack for t in ['前端开发', 'Web应用', 'React']):
            roles.append("前端开发工程师")
        
        if any(t in tech_stack for t in ['AI/ML', '数据处理']):
            roles.append("AI产品经理")
        
        if any(t in tech_stack for t in ['自动化', '脚本工具']):
            roles.append("自动化专家")
        
        if repo.stars > 10 or repo.forks > 5:
            roles.append("技术负责人")
        
        if not roles:
            roles.append("开发工程师")
        
        return roles[:3]  # 最多3个角色

    def generate_resume_report(self, analyses: List[ProjectAnalysis], days_back: int = 30) -> Dict[str, Any]:
        """生成简历更新报告"""
        logger.info("生成简历更新报告...")
        
        cutoff_date = datetime.now() - timedelta(days=days_back)
        
        # 筛选最近更新的项目
        recent_projects = []
        updated_projects = []
        
        for analysis in analyses:
            updated_time = datetime.fromisoformat(analysis.repo.updated_at.replace('Z', '+00:00'))
            if updated_time > cutoff_date:
                recent_projects.append(analysis)
            
            # 检查是否有显著更新
            if self._is_significant_update(analysis):
                updated_projects.append(analysis)
        
        # 项目统计
        stats = self._generate_project_stats(analyses)
        
        # 技能矩阵
        skill_matrix = self._generate_skill_matrix(analyses)
        
        # 重点项目推荐
        featured_projects = self._select_featured_projects(analyses)
        
        # 生成更新建议
        update_suggestions = self._generate_update_suggestions(recent_projects, updated_projects)
        
        report = {
            'generated_at': datetime.now().isoformat(),
            'summary': {
                'total_repos': len(analyses),
                'recent_updates': len(recent_projects),
                'significant_updates': len(updated_projects),
                'ai_projects': len([a for a in analyses if a.ai_collaboration]),
                'avg_complexity': sum(a.complexity_score for a in analyses) / len(analyses)
            },
            'project_stats': stats,
            'skill_matrix': skill_matrix,
            'featured_projects': [self._format_project_for_report(p) for p in featured_projects],
            'recent_updates': [self._format_project_for_report(p) for p in recent_projects],
            'update_suggestions': update_suggestions,
            'recommendations': self._generate_recommendations(analyses)
        }
        
        return report

    def _is_significant_update(self, analysis: ProjectAnalysis) -> bool:
        """判断是否为显著更新"""
        # 这里可以添加更复杂的逻辑来判断更新的重要性
        return (
            analysis.complexity_score > 0.5 or
            analysis.ai_collaboration or
            analysis.repo.stars > 5 or
            len(analysis.key_features) > 3
        )

    def _generate_project_stats(self, analyses: List[ProjectAnalysis]) -> Dict[str, Any]:
        """生成项目统计"""
        types = defaultdict(int)
        tech_usage = defaultdict(int)
        
        for analysis in analyses:
            types[analysis.project_type] += 1
            for tech in analysis.tech_stack:
                tech_usage[tech] += 1
        
        return {
            'project_types': dict(types),
            'tech_stack_usage': dict(sorted(tech_usage.items(), key=lambda x: x[1], reverse=True))
        }

    def _generate_skill_matrix(self, analyses: List[ProjectAnalysis]) -> Dict[str, int]:
        """生成技能矩阵"""
        skills = defaultdict(int)
        
        for analysis in analyses:
            for tech in analysis.tech_stack:
                skills[tech] += 1
            
            if analysis.ai_collaboration:
                skills['AI协作'] += 1
            
            for role in analysis.role_suggestions:
                skills[role] += 1
        
        return dict(sorted(skills.items(), key=lambda x: x[1], reverse=True))

    def _select_featured_projects(self, analyses: List[ProjectAnalysis], limit: int = 5) -> List[ProjectAnalysis]:
        """选择重点项目"""
        # 按复杂度、AI协作、社区活跃度排序
        scored_projects = []
        
        for analysis in analyses:
            score = analysis.complexity_score * 0.4
            if analysis.ai_collaboration:
                score += 0.3
            score += min(analysis.repo.stars / 100, 0.2)
            score += min(analysis.repo.forks / 50, 0.1)
            
            scored_projects.append((score, analysis))
        
        scored_projects.sort(key=lambda x: x[0], reverse=True)
        return [analysis for _, analysis in scored_projects[:limit]]

    def _format_project_for_report(self, analysis: ProjectAnalysis) -> Dict[str, Any]:
        """格式化项目信息用于报告"""
        return {
            'name': analysis.repo.name,
            'description': analysis.repo.description,
            'project_type': analysis.project_type,
            'business_value': analysis.business_value,
            'complexity_score': round(analysis.complexity_score, 2),
            'ai_collaboration': analysis.ai_collaboration,
            'estimated_duration': analysis.estimated_duration,
            'tech_stack': analysis.tech_stack[:5],
            'key_features': analysis.key_features,
            'role_suggestions': analysis.role_suggestions,
            'stars': analysis.repo.stars,
            'last_updated': analysis.repo.updated_at,
            'is_private': analysis.repo.is_private
        }

    def _generate_update_suggestions(self, recent_projects: List[ProjectAnalysis], 
                                   updated_projects: List[ProjectAnalysis]) -> List[str]:
        """生成更新建议"""
        suggestions = []
        
        if recent_projects:
            suggestions.append(f"发现 {len(recent_projects)} 个最近更新的项目，建议更新项目展示部分")
        
        ai_projects = [p for p in recent_projects if p.ai_collaboration]
        if ai_projects:
            suggestions.append(f"新增 {len(ai_projects)} 个AI协作项目，突出AI专家定位")
        
        high_value = [p for p in recent_projects if "高价值" in p.business_value]
        if high_value:
            suggestions.append(f"有 {len(high_value)} 个高价值项目值得重点展示")
        
        new_skills = set()
        for project in recent_projects:
            new_skills.update(project.tech_stack)
        
        if new_skills:
            suggestions.append(f"新增技能标签: {', '.join(list(new_skills)[:5])}")
        
        return suggestions

    def _generate_recommendations(self, analyses: List[ProjectAnalysis]) -> List[str]:
        """生成优化建议"""
        recommendations = []
        
        ai_count = len([a for a in analyses if a.ai_collaboration])
        total_count = len(analyses)
        
        if ai_count / total_count > 0.6:
            recommendations.append("AI协作项目比例很高，建议突出'AI协作专家'定位")
        
        avg_complexity = sum(a.complexity_score for a in analyses) / len(analyses)
        if avg_complexity > 0.6:
            recommendations.append("项目整体复杂度较高，体现了高级技术能力")
        
        private_count = len([a for a in analyses if a.repo.is_private])
        if private_count > total_count * 0.8:
            recommendations.append("私有项目较多，考虑开源部分优秀项目提升影响力")
        
        return recommendations

    def save_report(self, report: Dict[str, Any], filename: str = None) -> str:
        """保存报告到文件"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"resume_update_report_{timestamp}.json"
        
        filepath = Path(filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        logger.info(f"报告已保存到: {filepath}")
        return str(filepath)

def main():
    """主函数"""
    # 从环境变量获取配置
    github_token = os.getenv('GITHUB_TOKEN')
    github_username = os.getenv('GITHUB_USERNAME', 'Jim-purch')
    
    if not github_token:
        logger.error("请设置 GITHUB_TOKEN 环境变量")
        return
    
    # 创建监控器
    monitor = GitHubMonitor(github_token, github_username)
    
    try:
        # 获取仓库列表
        repos = monitor.get_user_repos(include_private=True)
        
        # 分析所有项目
        analyses = []
        for repo in repos:
            logger.info(f"分析项目: {repo.name}")
            analysis = monitor.analyze_project(repo)
            analyses.append(analysis)
        
        # 生成报告
        report = monitor.generate_resume_report(analyses)
        
        # 保存报告
        report_file = monitor.save_report(report)
        
        logger.info("简历更新报告生成完成!")
        logger.info(f"报告文件: {report_file}")
        
        # 打印摘要
        print("\n=== 简历更新报告摘要 ===")
        print(f"总项目数: {report['summary']['total_repos']}")
        print(f"最近更新: {report['summary']['recent_updates']} 个")
        print(f"AI项目: {report['summary']['ai_projects']} 个")
        print(f"平均复杂度: {report['summary']['avg_complexity']:.2f}")
        
        if report['update_suggestions']:
            print("\n更新建议:")
            for suggestion in report['update_suggestions']:
                print(f"- {suggestion}")
        
    except Exception as e:
        logger.error(f"执行失败: {e}")
        raise

if __name__ == "__main__":
    main()