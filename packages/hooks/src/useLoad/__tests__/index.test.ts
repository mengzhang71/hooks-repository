import { act, renderHook, waitFor } from '@testing-library/react';
import { message } from 'antd';
import useLoad, { toR } from '../index';

jest.mock('antd', () => ({
  message: {
    error: jest.fn(),
  },
}));

describe('useLoad', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    jest.useRealTimers();
  });

  it('returns initial values before request resolves', () => {
    const pending = new Promise(() => undefined);
    const hook = renderHook(() =>
      useLoad(
        {
          initialValues: [] as string[],
          fetch: () => pending as Promise<any>,
        },
        []
      )
    );

    expect(hook.result.current[0]).toEqual([]);
    expect(hook.result.current[1].loading).toBe(true);
    expect(hook.result.current[1].loadedFirst).toBe(false);
  });

  it('loads data successfully when deps change', async () => {
    const fetch = jest.fn(async (keyword: string) => ({
      code: 0,
      msg: 'ok',
      data: [keyword],
    }));

    const hook = renderHook(({ keyword }) =>
      useLoad(
        {
          initialValues: [] as string[],
          fetch,
        },
        [keyword]
      ), {
        initialProps: {
          keyword: 'pipe',
        },
      }
    );

    await waitFor(() => {
      expect(hook.result.current[1].loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledWith('pipe');
    expect(hook.result.current[0]).toEqual(['pipe']);
    expect(hook.result.current[1].loadedFirst).toBe(true);

    hook.rerender({
      keyword: 'valve',
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('valve');
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('skips request when required fields are empty', async () => {
    const fetch = jest.fn();

    const hook = renderHook(() =>
      useLoad(
        {
          initialValues: { list: [] as string[] },
          requiredFields: ['projectId'],
          fetch,
        },
        [{ projectId: '' }]
      )
    );

    await waitFor(() => {
      expect(hook.result.current[1].loading).toBe(false);
    });

    expect(fetch).not.toHaveBeenCalled();
    expect(hook.result.current[0]).toEqual({ list: [] });
  });

  it('stores error state when request fails', async () => {
    const error = new Error('boom');
    const onError = jest.fn();
    const fetch = jest.fn(async () => {
      throw error;
    });

    const hook = renderHook(() =>
      useLoad(
        {
          initialValues: [] as string[],
          fetch,
          onError,
        },
        []
      )
    );

    await waitFor(() => {
      expect(hook.result.current[1].error).toBe(error);
    });

    expect(onError).toHaveBeenCalledWith(error);
    expect(message.error).toHaveBeenCalledWith('boom');
    expect(hook.result.current[1].loading).toBe(false);
  });

  it('continues polling when interval is set and clears on unmount', async () => {
    jest.useFakeTimers();

    const fetch = jest.fn(async () => ({
      code: 0,
      msg: 'ok',
      data: ['poll'],
    }));

    const hook = renderHook(() =>
      useLoad(
        {
          initialValues: [] as string[],
          fetch,
          interval: 1000,
        },
        []
      )
    );

    await waitFor(() => {
      expect(hook.result.current[1].loading).toBe(false);
    });

    expect(fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });

    hook.unmount();
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('converts common response shape with toR', () => {
    expect(
      toR({
        code: 200,
        data: { id: 1 },
        message: 'ok',
      })
    ).toEqual({
      code: 0,
      data: { id: 1 },
      msg: 'ok',
    });
  });
});
