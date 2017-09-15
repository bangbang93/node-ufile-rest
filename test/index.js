/**
 * Created by bangbang93 on 2017/9/13.
 */
'use strict';
require('should');
const UFile = require('../')

const ufileBucket = new UFile.Bucket({
  pubKey: process.env.pubKey,
  priKey: process.env.priKey,
})

const ufile = new UFile({
  pubKey: process.env.pubKey,
  priKey: process.env.priKey,
  bucketName: process.env.bucketName,
})

describe('UFile SDK', function () {
  it('GetProjectList', async function () {
    const resp = await ufileBucket.getProjectList({
      resourceCount: 'Yes',
      memberCount: 'Yes',
    })
    console.log(resp.body)
    console.log(resp.req)
    resp.body['RetCode'].should.eql(0)
  })
  it('PrefixFileList', async function () {
    try {
      const resp = await ufile.prefixFileList({
        bucketName: 'chipcoo-test',
      })
      resp.body['DataSet'].should.be.Array()
    } catch (e) {
      // console.error(e)
      console.error(e.response.body)
      console.error(e.response.req._headers)
      throw e
    }
  })
})
