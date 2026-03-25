---
nav:
  path: /hooks
---

# useLoad

用于处理异步加载请求，支持依赖变化自动触发、首屏加载标记、错误状态和轮询更新。

## 代码演示

### 基础用法

<code src="./demo/demo1.tsx" />

### 依赖字段校验与轮询

<code src="./demo/demo2.tsx" />

## API

```typescript
const [data, { loading, loadedFirst, error }] = useLoad(options, deps);
```

### 参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options.initialValues | 初始数据。 | `U` | - |
| options.fetch | 请求函数，接收依赖数组展开后的参数，并返回 `Promise<R<T>>`。 | `(...deps: D) => Promise<R<T>>` | - |
| options.onError | 请求失败后的回调。 | `(error: any) => void` | - |
| options.transform | 成功后对返回数据进行转换。 | `(data: T) => U` | - |
| options.onLoad | 请求成功后的回调。 | `(data: U) => void` | - |
| options.requiredFields | 当依赖中缺少这些字段对应的有效值时，不触发请求。 | `string[]` | `[]` |
| options.interval | 轮询间隔，单位毫秒。大于 `0` 时会在请求结束后继续轮询。 | `number` | `0` |
| deps | 依赖数组，变化后会重新加载。 | `D` | `[]` |

### 返回值

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| data | 当前数据。 | `U` |
| loading | 是否正在加载。 | `boolean` |
| loadedFirst | 是否至少成功加载过一次。 | `boolean` |
| error | 最近一次错误。 | `Error \| null` |

### R

```typescript
interface R<T = any> {
  code: number;
  msg: string;
  data: T;
}
```

### toR

```typescript
const result = toR({
  code: 200,
  data,
  message: 'ok',
});
```

用于把常见的 `{ code, data, message }` 接口结构转换为 `useLoad` 使用的 `R` 结构。
