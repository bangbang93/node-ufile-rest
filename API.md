<a name="UFile"></a>

## UFile
**Kind**: global class  

* [UFile](#UFile)
    * [new UFile(opt)](#new_UFile_new)
    * [.createBucket(bucketName, [type], region, [projectId])](#UFile+createBucket)

<a name="new_UFile_new"></a>

### new UFile(opt)
UFile SDK


| Param | Type | Description |
| --- | --- | --- |
| opt | <code>object</code> |  |
| opt.pubKey | <code>string</code> | api公钥 |
| opt.priKey | <code>string</code> | api私钥 |

<a name="UFile+createBucket"></a>

### uFile.createBucket(bucketName, [type], region, [projectId])
创建Bucket

**Kind**: instance method of [<code>UFile</code>](#UFile)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| bucketName | <code>string</code> |  | 待创建Bucket的名称，具有全局唯一性 BucketName参数将构成域名的一部分(与Bucket默认关联的域名为<BucketName>.ufile.ucloud.cn)，必须具有全局唯一性。 BucketName参数必须符合Bucket名称规范,规范如下: 1. 长度在3~63字节之间 2. 可以由多个标签组成，各个标签用 . 间隔，每个标签只能包含小字母、数字、连接符（短横线），并且标签的开头和结尾的字符只能是小写字母或数字 3. 不可以是IP地址。 |
| [type] | <code>string</code> | <code>&quot;public,private&quot;</code> | Bucket访问类型，public或private; 默认为private |
| region | <code>string</code> |  | Bucket所属地域，默认北京 |
| [projectId] | <code>string</code> |  | Bucket所属地域，默认北京 |

