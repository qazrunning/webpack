FROM node:12.4.0-alpine
LABEL maintainer="zhangjiliang"
ENV PORT 8080

RUN apk --update add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata

RUN mkdir -p /app
ADD ./skyland-server.tar.gz /app

WORKDIR /app
RUN npm i --production --registry=http://192.168.126.129:7001/

EXPOSE 8080

ENTRYPOINT ["npm","run", "start"]
