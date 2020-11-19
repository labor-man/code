*There appears to be trouble with your network connection. Retrying...*

for proxy problems =>

**npm**
```shell script
npm config rm proxy
npm config rm https-proxy
```
**yarn**
```
yarn config delete proxy
yarn config delete https-proxy
```

npm config get registry  // 查看npm当前镜像源

npm config set registry https://registry.npm.taobao.org/  // 设置npm镜像源为淘宝镜像

yarn config get registry  // 查看yarn当前镜像源

yarn config set registry https://registry.npm.taobao.org/  // 设置yarn镜像源为淘宝镜像
