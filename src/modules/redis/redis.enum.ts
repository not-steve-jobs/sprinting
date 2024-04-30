export enum RedisKeysEnum {
  Candidate = 'candidate',
  TenantUser = 'tenantUser',
}

export enum RedisExpirationTime { // in seconds
  OneDay = 60 * 60 * 24, // 24h
  Candidate = 60 * 60 * 3, // 3h
  OneMinute = 60,
  TenSeconds = 10,
}

export enum RedisExpirationMillisecondsTime { // in milliseconds
  FIVE_MINUTES = 5 * 60 * 1000, // 5 min
}
