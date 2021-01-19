/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useEffect } from "react";
import ReactModal from "react-modal";
import { API_ROUTES, getRequest } from "../../api";
import Pagination from "../pagination";
import UserByRole from "./modal/UserByRole";

function Role() {
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState({ rows: [], size: 10, page: 0 });
  const [selectedRole, setSelectedRole] = useState("");

  const fetchRoles = useCallback(async (page = 0) => {
    const res = await getRequest(`${API_ROUTES.ROLES.ALL}?page=${page}`);
    if (res.success) {
      setData(res.data);
      setIsFetching(false);
    }
  }, []);

  const onSelectRole = (e, priv) => {
    e.preventDefault();
    setSelectedRole(priv);
  };

  const onClearRoleClick = useCallback(() => {
    setSelectedRole("");
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  if (isFetching) {
    return (
      <p className="text-2xl text-center">Fetching data, please wait...</p>
    );
  }
  return (
    <>
      <ReactModal
        appElement={document.getElementById("root")}
        isOpen={selectedRole !== ""}
        onRequestClose={onClearRoleClick}
      >
        <UserByRole role={selectedRole} />
      </ReactModal>
      <h1 className="text-4xl text-center">Roles</h1>
      <table className="table border-collapse w-full my-5">
        <thead>
          <tr>
            <th className="border">Roles</th>
            <th className="border">User in this role</th>
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
                  onClick={(e) => onSelectRole(e, row)}
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
        onPageClick={fetchRoles}
      />
    </>
  );
}

export default Role;
