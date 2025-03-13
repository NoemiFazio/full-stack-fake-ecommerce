//* This cache functions is a helper function that emulates the one build in next, used in order to awoid the double import below

//* Based on this article: https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbVo2TGs2VGxYYWRkLS01UGJFUmxIZ3pfYnJSQXxBQ3Jtc0tuRW9KYWdXMmsycUM2YmhTLUdtb1BTZXNaSXd2OUpNUFIwZVprMkhDeDNKWnlGT1dMX2pJVGJxSUt4UDlENDJTRnRNU2hqR1R2aUhaQnBad3RqanBSMTY4ZmVmQ3FINnJsSnpYMEZ5cDV5N01McnE2NA&q=https%3A%2F%2Fblog.webdevsimplified.com%2F2024-01%2Fnext-js-app-router-cache&v=iqrgggs0Qk0
//* this cache for from next is for dealing with data cache and everything else built into nextjs
import { unstable_cache as nextCache } from "next/cache";
//* this cache from react is for request memorization
import { cache as reactCache } from "react";

type Callback = (...args: any[]) => Promise<any>;

export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
  return nextCache(reactCache(cb), keyParts, options);
}
