/* eslint-disable no-console */
import {HTTPError} from 'got'
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
} catch (e) {
  if (e instanceof HTTPError) {
    console.error(e.response.body)
  }
  console.error(e)
}
