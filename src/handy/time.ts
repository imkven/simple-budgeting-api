import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function now() {
  return date();
}

export function date(date?: dayjs.ConfigType) {
  return dayjs(date).utc(false);
}

// Timestamp in seconds
export function ts(timestamp: number) {
  return dayjs.unix(timestamp).utc(false);
}
