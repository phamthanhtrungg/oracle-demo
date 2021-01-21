/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { API_ROUTES, getRequest, postRequest } from "../../../api";
import Pagination from "../../pagination";

function Row({ profile, username, fetchPrivByRole }) {
  const [revoking, setRevoking] = useState(false);
  const onRevokeClick = useCallback(async () => {
    setRevoking(true);
    const res = await postRequest(API_ROUTES.PRIVILEGES.REVOKE, {
      profile,
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

function PrivByRole({ profile }) {
  const [data, setData] = useState({ rows: [], page: 0, size: 10, total: 0 });
  const [isFetching, setIsFetching] = useState(false);
  const fetchPrivByRole = useCallback(
    async (page = 0) => {
      if (!profile) return;
      setIsFetching(true);
      const res = await getRequest(
        `${API_ROUTES.PROFILES.RES.replace(":profile", profile)}?page=${page}`
      );
      if (res.success) {
        setIsFetching(false);
        setData(res.data);
      }
      setIsFetching(false);
    },
    [profile]
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
      <h2 className="text-2xl text-center">Resources</h2>

      {data.rows.length > 0 ? (
        <table className="table-auto border-collapse w-full my-5">
          <thead>
            <tr>
              <th className="border">Name</th>
              <th className="border">Type</th>
              <th className="border">Limit</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row[0]}>
                <td className="border">{row[0]}</td>
                <td className="border text-center">{row[1]}</td>
                <td className="border text-center">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-xl center">No resources in this profile</p>
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
