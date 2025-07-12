import { SailhouseClient } from '@sailhouse/client';

export const sailhouseClient = new SailhouseClient(process.env.SAILHOUSE_API_KEY ?? '');
export const SIGNATURE = process.env.SAILHOUSE_SIGNATURE ?? '';
