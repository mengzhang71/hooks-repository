import { message } from 'antd';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface R<T = any> {
  code: number;
  msg: string;
  data: T;
}

export interface UseLoadOptions<T, D extends Array<unknown> = unknown[], U = T> {
  initialValues: U;
  fetch: (...deps: D) => Promise<R<T>>;
  onError?: (error: any) => void;
  transform?: (data: T) => U;
  onLoad?: (data: U) => void;
  requiredFields?: string[];
  interval?: number;
}

type LoadState = {
  loading: boolean;
  loadedFirst: boolean;
  error: Error | null;
};

export type Load = <T, D extends Array<unknown> = unknown[], U = T>(
  options: UseLoadOptions<T, D, U>,
  deps?: D
) => [U, LoadState];

const messageMap: Record<string, string> = {
  '401': '您没有访问权限。',
  '403': '您没有访问当前资源的权限。',
  '404': '请求资源不存在。',
  '500': '服务请求异常。',
  '501': '网络连接异常。',
  '502': '网络连接异常。',
  '503': '网络连接异常。',
  '504': '网络连接超时。',
};

const defaultErrorMessage = '网络请求异常。';

function hasRequiredFieldValues(deps: unknown[], requiredFields: string[]) {
  if (!requiredFields.length) {
    return true;
  }

  return deps.some((item) => {
    if (typeof item === 'object' && item !== null) {
      const objectItem = item as Record<string, any>;
      return requiredFields.some((field) => !isEmpty(objectItem[field]));
    }

    if (typeof item === 'string') {
      return requiredFields.includes(item) && !isEmpty(item);
    }

    return false;
  });
}

function getErrorMessage(error: any) {
  const status = error?.response?.status;
  if (status && messageMap[String(status)]) {
    return messageMap[String(status)];
  }

  if ((error?.message || '').includes('Network Error')) {
    return '网络连接错误。';
  }

  return error?.message || defaultErrorMessage;
}

function useLoad<T, D extends Array<unknown> = unknown[], U = T>(
  options: UseLoadOptions<T, D, U>,
  deps?: D
): [U, LoadState] {
  const { fetch, initialValues, requiredFields = [], onLoad, onError, transform, interval = 0 } = options;
  const finalDeps = deps ?? ([] as unknown as D);
  const depsRef = useRef<unknown[] | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const [data, setData] = useState(initialValues);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadedFirst, setLoadedFirst] = useState(false);

  const clearPollTimer = useCallback(() => {
    if (pollTimerRef.current !== null) {
      window.clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const load = useCallback(() => {
    clearPollTimer();
    setLoading(true);
    setError(null);

    if (!hasRequiredFieldValues(finalDeps, requiredFields)) {
      setLoading(false);
      return;
    }

    void fetch(...finalDeps)
      .then((response) => {
        if (!mountedRef.current) {
          return;
        }

        const { code, data: responseData, msg } = response;
        if ([0, 200].includes(code)) {
          const nextData = transform ? transform(responseData) : (responseData as unknown as typeof initialValues);
          onLoad?.(nextData);
          setData(nextData);
          setLoadedFirst(true);
          return;
        }

        const serviceError = new Error(msg || defaultErrorMessage);
        setError(serviceError);
        onError?.(serviceError);
        message.error(serviceError.message);
        console.error(serviceError);
      })
      .catch((caughtError) => {
        if (!mountedRef.current) {
          return;
        }

        const nextError = caughtError instanceof Error ? caughtError : new Error(getErrorMessage(caughtError));
        const nextMessage = getErrorMessage(caughtError);
        setError(nextError);
        onError?.(caughtError);
        message.error(nextMessage);
        console.error(nextMessage);
      })
      .finally(() => {
        if (!mountedRef.current) {
          return;
        }

        setLoading(false);
        if (interval > 0) {
          pollTimerRef.current = window.setTimeout(load, interval);
        }
      });
  }, [clearPollTimer, fetch, finalDeps, initialValues, interval, onError, onLoad, requiredFields, transform]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearPollTimer();
    };
  }, [clearPollTimer]);

  useEffect(() => {
    if (isEqual(depsRef.current, finalDeps)) {
      return;
    }

    depsRef.current = finalDeps;
    load();
  }, [finalDeps, load]);

  return [data, { loading, error, loadedFirst }];
}

export const toR = (response: { code: number; data: any; message: string }): R => ({
  data: response.data,
  code: response.code === 200 ? 0 : -1,
  msg: response.message,
});

export default useLoad;
