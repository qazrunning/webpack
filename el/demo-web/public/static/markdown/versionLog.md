# 基本使用

##

vue 渲染 md 文档 [mavon-editor](https://www.npmjs.com/package/mavon-editor) 这个插件还是挺不错的

## 安装

```js
 npm install mavon-editor --save
```

## 引入

```
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
app.Vue.use(mavonEditor)
```

## HTML

默认大小样式为 min-height: 300px , ming-width: 300px 可自行覆盖  
基础 z-index: 1500  
单栏编辑模式下 , TAB 键 主动触发 markdown 渲染  
屏幕分辨率低于 768px ，自动取消【单栏 | 双栏】编辑模式 ，更改为【编辑 | 预览】切换 ， 并且取消【沉浸式阅读】模式( > 768px 的眼睛图标为【阅读模式】 , 反之为【编辑 |预览】)

```html
<!-- 使用双向绑定修饰符 -->
<mavonEditor v-model="value" />
<!-- or  -->
<!-- 当value发生改变 , 触发change事件 -->

<mavonEditor :value="value" @change="function" />
```

## API 文档

### props

| 属性名             | 类型         | 默认值                          | 说明                                                                                                                         |
| ------------------ | ------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| value              | String       |                                 | 初始值                                                                                                                       |
| scrollStyle        | Boolean true | undefined                       | 开启滚动条样式(暂时仅支持 chrome)                                                                                            |
| subfield           | Boolean      | true                            | 默认开启双栏编辑(单栏模式 TAB 键主动触发 markdown 渲染)                                                                      |
| language           | String       | zh-CN                           | 语言选择，暂支持 zh-CN: 简体中文, zh-TW: 正体中文 ， en: 英文 ， fr: 法语， pt-BR: 葡萄牙语， ru: 俄语， de: 德语， ja: 日语 |
| fontSize           | String       | 14px                            | 编辑区域文字大小                                                                                                             |
| boxShadow          | Boolean      | true                            | 开启边框阴影                                                                                                                 |
| boxShadowStyle     | String       | 0 2px 12px 0 rgba(0, 0, 0, 0.1) | 边框阴影样式                                                                                                                 |
| transition         | Boolean      | true                            | 是否开启过渡动画                                                                                                             |
| toolbarsBackground | String       | #ffffff                         | 工具栏背景颜色                                                                                                               |
| previewBackground  | String       | 0 2px 12px 0 rgba(0, 0, 0, 0.1) | 边框阴影样式                                                                                                                 |
| subfield           | Boolean      | true                            | true： 双栏(编辑预览同屏)， false： 单栏(编辑预览分屏)                                                                       |
| defaultOpen        | String       | edit                            | edit： 默认展示编辑区域 ， preview： 默认展示预览区域 , 其他 = edit                                                          |
| placeholder        | String       | 开始编辑...                     | 输入框为空时默认提示文本                                                                                                     |
| editable           | Boolean      | true                            | 是否允许编辑                                                                                                                 |
| codeStyle          | String       | code-github                     | markdown 样式： 默认 github,[可选配色方案](https://github.com/hinesboy/mavonEditor/blob/HEAD/src/lib/core/hljs/lang.hljs.css.js)                                                                                    |
| toolbarsFlag       | Boolean      | true                            | 工具栏是否显示                                                                                                               |
| navigation         | Boolean      | false                           | 默认展示目录                                                                                                                 |
| shortCut           | Boolean      | true                            | 是否启用快捷键                                                                                                               |
| autofocus          | Boolean      | true                            | 自动聚焦到文本框                                                                                                             |
| ishljs             | Boolean      | true                            | 代码高亮                                                                                                                     |
| imageFilter        | function     | null                            | 图片过滤函数，参数为一个 File Object，要求返回一个 Boolean, true 表示文件合法，false 表示文件不合法                          |
| imageClick         | function     | null                            | 图片点击事件，默认为预览，可覆盖                                                                                             |
| tabSize            | Number       | \t                              | tab 转化为几个空格，默认为\t                                                                                                 |
| toolbars           | Object       | 如下                            | 工具栏                                                                                                                       |

```js
 /*
    默认工具栏按钮全部开启, 如需关闭, 设置对应键值为false即可
    例如: {
        bold: false
    }
    此时, 粗体将被隐藏,其余正常显示
 */
toolbars: {
      bold: true, // 粗体
      italic: true,// 斜体
      header: true,// 标题
      underline: true,// 下划线
      strikethrough: true,// 中划线
      mark: true,// 标记
      superscript: true,// 上角标
      subscript: true,// 下角标
      quote: true,// 引用
      ol: true,// 有序列表
      ul: true,// 无序列表
      link: true,// 链接
      imagelink: true,// 图片链接
      code: true,// code
      table: true,// 表格
      subfield: true,// 是否需要分栏
      fullscreen: true,// 全屏编辑
      readmodel: true,// 沉浸式阅读
      htmlcode: true,// 展示html源码
      help: true// 帮助
  } 
```

## events 事件绑定

| name             | 方法名 params 参数                      | describe 描述                                                         |
| ---------------- | --------------------------------------- | --------------------------------------------------------------------- |
| change           | String: value , String: render          | 编辑区发生变化的回调事件(render: value 经过 markdown 解析后的结果)    |
| save             | String: value , String: render ctrl + s | 的回调事件(保存按键,同样触发该回调)                                   |
| fullScreen       | Boolean: status , String: value         | 切换全屏编辑的回调事件(boolean: 全屏开启状态)                         |
| readModel        | Boolean: status , String: value         | 切换沉浸式阅读的回调事件(boolean: 阅读开启状态)                       |
| htmlCode         | Boolean: status , String: value         | 查看 html 源码的回调事件(boolean: 源码开启状态)                       |
| subfieldToggle   | Boolean: status , String: value         | 切换单双栏编辑的回调事件(boolean: 双栏开启状态)                       |
| previewToggle    | Boolean: status , String: value         | 切换预览编辑的回调事件(boolean: 预览开启状态)                         |
| helpToggle       | Boolean: status , String: value         | 查看帮助的回调事件(boolean: 帮助开启状态)                             |
| navigationToggle | Boolean: status , String: value         | 切换导航目录的回调事件(boolean: 导航开启状态)                         |
| imgAdd           | String: filename, File: imgfile         | 图片文件添加回调事件(filename: 写在 md 中的文件名, File: File Object) |
| imgDel           | String: filename                        | 图片文件删除回调事件(filename: 写在 md 中的文件名)                    |
