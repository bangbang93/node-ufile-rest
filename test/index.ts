/* eslint-disable no-console */
import {HTTPError} from 'got'
import {UFile} from '../src/index.js'
import {setTimeout} from 'timers/promises'

const ufile = new UFile({
  pubKey: process.env.PUB_KEY,
  priKey: process.env.PRI_KEY,
  bucketName: process.env.BUCKET_NAME,
  region: 'cn-bj',
})

const file
  = 'tomoyo/ftp/stdf/Datalog/YL0003/A778939-/3380D-0036_2020NOV26123818A778939-13A778939-20201126_104753.std.xz'

try {
  await ufile.restore(file)
  console.log('restore')
  for (let i = 0; i <= 30; i++) {
    const res = await ufile.got.head(file, {throwHttpErrors: false})
    console.log(res.headers)
    await setTimeout(10e3)
    console.log('check restore(HeadFile) return:', res.statusCode, 'try', i)
  }
  console.log('restore success')
  const res = await ufile.getFile(file)
  console.log(res.length)
} catch (e) {
  if (e instanceof HTTPError) {
    console.error(e.response.body)
  }
  console.error(e)
}
