## storybook deploy

### 1. Config
在du-ui目录下添加.aliossrc文件
* accessKeyId和accessKeySecret信息需要在阿里云后台生成
```json  .aliossrc
{
  "accessKeyId": "",
  "accessKeySecret": "",
  "region": "oss-cn-shanghai",
  "bucket": "echo-components-page"
}
```

### 2. build
在du-ui目录下执行 `pnpm build-storybook`打包静态资源


### 3. Deploy
执行 `pnpm deploy`将静态资源部署到阿里云
