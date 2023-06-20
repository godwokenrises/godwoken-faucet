import { asyncSleep } from "../utils";

export async function retry(callback: any, retryTimes = 10) {
  let err;
  for (let i = 0; i < retryTimes; i++) {
    try {
      return await callback();
    } catch (e) {
      err = e;
      await asyncSleep((i + 1) * 1000);
    }
  }
  throw err;
}

export async function requestTo(
  url: string,
  {
    method = "GET",
    tryTimes = 10,
  }: {
    method?: string;
    tryTimes?: number;
  } = {}
) {
  let res: Response | undefined;

  for (let i = 0; i < tryTimes; i++) {
    res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (res.ok) {
      return res.json();
    } else {
      await asyncSleep((i + 1) * 1000);
      continue;
    }
  }

  throw new Error(
    `Request to ${url} failed with status ${res?.status}: ${res?.statusText}`
  );
}
