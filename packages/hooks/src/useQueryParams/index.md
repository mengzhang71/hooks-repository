---
nav:
  path: /hooks
---

# useQueryParams

用于统一管理查询参数，支持按需自动触发查询，并在重复请求时取消上一次请求。

## 代码演示

### 对象更新后自动查询

<code src="./demo/demo1.tsx" />

### 表单输入后手动查询

<code src="./demo/demo2.tsx" />

## API

```typescript
const [queryParams, changeParams, execQuery] = useQueryParams({
  defQueryParams,
  query,
});
```

### 参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| defQueryParams | 查询参数初始值。该对象发生深度变化时，内部状态会重置。 | `T` | - |
| query | 可选的查询函数。当 `execQuery` 为 `true` 时执行，并接收最新参数及 `AbortSignal`。 | `(params: T, signal?: AbortSignal) => void \| Promise<void>` | - |

### 返回值

| 参数 | 说明 | 类型 |
| --- | --- | --- |
| queryParams | 当前查询参数对象。 | `T` |
| changeParams | 参数更新方法。可传局部对象，或传字段名后返回事件处理函数。 | `ChangeParams<T>` |
| execQuery | 当前这次参数变更是否会触发 `query`。 | `boolean` |

### ChangeParams

```typescript
changeParams(partialParams, exec?)
changeParams(key, exec?)(eventOrValue)
```

传入对象时，`exec` 默认是 `true`。

传入字段名时，`exec` 默认是 `false`，适合表单输入后等待用户手动点击查询。
