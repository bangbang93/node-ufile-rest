/**
 * Created by bangbang93 on 2017/9/13.
 */
'use strict';
const rp = require('request-promise')
const crypto = require('crypto')
const pascalCase = require('pascal-case')

class UFile {
  /**
   * UFile SDK
   * @param {string} pubKey api公钥
   * @param {string} priKey api私钥
   */
  constructor ({pubKey, priKey}) {
    this._pubKey = pubKey
    this._priKey = priKey
  }

  getProjectList({resourceCount, memberCount}) {
    return this._request({
      url: 'https://api.ucloud.cn/usub_account',
      qs: {
        action: 'GetProjectList',
        resourceCount,
        memberCount
      }
    })
  }

  /**
   * 创建Bucket
   * @param {string} bucketName 待创建Bucket的名称，具有全局唯一性
   * BucketName参数将构成域名的一部分(与Bucket默认关联的域名为<BucketName>.ufile.ucloud.cn)，必须具有全局唯一性。
   * BucketName参数必须符合Bucket名称规范,规范如下:
   * 1. 长度在3~63字节之间
   * 2. 可以由多个标签组成，各个标签用 . 间隔，每个标签只能包含小字母、数字、连接符（短横线），并且标签的开头和结尾的字符只能是小写字母或数字
   * 3. 不可以是IP地址。
   * @param {string} [type=public,private] Bucket访问类型，public或private; 默认为private
   * @param {string} region Bucket所属地域，默认北京
   * @param {string} [projectId] Bucket所属地域，默认北京
   * @returns {Promise}
   */
  createBucket({bucketName, type, region, projectId}) {
    return this._request({
      action: 'CreateBucket',
      bucketName,
      type,
      region,
      projectId,
    })
  }

  describeBucket({bucketName, offset, limit, projectId}) {
    return this._request({
      BucketName: bucketName,
      offset,
      limit,
      projectId,
    })
  }

  async _request({url, qs, body, method = 'get', formData, resolveWithFullResponse = false}) {
    url = url || 'https://api.ucloud.cn'
    switch (method.toLowerCase()) {
      case 'post': case 'put': case 'patch':
        if (body) {
          body.publicKey = this._pubKey
          body.signature = this._sign(body)
          body = pascalObject(body)
        } else if (formData) {
          formData.publickey = this._pubKey
          formData.signature = this._sign(formData)
          formData = pascalObject(formData)
        }
        break
      default:
        qs.publicKey = this._pubKey
        qs.signature = this._sign(qs)
        qs = pascalObject(qs)
        break
    }
    return rp({
      url,
      method,
      qs,
      body,
      json: true,
      resolveWithFullResponse,
    })
  }

  _sign(params) {
    const signStr = Object.keys(params)
      .sort()
      .reduce((r, key) => {
        return r + key + params[key]
      }, '') + this._priKey
    return sha1(signStr)
  }
}

module.exports = UFile

function sha1(str) {
  return crypto.createHash('sha1').update(str).digest('hex')
}

function pascalObject(obj) {
  const r = {};
  Object.keys(obj)
    .forEach((key) => {
      r[pascalCase(key)] = obj[key]
    })
  return r
}
