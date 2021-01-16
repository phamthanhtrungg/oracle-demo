# Query

Select all user in oracle:
`SELECT dbau.USERNAME, dbau.ACCOUNT_STATUS, dbau.LOCK_DATE, dbau.CREATED, dbau.DEFAULT_TABLESPACE, dbau.TEMPORARY_TABLESPACE, dbaquota.MAX_BYTES, dbau.PROFILE FROM DBA_USERS dbau, dba_ts_quotas dbaquota WHERE dbau.USERNAME = dbaquota.USERNAME AND dbau.DEFAULT_TABLESPACE = dbaquota.TABLESPACE_NAME`
