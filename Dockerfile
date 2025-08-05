FROM python:3.9-slim

LABEL maintainer="Jim <cxxvcheng@outlook.com>"
LABEL description="GitHub Repository Monitor for Resume Updates"

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV TZ=Asia/Shanghai

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    git \
    curl \
    tzdata \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY *.py ./
COPY config.json ./

# 创建必要的目录
RUN mkdir -p data/reports data/cache logs

# 设置权限
RUN chmod +x *.py

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import sys; sys.exit(0)" || exit 1

# 暴露端口（如果需要Web界面）
EXPOSE 8000

# 创建非root用户
RUN useradd -m -s /bin/bash appuser && \
    chown -R appuser:appuser /app
USER appuser

# 启动命令
CMD ["python", "scheduler.py"]