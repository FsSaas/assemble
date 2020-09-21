
# 数据对象
遵守 Restfull APIs 规范, 每个对象有一个 uri 地址，如: http://www.faass.com/metaobj/api/v1/entries

## 数据对象命名规则
根据 Restfull 规则，对象使用名词负数形式，如：entries

## 数据对象版本
数据对象版本使用path区分，如：
* http://www.faass.com/metaobj/api/v1/entries
* http://www.faass.com/metaobj/api/v2/entries

## 数据对象标准行为
### 获取数据集合

uri不提供page,size参数时默认获取10条数据，不提供排序参数时，返回数据默认按照ID倒叙
* http://www.faass.com/metaobj/api/v1/entries
* http://www.faass.com/metaobj/api/v1/entries?name=z3&size=10&page=1

#### 获取数据行为标准参数
* page 数据页
* size 每页数据默认行数
* order 排序参数

#### 数据值的几种匹配类型
* 全等 
* 包含 in
* 大于 gt
* 小于 lt

匹配规则的使用，如：
* http://www.faass.com/metaobj/api/v1/entries?name=zhangyue&size=10&page=1
* http://www.faass.com/metaobj/api/v1/entries?name=$in_zhang&age$gt_18&size=10&page=1

### 获取某个数据
获取某条数据，只支持 /{id} 的形式，如：
* http://www.faass.com/metaobj/entries/1

### 更新数据
更新数据使用 HTTP 协议的 PUT 动词，uri 规则和获取数据一致，如：
* http://www.faass.com/metaobj/entries/1 [PUT]

### 删除数据
更新数据使用 HTTP 协议的 DELETE 动词，uri 规则和获取数据一致，如：
* http://www.faass.com/metaobj/entries/1 [DELETE]

### 获取数据对象的字段描述
数据对象必须提供有字段描述的接口，接口返回所有对象字段信息，如：
* http://www.faass.com/metaobj/entries/fields
```
Response:
[{
  'name': 'name',
  'label': '姓名',
  'type': 'Text',          // 借鉴数据库表资源类型 Int, Varchar, Date, Text
  'require': true,
  'placeholder': '',       // 字段的默认提示内容，用于表单字段没有数据时的提示
  'help': '',              // 字段帮助的描述信息，用于表单字段的提示，在字段下使用label方式展示
  'rules': [],             // 验证规则，主要用于数据格式验证
  'hidden': true           //  
}]
```
