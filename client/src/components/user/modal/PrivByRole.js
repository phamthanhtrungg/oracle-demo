/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { API_ROUTES, getRequest, postRequest } from "../../../api";
import Pagination from "../../pagination";

function Row({ role, username, fetchPrivByRole }) {
  const [revoking, setRevoking] = useState(false);
  const onRevokeClick = useCallback(async () => {
    setRevoking(true);
    const res = await postRequest(API_ROUTES.PRIVILEGES.REVOKE, {
      role,
      username,
    });
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      fetchPrivByRole();
      NotificationManager.success("Success");
    }
    setRevoking(false);
  }, []);
  return (
    <li key={username} className="flex justify-between">
      <span> {username}</span>
      {/* <span
        className="text-red-500 cursor-pointer hover:underline"
        onClick={onRevokeClick}
      >
        {revoking ? "revoking..." : "Revoke"}
      </span> */}
    </li>
  );
}

function PrivByRole({ role }) {
  const [data, setData] = useState({ rows: [], page: 0, size: 10, total: 0 });
  const [isFetching, setIsFetching] = useState(false);
  const fetchPrivByRole = useCallback(
    async (page = 0) => {
      if (!role) return;
      setIsFetching(true);
      const res = await getRequest(
        `${API_ROUTES.USERS.PRIVS.replace(":user", role)}?page=${page}`
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
    fetchPrivByRole();
    return () => {};
  }, []);

  if (isFetching) {
    return (
      <p className="text-2xl text-center">Fetching data, please wait...</p>
    );
  }

  return (
    <>
      <h2 className="text-2xl text-center">Privileges</h2>
      {data.rows.length > 0 ? (
        <table className="table-auto w-full border-collapse my-3">
          <thead>
            <tr>
              <th className="border">Privilege</th>
              <th className="border">Can assign other this privilege</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr>
                <td className="border">{row[0]}</td>
                <td className="border text-center">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-xl text-center">No privileges in this users</p>
      )}
      <Pagination
        total={data.total}
        page={data.page}
        size={data.size}
        onPageClick={fetchPrivByRole}
      />
    </>
  );
}

export default PrivByRole;
