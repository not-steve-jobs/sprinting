/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
import {Gauge} from 'k6/metrics';
import {group} from 'k6';
const endTime = new Gauge('test_end_time');
const startTime = new Gauge('test_start_time');

/**
 *
 * @param {Number} tenantId
 * @param {Number[]} applicableForTenants
 * @returns {Object}
 */
export const initSetup = (tenantId, applicableForTenants) => {
  if (applicableForTenants.indexOf(tenantId) === -1) {
    throw new Error(`This test is not applicable for tenant: ${tenantId}`);
  }
  const newDate = new Date();
  group(`Start time: ${newDate}`, () => console.log(`Start time: ${newDate}`));
  group(`Tenant: ${tenantId}`, () => console.log(`Tenant: ${tenantId}`));
  const timestamp = Date.now();
  console.log(timestamp);
  startTime.add(timestamp);
  return {timestamp};
};

export const teardown = () => {
  endTime.add(new Date());
};

