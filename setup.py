#!/usr/bin/env python3
"""
GitHub仓库监控系统安装脚本
Author: Jim
"""

from setuptools import setup, find_packages
import os

# 读取README文件
def read_readme():
    try:
        with open('README_monitor.md', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "GitHub Repository Monitor for Resume Updates"

# 读取requirements
def read_requirements():
    with open('requirements.txt', 'r', encoding='utf-8') as f:
        return [line.strip() for line in f if line.strip() and not line.startswith('#')]

setup(
    name='github-resume-monitor',
    version='1.0.0',
    description='智能GitHub仓库监控与简历更新系统',
    long_description=read_readme(),
    long_description_content_type='text/markdown',
    author='Jim',
    author_email='cxxvcheng@outlook.com',
    url='https://github.com/Jim-purch/jim-resume',
    packages=find_packages(),
    py_modules=[
        'github_monitor',
        'report_generator', 
        'scheduler'
    ],
    install_requires=read_requirements(),
    python_requires='>=3.7',
    classifiers=[
        'Development Status :: 4 - Beta',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.10',
        'Programming Language :: Python :: 3.11',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Office/Business :: Scheduling',
    ],
    keywords='github resume monitoring automation ai-collaboration',
    entry_points={
        'console_scripts': [
            'github-monitor=scheduler:main',
            'github-analyze=github_monitor:main',
            'resume-report=report_generator:create_sample_report',
        ],
    },
    include_package_data=True,
    package_data={
        '': ['*.json', '*.md', '*.txt', '*.yml', '*.yaml'],
    },
    zip_safe=False,
    project_urls={
        'Bug Reports': 'https://github.com/Jim-purch/jim-resume/issues',
        'Source': 'https://github.com/Jim-purch/jim-resume',
        'Documentation': 'https://github.com/Jim-purch/jim-resume/blob/main/README_monitor.md',
    },
)