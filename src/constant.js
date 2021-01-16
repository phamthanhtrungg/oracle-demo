const USERS_TABLE_HEADER = [
  "Username",
  "Account Status",
  "Lock Date",
  "Create Date",
  "Default TableSpace",
  "Temporary TableSpace",
  "Quota(bytes)",
  "Profile",
  "Role",
  "Privilege",
  "Actions",
];

const GET_USERS_QUERY = `SELECT dbau.USERNAME, dbau.ACCOUNT_STATUS, dbau.LOCK_DATE, dbau.CREATED, dbau.DEFAULT_TABLESPACE, dbau.TEMPORARY_TABLESPACE, dbaquota.MAX_BYTES, dbau.PROFILE
FROM DBA_USERS dbau, dba_ts_quotas dbaquota
WHERE dbau.USERNAME = dbaquota.USERNAME 
AND dbau.DEFAULT_TABLESPACE = dbaquota.TABLESPACE_NAME 
  `;

const GET_CURRENT_USER_QUERY = "SELECT * FROM user_users";

export { USERS_TABLE_HEADER, GET_USERS_QUERY, GET_CURRENT_USER_QUERY };
