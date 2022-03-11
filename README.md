# ufile-rest
ufile官方的node sdk实现比较悲惨……

接口参数和返回参考<https://docs.ucloud.cn/api/ufile-api/index>

[Documentation](https://bangbang93.github.io/node-ufile-rest/classes/UFile.html)

## Usage
```typescript
import {Ufile} from 'ufile-rest'

const ufile = new UFile({
  pubKey: process.env.PUB_KEY,
  priKey: process.env.PRI_KEY,
  bucketName: process.env.BUCKET_NAME,
  region: 'cn-bj',
})

const res = await ufile.prefixFileList()
console.log(res)
```
