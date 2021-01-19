/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { API_ROUTES, getRequest } from "../../../api";
import Pagination from "../../pagination";

function UserByPriv({ priv }) {
  const [data, setData] = useState({ rows: [], page: 0, size: 10, total: 0 });
  const [isFetching, setIsFetching] = useState(false);
  const fetchUsersByPriv = useCallback(
    async (page = 0) => {
      if (!priv) return;
      setIsFetching(true);
      const res = await getRequest(
        `${API_ROUTES.PRIVILEGES.USERS.replace(":priv", priv)}?page=${page}`
      );
      if (res.success) {
        setIsFetching(false);
        setData(res.data);
      }
      setIsFetching(false);
    },
    [priv]
  );
  useEffect(() => {
    fetchUsersByPriv();
    return () => {};
  }, []);

  if (isFetching) {
    return (
      <p className="text-2xl text-center">Fetching data, please wait...</p>
    );
  }
  console.log(data);
  return (
    <>
      <h2 className="text-2xl text-center">Users</h2>
      <ul>
        {data.rows.length > 0 ? (
          data.rows.map((row) => (
            <li key={row[0]} className="flex justify-between">
              <span> {row[0]}</span>
              <span className="text-red-500 cursor-pointer hover:underline">
                Revoke
              </span>
            </li>
          ))
        ) : (
          <p className="text-xl center">No users in this privilege</p>
        )}
      </ul>
      <Pagination
        total={data.total}
        page={data.page}
        size={data.size}
        onPageClick={fetchUsersByPriv}
      />
    </>
  );
}

export default UserByPriv;
