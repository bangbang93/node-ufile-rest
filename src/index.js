/**
 * Created by bangbang93 on 2017/9/13.
 */
'use strict';
const request = require('superagent')
const crypto = require('crypto')
const pascalCase = require('pascal-case')

class UFile {
  /**
   * UFile SDK
   * @param {string} pubKey api公钥
   * @param {string} priKey api私钥
   * @param {string} bucketName 存储空间名
   * @param {string} domain 存储空间域名
   * @param {boolean} useHttps=false 是否使用https
   */
  constructor ({pubKey, priKey, bucketName, domain = '.cn-bj.ufileos.com', useHttps = false}) {
    this._pubKey = pubKey
    this._priKey = priKey
    this._bucketName = bucketName
    this._domain = domain
    this._protocol = useHttps? 'https' : 'http'
  }

  prefixFileList({prefix, marker, limit}) {
    return this._request({
      url: `http://${this._bucketName}${this._domain}`,
      qs: {
        list: '',
        prefix,
        marker,
        limit
      }
    })
  }

  getFile({filename}) {
    return this._request({
      key: filename
    })
  }

  async _request({url, qs, body, method = 'get', files, headers, key = ''}) {
    if (!key.startsWith('/')) {
      key = '/' + key
    }
    if (!url) {
      url = `${this._protocol}://${this._bucketName}${this._domain}${key}`
    }

    const req = request(method, url)
    if (headers) {
      req.set(headers)
    }
    switch (method.toLowerCase()) {
      case 'post':
      case 'put':
      case 'patch':
        if (files) {
          req.field(body)
          Object.keys(files)
            .forEach((key) => {
              req.attach(key, files[key])
            })
        } else {
          req.send(body)
        }
        break
      default:
        break
    }
    if (qs) req.query(qs)
    req.use((req) => {
      req.set('authorization', `UCloud ${this._pubKey}:${this._sign(req, key)}`)
    })
    return req
  }
  

  _sign(req, key) {
    let p = [req.method.toUpperCase(), req.get('content-md5') || '', req.get('content-type') || '', req.get('date') ||'']
    Object.keys(req.header)
      .sort()
      .forEach((key) => {
        if (key.startsWith('X-UCloud')) {
          p.push(`${key.toLowerCase()}:${req.get(key)}`)
        }
      })
    p.push(`/${this._bucketName}${key}`)
    const stringToSign = p.join('\n')
    console.log(stringToSign)
    return hmacSha1(stringToSign, this._priKey)
  }
}

module.exports = UFile

const UFileBucket = require('./bucket')
UFile.Bucket = UFileBucket

function hmacSha1(str, priKey, digest = 'base64') {
  return crypto.createHmac('sha1', priKey).update(str).digest(digest)
}

function pascalObject(obj) {
  const r = {};
  Object.keys(obj)
    .forEach((key) => {
      r[pascalCase(key)] = obj[key]
    })
  return r
}
