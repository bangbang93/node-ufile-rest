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
  = 'tomoyo/ftp/stdf/Datalog/YL0003/A778939-/3380D-0036_2020NOV27052911A778939-22A778939-20201127_034116.std.xz'

try {
  await ufile.restore(file)
  console.time('restore')
  console.log('restore')
  console.log(await ufile.headFile(file))
  for (;;) {
    await setTimeout(5e3)
    console.timeLog('restore')
    console.log(await ufile.headFile(file))
  }
} catch (e) {
  if (e instanceof HTTPError) {
    console.error(e.response.body)
  }
  console.error(e)
}
