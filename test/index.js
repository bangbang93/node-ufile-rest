/**
 * Created by bangbang93 on 2017/9/13.
 */
'use strict';
require('should');
const UFile = require('../')

let ufile = new UFile({
  pubKey: process.env.pubKey,
  priKey: process.env.priKey,
})

describe('UFile SDK', function () {
  it('GetProjectList', async function () {
    const resp = await ufile.getProjectList({
      resourceCount: 'Yes',
      memberCount: 'Yes',
    })
    resp['RetCode'].should.eql(0)
  })
})
