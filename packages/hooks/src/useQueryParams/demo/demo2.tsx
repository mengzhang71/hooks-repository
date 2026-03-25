import React, { useState } from 'react';
import { useQueryParams } from 'encodeHooks';

export default () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [queryParams, changeParams, execQuery] = useQueryParams({
    defQueryParams: {
      keyword: '',
      status: 'all',
    },
    query: async (params) => {
      setLogs((previous) =>
        [`提交查询: 关键字=${params.keyword || '空'}, 状态=${params.status}`, ...previous].slice(0, 5)
      );
    },
  });

  return (
    <div>
      <p>
        <input
          value={queryParams.keyword}
          onChange={changeParams('keyword')}
          placeholder="请输入关键字"
          style={{ width: 220, marginRight: 8 }}
        />
        <select value={queryParams.status} onChange={changeParams('status')}>
          <option value="all">全部</option>
          <option value="online">在线</option>
          <option value="offline">离线</option>
        </select>
      </p>
      <p>输入后是否自动查询：{String(execQuery)}</p>
      <p>
        <button type="button" onClick={() => changeParams({}, true)}>
          执行查询
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
