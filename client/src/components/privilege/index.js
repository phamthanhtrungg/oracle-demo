/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useEffect } from "react";
import ReactModal from "react-modal";
import { API_ROUTES, getRequest } from "../../api";
import Pagination from "../pagination";
import UserByPriv from "./modal/UserByPriv";

function Privilege() {
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState({ rows: [], size: 10, page: 0 });
  const [selectedPrivilege, setSelectedPrivilege] = useState("");

  const fetchPrivileges = useCallback(async (page = 0) => {
    const res = await getRequest(`${API_ROUTES.PRIVILEGES.ALL}?page=${page}`);
    if (res.success) {
      setData(res.data);
      setIsFetching(false);
    }
  }, []);

  const onSelectPriv = (e, priv) => {
    e.preventDefault();
    setSelectedPrivilege(priv);
  };

  const onClearPriv = useCallback(() => {
    setSelectedPrivilege("");
  });

  useEffect(() => {
    fetchPrivileges();
  }, []);

  if (isFetching) {
    return (
      <p className="text-2xl text-center">Fetching data, please wait...</p>
    );
  }
  return (
    <div>
      <ReactModal
        isOpen={selectedPrivilege !== ""}
        onRequestClose={onClearPriv}
      >
        <UserByPriv priv={selectedPrivilege} />
      </ReactModal>
      <h1 className="text-4xl text-center">Privileges</h1>
      <table className="table border-collapse w-full my-5">
        <thead>
          <tr>
            <th className="border">Privilege</th>
            <th className="border">User in this privilege</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row}>
              <td className="border">{row}</td>
              <td className="border">
                <a
                  href="#"
                  className="text-blue-500 hover:underline text-center block"
                  onClick={(e) => onSelectPriv(e, row)}
                >
                  View users
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        total={data.total}
        size={data.size}
        page={data.page}
        onPageClick={fetchPrivileges}
      />
    </div>
  );
}

export default Privilege;
