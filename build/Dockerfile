# 基础 tnginx 镜像
FROM nginx:latest

#工作目录
WORKDIR /etc/nginx/

# 复制自定义的配置文件
COPY build/nginx.conf .

# 创建静态资源存储目录
RUN mkdir -p /usr/local/showmd/

# COPY静态文件
COPY dist/ /usr/local/showmd/web/

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]