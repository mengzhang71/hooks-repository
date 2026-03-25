import { act, renderHook, waitFor } from '@testing-library/react';
import useQueryParams from '../index';

describe('useQueryParams', () => {
  it('initializes with the provided default params', () => {
    const hook = renderHook(() =>
      useQueryParams({
        defQueryParams: {
          keyword: '',
          page: 1,
        },
      })
    );

    expect(hook.result.current[0]).toEqual({
      keyword: '',
      page: 1,
    });
    expect(hook.result.current[2]).toBe(true);
  });

  it('runs query after object updates by default', async () => {
    const query = jest.fn();
    const hook = renderHook(() =>
      useQueryParams({
        defQueryParams: {
          keyword: '',
          page: 1,
        },
        query,
      })
    );

    await waitFor(() => {
      expect(query).toHaveBeenCalledTimes(1);
    });

    act(() => {
      hook.result.current[1]({ keyword: 'pipe' });
    });

    await waitFor(() => {
      expect(query).toHaveBeenCalledTimes(2);
    });

    expect(hook.result.current[0]).toEqual({
      keyword: 'pipe',
      page: 1,
    });
    expect(hook.result.current[2]).toBe(true);
  });

  it('updates from event handlers without executing by default', async () => {
    const query = jest.fn();
    const hook = renderHook(() =>
      useQueryParams({
        defQueryParams: {
          keyword: '',
          page: 1,
        },
        query,
      })
    );

    await waitFor(() => {
      expect(query).toHaveBeenCalledTimes(1);
    });

    act(() => {
      hook.result.current[1]('keyword')({
        target: {
          value: 'valve',
        },
      });
    });

    expect(hook.result.current[0]).toEqual({
      keyword: 'valve',
      page: 1,
    });
    expect(hook.result.current[2]).toBe(false);
    expect(query).toHaveBeenCalledTimes(1);
  });

  it('aborts the previous query before starting the next one', async () => {
    const signals: AbortSignal[] = [];
    const query = jest.fn((_: any, signal?: AbortSignal) => {
      if (signal) {
        signals.push(signal);
      }
    });

    const hook = renderHook(() =>
      useQueryParams({
        defQueryParams: {
          keyword: '',
          page: 1,
        },
        query,
      })
    );

    await waitFor(() => {
      expect(query).toHaveBeenCalledTimes(1);
    });

    act(() => {
      hook.result.current[1]({ page: 2 });
    });

    await waitFor(() => {
      expect(query).toHaveBeenCalledTimes(2);
    });

    expect(signals).toHaveLength(2);
    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });
});
