/* eslint-disable no-console */
import {createReadStream} from 'fs'
import {HTTPError} from 'got'
import {fileURLToPath} from 'url'
import {UFile} from '../src/index.js'

const ufile = new UFile({
  pubKey: process.env.PUB_KEY,
  priKey: process.env.PRI_KEY,
  bucketName: process.env.BUCKET_NAME,
  region: 'cn-bj',
})

try {
  const res = await ufile.prefixFileList()
  console.log(res)
  await ufile.putFile('test', createReadStream(fileURLToPath(import.meta.url)))
} catch (e) {
  if (e instanceof HTTPError) {
    console.error(e.response.body)
  }
  console.error(e)
}
