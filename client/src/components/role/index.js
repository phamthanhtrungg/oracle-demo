/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState, useEffect } from "react";
import ReactModal from "react-modal";
import { NotificationManager } from "react-notifications";
import {
  API_ROUTES,
  deleteRequest,
  getRequest,
  postRequest,
  putRequest,
} from "../../api";
import Pagination from "../pagination";
import CreateRole from "./modal/CreateRole";
import EditRole from "./modal/EditRole";
import PrivByRole from "./modal/PrivByRole";
import UserByRole from "./modal/UserByRole";

function Role() {
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState({ rows: [], size: 10, page: 0 });
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [openCreateRole, setOpenCreateRole] = useState(false);
  const [key, setKey] = useState(0);

  const fetchRoles = useCallback(async (page = 0) => {
    const res = await getRequest(`${API_ROUTES.ROLES.ALL}?page=${page}`);
    if (res.success) {
      setData(res.data);
      setIsFetching(false);
    }
  }, []);

  const onDropRole = useCallback(async (role) => {
    if (!window.confirm(`Do you want to delete role ${role}?`)) {
      return;
    }
    const res = await deleteRequest(
      `${API_ROUTES.ROLES.DROP.replace(":role", role)}`
    );
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      await fetchRoles();
      NotificationManager.success(`${role} is deleted`);
    }
  });

  const onSelectRole = (e, priv) => {
    e.preventDefault();
    setSelectedRole(priv);
  };

  const onClearRoleClick = useCallback(() => {
    setSelectedRole("");
  }, []);

  const onEditRowClick = useCallback((e, row) => {
    e.preventDefault();
    setSelectedRow(row);
  }, []);

  const onCloseEditModal = useCallback(() => {
    setSelectedRow(null);
  }, []);

  const onEditRole = useCallback(async (role, hasPwd, pwd) => {
    const res = await putRequest(
      `${API_ROUTES.ROLES.DROP.replace(":role", role)}`,
      { hasPwd, pwd }
    );
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      onCloseEditModal();
      await fetchRoles();
      NotificationManager.success(`${role} is deleted`);
    }
  }, []);

  const onCreateRole = useCallback(async (role, hasPwd, pwd) => {
    const res = await postRequest(`${API_ROUTES.ROLES.ALL}`, {
      role,
      hasPwd,
      pwd,
    });
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      setOpenCreateRole(false);
      await fetchRoles();
      NotificationManager.success(`${role} is created`);
    }
  }, []);

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
        isOpen={selectedRole !== "" && key === 1}
        onRequestClose={onClearRoleClick}
      >
        <UserByRole role={selectedRole} />
      </ReactModal>
      <ReactModal
        appElement={document.getElementById("root")}
        isOpen={selectedRole !== "" && key === 2}
        onRequestClose={onClearRoleClick}
      >
        <PrivByRole role={selectedRole} />
      </ReactModal>
      <ReactModal
        appElement={document.getElementById("root")}
        isOpen={selectedRow !== null}
        onRequestClose={onCloseEditModal}
      >
        <EditRole row={selectedRow || []} onEditRole={onEditRole} />
      </ReactModal>
      <ReactModal
        appElement={document.getElementById("root")}
        isOpen={openCreateRole}
        onRequestClose={() => setOpenCreateRole(false)}
      >
        <CreateRole onCreateRole={onCreateRole} />
      </ReactModal>
      <h1 className="text-4xl text-center">Roles</h1>
      <button
        className="my-
       p-3 bg-blue-500 text-white rounded"
        onClick={() => setOpenCreateRole(true)}
      >
        Create role
      </button>
      <table className="table border-collapse w-full my-5">
        <thead>
          <tr>
            <th className="border">Roles</th>
            <th className="border">Password required</th>
            <th className="border">User in this role</th>
            <th className="border">Privilege of this role</th>
            <th className="border"></th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row}>
              <td className="border text-center">{row[0]}</td>
              <td className="border text-center">{row[1]}</td>
              <td className="border">
                <a
                  href="#"
                  className="text-blue-500 hover:underline text-center block"
                  onClick={(e) => {
                    onSelectRole(e, row[0]);
                    setKey(1);
                  }}
                >
                  View users
                </a>
              </td>
              <td className="border">
                <a
                  href="#"
                  className="text-blue-500 hover:underline text-center block"
                  onClick={(e) => {
                    onSelectRole(e, row[0]);
                    setKey(2);
                  }}
                >
                  View privileges
                </a>
              </td>
              <td className="border">
                <a
                  href="#"
                  className="text-blue-500 hover:underline text-center block"
                  onClick={(e) => {
                    onEditRowClick(e, row);
                  }}
                >
                  Edit
                </a>
                <a
                  href="#"
                  className="text-red-500 hover:underline text-center block"
                  onClick={(e) => {
                    onDropRole(row[0]);
                  }}
                >
                  Remove
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
