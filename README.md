## Installation

```shell
$ yarn
```

## Node
**node版本建议在v14-16**

## Use

In the project directory, you can run:

```shell
$ yarn start
```

Runs the app in the development mode.
Paste [http://localhost:9111/](http://localhost:9111/) to view it in the browser, since the path has been copied automatically.



## 开发

### 1.代理配置
在 **/scripts/server.ts** 中配置，如：
```javascript
// 接口代理
app.use(
  createProxyMiddleware('/proxyApi/', {
    target: 'http://192.168.0.2:9090/',
    pathRewrite: {
      '^/proxyApi/': '/', // rewrite path
    },
    changeOrigin: true,
  })
);
```

### 2.页面
在 **/src/container/page** 目录内写需求页面

### 3.开发说明
1、所有接口统一封装在 **/src/container/page/api.ts** 文件内，调接口页面再进行引入。
2、文件命名，组件后缀都用 **.tsx** ，方法及数据类型定义后缀为 **.ts**
3、组件使用react + ts，props及state都需定义ts数据类型，且避免使用 **any** 类型定义
4、className 语义化，且尽量保证复杂度，避免污染其它样式；若需要修改 antd 样式，定义className，在组件内引用的 css 文件内进行修改，不要污染全局样式
5、已定义的全局变量：

**React** ，组件内无需再引入

`import React from 'react';`

 **_**（lodash库，所有地方可直接调用，如：**_.get('a')**）

 ##  开发规范

### 一、通用书写规范

#### 1.文件/资源命名

在web项目中，使用**连字符**（`-`）来分隔文件名，可以提高可读性。例如：order-detail-view.js 。确保不用大写字母开头，不要驼峰命名。

#### 2.注释

写注释时请一定要注意：写明代码的作用，重要的地方一定记得写注释。 没必要每份代码都描述的很充分，它会增重HTML和CSS的代码。这取决于该项目的复杂程度。

##### 注释原则

- As short as possible（如无必要，勿增注释）：尽量提高代码本身的清晰性、可读性。
- As long as necessary（如有必要，尽量详尽）：合理的注释、空行排版等，可以让代码更易阅读、更具美感。

##### 3.1 单行注释

单行注释以两个斜线开始，以行尾结束

```javascript
 // 调用了一个函数
setTitle();
var maxCount = 10; // 设置最大量
```

##### 3.2 多行注释

```javascript
/*
* 代码执行到这里后会调用setTitle()函数
* setTitle()：设置title的值
*/
```

##### 3.3 函数注释

```javascript
/**
* 以星号开头，紧跟一个空格，第一行为函数说明 
* @param {类型} 参数 单独类型的参数
* @param {[类型|类型|类型]} 参数 多种类型的参数
* @param {类型} [可选参数] 参数 可选参数用[]包起来
* @return {类型} 说明
* @author 作者 创建时间 修改时间（短日期）改别人代码要留名
* @example 举例（如果需要）
*/
```

### 二、JavaScript规范

#### 1.通用约定

##### 命名

**变量**, 使用驼峰命名。

```javascript
let loadingModules = {};
```

**私有属性、变量**和**方法**以下划线 _ 开头。

```javascript
let _privateMethod = {};
```

**通用常量**, 使用全部字母大写。

```javascript
const MAXCOUNT = 10;
```

**boolean** 类型的变量使用 is 或 has 开头。 

```javascript
let isReady = false;
let hasMoreCommands = false;
```

##### && 和 ||

二元布尔操作符是可短路的, 只有在必要时才会计算到最后一项。 例：

```javascript
let kid = node && node.kids && node.kids[index];
let win = opt_win || window;
```

#### 2.函数设计

> 函数设计基本原则：低耦合，高内聚。（假如一个程序有50个函数；一旦你修改其中一个函数，其他49个函数都需要做修改，这就是高耦合的后果。）

##### **一个函数仅完成一件功能**

[建议] 函数的长度应尽量控制。 将过多的逻辑单元混在一个大函数中，易导致难以维护。一个清晰易懂的函数应该完成单一的逻辑单元。复杂的操作应进一步抽取，通过函数的调用来体现流程。 特定算法等不可分割的逻辑允许例外。

##### 函数命名 

- 使用小驼峰命名

- 函数名应准确描述函数的功能，根据上下文使用动宾词组（动词 + 名词）为执行某操作的函数命名。

说明：避免使用单一的动词如`process`、`handle`等为函数命名，因为这些动词并没有说明要具体做什么。

参照如下方式命名函数：`printRecord` 、`inputRecord` 、`deleteRecord` 、`getCurrentColor`。

### 三、React & JSX 规范

#### 1.命名规范

- **组件名称：** 推荐使用 `PascalCase`(帕斯卡拼写法，亦称为大驼峰命名)；
- **属性名称：** React DOM 使用 `CamelCase`(小驼峰命名) 来定义属性的名称，而不使用 HTML 属性名称的命名约定；
- **style样式属性：** 采用小驼峰命名属性的 JavaScript 对象；
- **引用命名：**React组件使用 `PascalCase`，组件实例使用 `CamelCase`。

```jsx
// 组件名称
ReservationCard
// 属性名称
<ReservationCard onClick={this.handler} />
// 样式属性
<ReservationCard style={{ marginBottom: 16 }} />
// 引用命名
import ReservationCard from './ReservationCard';
const reservationItem = <ReservationCard />
```

#### 2.组件规范

- **一个文件声明一个组件：**推荐一个文件声明一个 React 组件，并只导出一个组件（多个函数式组件可以放到一个文件中）；

- **使用 tSX 表达式：**除非是在非 tSX 文件中初始化应用，否则不要使用 `React.createElement` ；

- **函数组件和 class 类组件的使用场景：** 如果定义的组件不需要  state ，建议将组件定义成函数组件并配合 Hooks 来进行开发，否则定义成 class 类组件。

##### 组件的代码顺序

组件应该有严格的代码顺序，这样有利于代码维护，我们推荐每个组件中的代码顺序一致性。

```jsx
export default class MyComponent extends React.Component {
    // 静态属性
    static defaultProps = {}

    // 构造函数
    constructor(props) {
        super(props);
        this.state={}
    }

    // 声明周期钩子函数 -- 按照它们执行的顺序
    componentDidMount() { ... }

    // 事件函数/普通函数
    handleClick = (e) => { ... }

    // 最后，render 方法
    render() { ... }
}
```


#### 3.JSX写法规范

##### 3.1 属性

- 当属性值为true时可以省略， eslint: [react/jsx-boolean-value](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-boolean-value.md)

```jsx
// good
<Foo
  hidden
/>

// good
<Foo hidden />

// bad
<Foo
  hidden={true}
/>
```

#### 4.Hook 书写规范

- 只在 React 函数中调用 Hook，不要在普通的 JavaScript 函数中调用 Hook。
- 只在 React 函数最顶层使用 Hook。

> 不要在循环，条件或嵌套函数中调用 Hook， 确保总是在 React 函数的最顶层以及任何 return 之前调用他们。

```jsx
// good
function a () {
  const [count, setCount] = useState(0)
  const [timer, setTimer] = useState(0)
  useEffect(function persistForm() {
    localStorage.setItem('formData', accountName)
  })
  const x = function () {}
  // main logic
}

// bad
function a () {
  const [count, setCount] = useState(0)
  useEffect(function persistForm() {
    localStorage.setItem('formData', accountName)
  })
  const x = function () {}
  const [timer, setTimer] = useState(0)

  // main logic
}
```

- 自定义 Hook 必须以 `use` 开头。

