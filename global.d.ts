import * as Common from './lib/common';
import * as Config from './config';

declare global {
  const console: Console;
  const common: typeof Common;
  const config: typeof Config;
  namespace db {}
}
