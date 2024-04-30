import {Connection, getConnection} from 'typeorm';

const enum LockType {
  DueEmailNotifications = 10001,
  PendingEmailStatuses = 10002,
  UserInvitationExpired = 10003,
  GeneralReport = 20000,
  NPSReport = 20001,
  CasesReport = 20002,
}

async function getAdvisoryLock(connection: Connection, lockType: LockType): Promise<boolean> {
  const [{pg_try_advisory_lock: lock}] = await connection.query('SELECT pg_try_advisory_lock($1)', [lockType]);
  return lock;
}

async function releaseAdvisoryLock(connection: Connection, lockType: LockType): Promise<void> {
  await connection.query('SELECT pg_advisory_unlock($1)', [lockType]);
}

/**
 * Runs an async function while holding a Postgres advisory lock.
 * This wrapper takes care of attempting to obtain the lock and releasing it automatically after the function `f` runs.
 * This prevents more than one process from running the same function at the same time.
 * If a process fails to obtain the lock, the function will be skipped. No retries will be attempted and no error will be thrown.
 *
 * Note: This function must run in a context where TypeORM is available in order to obtain a database connection.
 *
 * @param lockType An integer key to identify the lock to take. It should be unique by operation. Use the `LockType` enum to keep track of these.
 * @param f Async function to run.
 */
async function runWithAdvisoryLock(lockType: LockType, f: () => Promise<void>) {
  const connection = getConnection();
  if (await getAdvisoryLock(connection, lockType)) {
    try {
      await f();
    } catch (e) {
      throw e;
    } finally {
      await releaseAdvisoryLock(connection, lockType);
    }
  }
}

export {LockType, runWithAdvisoryLock};
