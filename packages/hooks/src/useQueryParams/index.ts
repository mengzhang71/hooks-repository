import { useEffect, useRef, useState } from 'react';

export interface UseQueryParamsOptions<T extends Record<string, any>> {
  defQueryParams: T;
  query?: (params: T, signal?: AbortSignal) => void | Promise<void>;
}

export interface ChangeParams<T extends Record<string, any>> {
  (params: Partial<T>, exec?: boolean): void;
  (key: keyof T, exec?: boolean): (eventOrValue: any) => void;
}

function getValueFromEvent(eventOrValue: any) {
  return eventOrValue?.target?.value ?? eventOrValue;
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null;
}

function isEqualValue(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) {
    return true;
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((item, index) => isEqualValue(item, right[index]));
  }

  if (!isObject(left) || !isObject(right)) {
    return false;
  }

  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key) => isEqualValue(left[key], right[key]));
}

function useQueryParams<T extends Record<string, any>>({
  defQueryParams,
  query,
}: UseQueryParamsOptions<T>) {
  const defaultParamsRef = useRef<T>(defQueryParams);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [queryParams, setQueryParams] = useState<T>(defQueryParams);
  const [execQuery, setExecQuery] = useState(true);

  useEffect(() => {
    if (isEqualValue(defaultParamsRef.current, defQueryParams)) {
      return;
    }

    defaultParamsRef.current = defQueryParams;
    setQueryParams(defQueryParams);
  }, [defQueryParams]);

  useEffect(() => {
    if (!execQuery || !query) {
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    void Promise.resolve(query(queryParams, signal)).catch((error: any) => {
      if (error?.name !== 'AbortError') {
        console.error(error);
      }
    });

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [execQuery, query, queryParams]);

  const changeParams = (params: Partial<T> | keyof T, exec?: boolean) => {
    if (typeof params === 'object' && params !== null) {
      setQueryParams((previous) => ({ ...previous, ...params }));
      setExecQuery(exec ?? true);
      return;
    }

    return (eventOrValue: any) => {
      const value = getValueFromEvent(eventOrValue);
      setQueryParams((previous) => ({ ...previous, [params]: value }));
      setExecQuery(exec ?? false);
    };
  };

  return [queryParams, changeParams as ChangeParams<T>, execQuery] as const;
}

export default useQueryParams;
