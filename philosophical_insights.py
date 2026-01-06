#!/usr/bin/env python3
"""
哲学洞察生成器
Author: Jim
Purpose: 从项目轨迹中提炼个人哲学、价值观和思维模式
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from collections import defaultdict
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


@dataclass
class PersonalPhilosophy:
    """个人哲学画像"""
    
    # 核心价值观
    core_values: List[str] = field(default_factory=list)
    
    # 思维模式
    thinking_patterns: List[str] = field(default_factory=list)
    
    # 成长轨迹
    growth_narrative: str = ""
    growth_stages: List[Dict[str, str]] = field(default_factory=list)
    
    # 问题解决哲学
    problem_solving_approach: str = ""
    
    # 技术与人文平衡
    tech_humanity_balance: str = ""
    
    # 创造者思维
    creator_mindset: str = ""
    
    # AI 协作观
    ai_collaboration_view: str = ""
    
    # 一句话哲学宣言
    philosophy_statement: str = ""
    
    # 深层洞察
    deep_insights: List[str] = field(default_factory=list)


@dataclass
class ProjectPhilosophyData:
    """用于哲学分析的项目数据"""
    name: str
    project_type: str
    created_at: str
    complexity_score: float
    ai_collaboration: bool
    key_features: List[str]
    business_value: str
    languages: List[str]
    description: str = ""


class PhilosophicalInsightGenerator:
    """哲学洞察生成器 - 从代码中提炼人生哲学"""
    
    def __init__(self):
        # 价值观映射
        self.value_indicators = {
            '效率的追求': ['automation', 'batch', 'quick', 'fast', 'efficient', 'auto'],
            '极致的用户体验': ['ui', 'ux', 'interface', 'user', 'experience', 'design'],
            '系统化思维': ['system', 'architecture', 'structure', 'framework', 'organize'],
            '持续学习与迭代': ['learn', 'improve', 'update', 'version', 'iteration'],
            '解决实际问题': ['solve', 'fix', 'tool', 'utility', 'helper', 'process'],
            '开源共享精神': ['open', 'share', 'community', 'public', 'free'],
            '技术与商业的平衡': ['business', 'value', 'enterprise', 'professional'],
            '创新与探索': ['new', 'experiment', 'explore', 'innovative', 'novel'],
        }
        
        # 思维模式映射
        self.thinking_patterns = {
            '问题拆解者': ['parse', 'extract', 'split', 'separate', 'decompose'],
            '流程优化者': ['workflow', 'process', 'pipeline', 'automation', 'streamline'],
            '工具创造者': ['tool', 'utility', 'generator', 'converter', 'builder'],
            '系统整合者': ['integrate', 'combine', 'merge', 'connect', 'sync'],
            '数据驱动者': ['data', 'analysis', 'statistics', 'metrics', 'report'],
            '用户同理者': ['user', 'experience', 'interface', 'accessibility', 'friendly'],
        }
        
        # 项目类型与思维关联
        self.type_philosophy = {
            'AI工具': '相信技术增益可以放大人的能力',
            '自动化工具': '追求将重复劳动转化为可复用的系统',
            'Web应用': '关注用户体验与技术实现的平衡',
            '数据处理': '相信数据中蕴含着可挖掘的价值',
            '企业系统': '理解商业价值与技术方案的关联',
            '开发工具': '为创造者创造工具，形成价值链',
        }

    def analyze_project_philosophy(self, project: ProjectPhilosophyData) -> Dict[str, Any]:
        """分析单个项目的哲学内涵"""
        
        text = f"{project.name} {project.description} {' '.join(project.key_features)}".lower()
        
        # 检测价值观
        detected_values = []
        for value, keywords in self.value_indicators.items():
            if any(kw in text for kw in keywords):
                detected_values.append(value)
        
        # 检测思维模式
        detected_patterns = []
        for pattern, keywords in self.thinking_patterns.items():
            if any(kw in text for kw in keywords):
                detected_patterns.append(pattern)
        
        return {
            'name': project.name,
            'values': detected_values,
            'patterns': detected_patterns,
            'type_philosophy': self.type_philosophy.get(project.project_type, ''),
            'complexity': project.complexity_score,
            'ai_involved': project.ai_collaboration,
            'created_at': project.created_at
        }

    def generate_philosophy(self, projects: List[ProjectPhilosophyData]) -> PersonalPhilosophy:
        """从所有项目中生成个人哲学画像"""
        
        philosophy = PersonalPhilosophy()
        
        # 分析所有项目
        all_values = []
        all_patterns = []
        project_analyses = []
        
        for project in projects:
            analysis = self.analyze_project_philosophy(project)
            project_analyses.append(analysis)
            all_values.extend(analysis['values'])
            all_patterns.extend(analysis['patterns'])
        
        # 统计价值观频率
        value_counts = defaultdict(int)
        for v in all_values:
            value_counts[v] += 1
        
        # 取前5个核心价值观
        sorted_values = sorted(value_counts.items(), key=lambda x: x[1], reverse=True)
        philosophy.core_values = [v[0] for v in sorted_values[:5]]
        
        # 统计思维模式频率
        pattern_counts = defaultdict(int)
        for p in all_patterns:
            pattern_counts[p] += 1
        
        sorted_patterns = sorted(pattern_counts.items(), key=lambda x: x[1], reverse=True)
        philosophy.thinking_patterns = [p[0] for p in sorted_patterns[:4]]
        
        # 生成成长叙事
        philosophy.growth_narrative = self._generate_growth_narrative(projects, project_analyses)
        philosophy.growth_stages = self._identify_growth_stages(projects)
        
        # 生成问题解决哲学
        philosophy.problem_solving_approach = self._generate_problem_solving_approach(
            philosophy.thinking_patterns, project_analyses
        )
        
        # 生成技术与人文平衡观
        philosophy.tech_humanity_balance = self._generate_tech_humanity_view(projects)
        
        # 生成创造者思维
        philosophy.creator_mindset = self._generate_creator_mindset(projects, project_analyses)
        
        # 生成 AI 协作观
        ai_projects = [p for p in projects if p.ai_collaboration]
        philosophy.ai_collaboration_view = self._generate_ai_view(ai_projects, len(projects))
        
        # 生成哲学宣言
        philosophy.philosophy_statement = self._generate_philosophy_statement(philosophy)
        
        # 生成深层洞察
        philosophy.deep_insights = self._generate_deep_insights(philosophy, projects)
        
        return philosophy

    def _generate_growth_narrative(self, projects: List[ProjectPhilosophyData], 
                                   analyses: List[Dict]) -> str:
        """生成成长叙事"""
        
        total = len(projects)
        ai_count = sum(1 for p in projects if p.ai_collaboration)
        ai_ratio = ai_count / total if total > 0 else 0
        
        avg_complexity = sum(p.complexity_score for p in projects) / total if total > 0 else 0
        
        narratives = []
        
        if ai_ratio > 0.6:
            narratives.append("从早期的独立探索，逐渐发展为与 AI 深度协作的创作模式")
        
        if avg_complexity > 0.4:
            narratives.append("项目复杂度的提升反映了技术能力的持续成长")
        
        # 检测项目类型多样性
        types = set(p.project_type for p in projects)
        if len(types) > 3:
            narratives.append("跨越多个技术领域的探索体现了求知的广度")
        
        if not narratives:
            narratives.append("在持续的项目实践中积累经验，形成独特的技术视角")
        
        return "。".join(narratives) + "。"

    def _identify_growth_stages(self, projects: List[ProjectPhilosophyData]) -> List[Dict[str, str]]:
        """识别成长阶段"""
        
        stages = []
        
        # 按时间排序项目
        try:
            sorted_projects = sorted(projects, key=lambda p: p.created_at)
        except:
            sorted_projects = projects
        
        # 简化的阶段划分
        total = len(sorted_projects)
        if total == 0:
            return stages
        
        # 早期阶段
        early = sorted_projects[:max(1, total // 3)]
        early_types = set(p.project_type for p in early)
        stages.append({
            'stage': '探索期',
            'description': f"初步涉猎 {', '.join(list(early_types)[:2])} 等领域",
            'insight': '建立技术基础，积累项目经验'
        })
        
        # 中期阶段
        if total > 3:
            mid = sorted_projects[total // 3: 2 * total // 3]
            mid_ai = sum(1 for p in mid if p.ai_collaboration)
            stages.append({
                'stage': '深耕期',
                'description': f"项目复杂度提升，{'开始探索 AI 协作' if mid_ai > 0 else '深化技术实践'}",
                'insight': '形成技术方法论，提升问题解决能力'
            })
        
        # 成熟阶段
        if total > 6:
            late = sorted_projects[2 * total // 3:]
            late_ai_ratio = sum(1 for p in late if p.ai_collaboration) / len(late)
            stages.append({
                'stage': '成熟期',
                'description': f"{'AI 协作成为主流模式' if late_ai_ratio > 0.5 else '技术能力全面成熟'}",
                'insight': '从执行者转变为创造者，形成独特的技术哲学'
            })
        
        return stages

    def _generate_problem_solving_approach(self, patterns: List[str], 
                                           analyses: List[Dict]) -> str:
        """生成问题解决哲学"""
        
        approaches = []
        
        if '问题拆解者' in patterns:
            approaches.append("善于将复杂问题拆解为可管理的模块")
        
        if '流程优化者' in patterns:
            approaches.append("追求通过系统化设计消除低效环节")
        
        if '工具创造者' in patterns:
            approaches.append("相信好的工具可以放大解决问题的能力")
        
        if '系统整合者' in patterns:
            approaches.append("擅长将分散的能力整合为完整的解决方案")
        
        if not approaches:
            approaches.append("以实践为导向，在项目中不断优化解决方案")
        
        return "；".join(approaches) + "。"

    def _generate_tech_humanity_view(self, projects: List[ProjectPhilosophyData]) -> str:
        """生成技术与人文平衡观"""
        
        # 分析项目中的用户导向
        user_oriented = sum(1 for p in projects 
                           if any(f in str(p.key_features).lower() 
                                 for f in ['用户', 'ui', '界面', 'web', 'user']))
        
        total = len(projects)
        user_ratio = user_oriented / total if total > 0 else 0
        
        if user_ratio > 0.5:
            return "技术是手段，用户体验是目的。在追求技术深度的同时，始终以用户价值为导向。"
        elif user_ratio > 0.3:
            return "在技术实现与用户需求之间寻找平衡，相信好的技术应该是透明的、易用的。"
        else:
            return "以技术能力为根基，通过工具和系统的构建间接服务于用户需求。"

    def _generate_creator_mindset(self, projects: List[ProjectPhilosophyData],
                                  analyses: List[Dict]) -> str:
        """生成创造者思维描述"""
        
        tool_projects = sum(1 for a in analyses 
                           if '工具创造者' in a.get('patterns', []))
        
        total = len(projects)
        
        if tool_projects > total * 0.4:
            return "从使用工具到创造工具的转变，体现了从消费者到生产者的思维跃迁。每一个解决痛点的工具，都是对世界的一次微小改进。"
        else:
            return "在解决实际问题的过程中，逐渐形成了将想法转化为可用产品的能力。创造的价值在于解决真实的需求。"

    def _generate_ai_view(self, ai_projects: List[ProjectPhilosophyData], 
                          total_count: int) -> str:
        """生成 AI 协作观"""
        
        ai_ratio = len(ai_projects) / total_count if total_count > 0 else 0
        
        if ai_ratio > 0.6:
            return "AI 不是替代人的威胁，而是增强人的工具。与 AI 的深度协作让创造力得以放大，让想法更快地转化为现实。这是一种新的创作范式：人提供方向与判断，AI 提供执行与可能性。"
        elif ai_ratio > 0.3:
            return "AI 正在成为创作过程中的重要伙伴。它不仅是工具，更是思维的延伸。在人机协作中，人的价值在于判断力和创造力，AI 的价值在于可能性和效率。"
        else:
            return "AI 是值得探索的技术方向。在保持对技术本质理解的同时，逐步将 AI 融入工作流程，期待人机协作带来的新可能。"

    def _generate_philosophy_statement(self, philosophy: PersonalPhilosophy) -> str:
        """生成一句话哲学宣言"""
        
        # 基于核心价值观和思维模式生成
        if '效率的追求' in philosophy.core_values and '工具创造者' in philosophy.thinking_patterns:
            return "用代码自动化重复，用工具放大创造力，让技术成为人的延伸而非束缚。"
        
        if '极致的用户体验' in philosophy.core_values:
            return "技术的终极使命是服务于人，让复杂变得简单，让困难变得可能。"
        
        if '系统化思维' in philosophy.core_values:
            return "以系统的眼光看待问题，以工程的方法解决问题，以创造的心态面对世界。"
        
        if '持续学习与迭代' in philosophy.core_values:
            return "在不断的学习与迭代中成长，相信每一次优化都是向更好的接近。"
        
        # 默认宣言
        return "在技术与创造的交汇处，寻找解决问题的最优路径，让想法成为现实。"

    def _generate_deep_insights(self, philosophy: PersonalPhilosophy,
                                projects: List[ProjectPhilosophyData]) -> List[str]:
        """生成深层洞察"""
        
        insights = []
        
        total = len(projects)
        ai_count = sum(1 for p in projects if p.ai_collaboration)
        
        # 关于 AI 协作的洞察
        if ai_count > total * 0.5:
            insights.append(
                "高频的 AI 协作实践揭示了一个事实：未来的创造者不是与 AI 竞争，而是与 AI 共舞。"
                "掌握与 AI 协作的艺术，就是掌握未来创作的语言。"
            )
        
        # 关于工具创造的洞察
        if '工具创造者' in philosophy.thinking_patterns:
            insights.append(
                "每一个工具的创造都是对世界的一次理解与改造。工具既是思想的外化，也是能力的结晶。"
                "好的工具能够让使用者专注于真正重要的事情。"
            )
        
        # 关于效率的洞察
        if '效率的追求' in philosophy.core_values:
            insights.append(
                "对效率的追求不是对慢的否定，而是对时间的尊重。"
                "将重复劳动自动化，就是为创造力腾出空间。"
            )
        
        # 关于成长的洞察
        if len(projects) > 10:
            insights.append(
                f"从 {len(projects)} 个项目的实践中可以看到：成长不是线性的突破，而是在无数次尝试中积累的微小进步。"
                "每一个项目都是对某个问题的回答，也是对自我能力边界的一次探索。"
            )
        
        # 通用洞察
        if not insights:
            insights.append(
                "技术实践的意义不仅在于解决眼前的问题，更在于在解决问题的过程中重塑自己的思维方式。"
            )
        
        return insights[:3]  # 最多返回3个洞察


def generate_philosophy_from_projects(projects_data: List[Dict[str, Any]]) -> PersonalPhilosophy:
    """便捷函数：从项目数据生成哲学画像"""
    
    generator = PhilosophicalInsightGenerator()
    
    projects = [
        ProjectPhilosophyData(
            name=p.get('name', ''),
            project_type=p.get('project_type', ''),
            created_at=p.get('created_at', ''),
            complexity_score=p.get('complexity_score', 0.0),
            ai_collaboration=p.get('ai_collaboration', False),
            key_features=p.get('key_features', []),
            business_value=p.get('business_value', ''),
            languages=list(p.get('languages', {}).keys()),
            description=p.get('description', '')
        )
        for p in projects_data
    ]
    
    return generator.generate_philosophy(projects)
