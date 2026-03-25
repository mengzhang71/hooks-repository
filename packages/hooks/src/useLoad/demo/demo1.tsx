import React, { useState } from 'react';
import { useLoad } from 'encodeHooks';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default () => {
  const [keyword, setKeyword] = useState('管网');

  const [data, { loading, loadedFirst, error }] = useLoad(
    {
      initialValues: [] as string[],
      fetch: async (nextKeyword: string) => {
        await wait(500);
        return {
          code: 0,
          msg: 'ok',
          data: [`${nextKeyword}-结果1`, `${nextKeyword}-结果2`, `${nextKeyword}-结果3`],
        };
      },
    },
    [keyword]
  );

  return (
    <div>
      <p>
        <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="请输入关键字" />
      </p>
      <p>加载中：{String(loading)}</p>
      <p>是否成功加载过：{String(loadedFirst)}</p>
      <p>错误信息：{error?.message || '无'}</p>
      <ul>
        {data.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
