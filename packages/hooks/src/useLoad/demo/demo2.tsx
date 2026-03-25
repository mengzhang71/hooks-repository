import React, { useState } from 'react';
import { useLoad } from 'encodeHooks';

export default () => {
  const [filters, setFilters] = useState({
    projectId: '',
  });

  const [data, { loading, loadedFirst }] = useLoad(
    {
      initialValues: {
        list: [] as string[],
        updatedAt: '',
      },
      requiredFields: ['projectId'],
      interval: 2000,
      fetch: async (currentFilters: typeof filters) => ({
        code: 0,
        msg: 'ok',
        data: {
          list: [`项目 ${currentFilters.projectId}`, '轮询已开启'],
          updatedAt: new Date().toLocaleTimeString(),
        },
      }),
    },
    [filters]
  );

  return (
    <div>
      <p>
        <input
          value={filters.projectId}
          onChange={(event) => setFilters({ projectId: event.target.value })}
          placeholder="请输入项目 ID"
        />
      </p>
      <p>加载中：{String(loading)}</p>
      <p>是否成功加载过：{String(loadedFirst)}</p>
      <p>最近更新时间：{data.updatedAt || '暂无'}</p>
      <ul>
        {data.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
