/**
 * Created by bangbang93 on 2017/9/15.
 */
'use strict';
const request = require('superagent')
const crypto = require('crypto')
const pascalCase = require('pascal-case')

class UFileBucket {
  /**
   * UFileBucket SDK
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
   * @param {string} [type=private] Bucket访问类型，public或private; 默认为private
   * @param {string} region Bucket所属地域，默认北京
   * @param {string} [projectId] 项目ID
   * @returns {Promise}
   */
  createBucket({bucketName, type, region, projectId}) {
    return this._request({body: {action: 'CreateBucket', bucketName, type, region, projectId}})
  }

  /**
   * 获取Bucket信息
   * @param {string} [bucketName] 待获取Bucket的名称，若不提供，则获取所有Bucket
   * @param {number} [offset] 获取所有Bucket列表的偏移数目，默认为0
   * @param {number} [limit] 获取所有Bucket列表的限制数目，默认为20
   * @param {string} [projectId] 项目ID
   * @returns {Promise}
   */
  describeBucket({bucketName, offset, limit, projectId}) {
    return this._request({body: {action: 'DescribeBucket', bucketName, offset, limit, projectId}})
  }

  updateBucket({bucketName, type, projectId}) {
    return this._request({body: {action: 'UpdateBucket', bucketName, type, projectId}})
  }

  deleteBucket({bucketName, projectId}) {
    return this._request({body: {action: 'DeleteBucket', bucketName, projectId}})
  }

  _sign(params) {
    const signStr = Object.keys(params)
      .sort()
      .reduce((r, key) => {
        return r + key + params[key]
      }, '') + this._priKey
    return sha1(signStr)
  }

  async _request({url, qs, body, method = 'get', headers}) {
    url = url || 'https://api.ucloud.cn'
    const req = request(method, url)
    if (headers) {
      req.set(headers)
    }
    switch (method.toLowerCase()) {
      case 'post':
      case 'put':
      case 'patch':
        body           = pascalObject(body)
        body.PublicKey = this._pubKey
        body.Signature = this._sign(body)
        req.send(body)
        break
      default:
        qs           = pascalObject(qs)
        qs.PublicKey = this._pubKey
        qs.Signature = this._sign(qs)
        break
    }
    if (qs) req.query(qs)
    return req
  }
}

module.exports = UFileBucket

function pascalObject(obj) {
  const r = {};
  Object.keys(obj)
    .forEach((key) => {
      r[pascalCase(key)] = obj[key]
    })
  return r
}

function sha1(str, digest = 'hex') {
  return crypto.createHash('sha1').update(str).digest(digest)
}
