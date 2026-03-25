import React, { useState } from 'react';
import { useQueryParams } from 'encodeHooks';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [queryParams, changeParams, execQuery] = useQueryParams({
    defQueryParams: {
      keyword: '',
      page: 1,
    },
    query: async (params, signal) => {
      await wait(300);
      if (signal?.aborted) {
        return;
      }

      setLogs((previous) => [`执行查询: 关键字=${params.keyword || '空'}, 页码=${params.page}`]);
    },
  });

  return (
    <div>
      <p>当前参数：{JSON.stringify(queryParams)}</p>
      <p>是否自动查询：{String(execQuery)}</p>
      <p>
        <button type="button" onClick={() => changeParams({ keyword: 'pipe', page: 1 })}>
          查询 pipe
        </button>
        <button
          type="button"
          onClick={() => changeParams({ keyword: 'valve', page: 1 })}
          style={{ margin: '0 8px' }}
        >
          查询 valve
        </button>
        <button type="button" onClick={() => changeParams({ page: queryParams.page + 1 })}>
          下一页
        </button>
      </p>
      <ul>
        {logs.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
