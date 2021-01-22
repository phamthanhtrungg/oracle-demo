/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { API_ROUTES, getRequest, postRequest } from "../../../api";
import Pagination from "../../pagination";

function Row({ role, username, fetchUserByRole }) {
  const [revoking, setRevoking] = useState(false);
  const onRevokeClick = useCallback(async () => {
    setRevoking(true);
    const res = await postRequest(API_ROUTES.PRIVILEGES.REVOKE, {
      priv: role,
      username,
    });
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      fetchUserByRole();
      NotificationManager.success("Success");
    }
    setRevoking(false);
  }, []);
  return (
    <li key={username} className="flex justify-between">
      <span> {username}</span>
      <span
        className="text-red-500 cursor-pointer hover:underline"
        onClick={onRevokeClick}
      >
        {revoking ? "revoking..." : "Revoke"}
      </span>
    </li>
  );
}

function UserByRole({ role }) {
  const [data, setData] = useState({ rows: [], page: 0, size: 10, total: 0 });
  const [isFetching, setIsFetching] = useState(false);
  const fetchUserByRole = useCallback(
    async (page = 0) => {
      if (!role) return;
      setIsFetching(true);
      const res = await getRequest(
        `${API_ROUTES.USERS.ROLE.replace(":user", role)}?page=${page}`
      );
      if (res.success) {
        setIsFetching(false);
        setData(res.data);
      }
      setIsFetching(false);
    },
    [role]
  );

  useEffect(() => {
    fetchUserByRole();
    return () => {};
  }, []);

  if (isFetching) {
    return (
      <p className="text-2xl text-center">Fetching data, please wait...</p>
    );
  }

  return (
    <>
      <h2 className="text-2xl text-center">Users</h2>
      <ul>
        {data.rows.length > 0 ? (
          data.rows.map((row) => (
            <Row
              key={row[0]}
              username={row[0]}
              role={role}
              fetchUserByRole={fetchUserByRole}
            />
          ))
        ) : (
          <p className="text-xl center">No users in this role</p>
        )}
      </ul>
      <Pagination
        total={data.total}
        page={data.page}
        size={data.size}
        onPageClick={fetchUserByRole}
      />
    </>
  );
}

export default UserByRole;
