# Query

Select all user in oracle:

```sql
SELECT dbau.USERNAME, dbau.ACCOUNT_STATUS, dbau.LOCK_DATE, dbau.CREATED, dbau.DEFAULT_TABLESPACE, dbau.TEMPORARY_TABLESPACE, dbaquota.MAX_BYTES, dbau.PROFILE
FROM DBA_USERS dbau, dba_ts_quotas dbaquota
WHERE dbau.USERNAME = dbaquota.USERNAME
 AND dbau.DEFAULT_TABLESPACE = dbaquota.TABLESPACE_NAME
```

Select current logged in user:

```sql
SELECT * FROM user_users
```

Select granted role of a user:

```sql
SELECT GRANTED_ROLE
FROM DBA_ROLE_PRIVS
WHERE GRANTEE = 'ADMIN';
```

Select granted privilege of a user:

```sql
SELECT PRIVILEGE
FROM DBA_SYS_PRIVS
WHERE GRANTEE = 'ADMIN';
```
