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
import RoleByUser from "./modal/RoleByUser";

function Role() {
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState({ rows: [], size: 10, page: 0 });
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [openCreateRole, setOpenCreateRole] = useState(false);
  const [key, setKey] = useState(0);

  const fetchRoles = useCallback(async (page = 0) => {
    const res = await getRequest(`${API_ROUTES.USERS.ALL}?page=${page}`);
    if (res.success) {
      setData(res.data);
      setIsFetching(false);
    }
  }, []);

  const onDropUser = useCallback(async (user) => {
    if (!window.confirm(`Do you want to delete user ${user}?`)) {
      return;
    }
    const res = await deleteRequest(
      `${API_ROUTES.USERS.DROP.replace(":user", user)}`
    );
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      await fetchRoles();
      NotificationManager.success(`${user} is deleted`);
    }
  });

  const onSelectUser = (e, priv) => {
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

  const onEditUser = useCallback(async (role, hasPwd, pwd) => {
    const res = await putRequest(
      `${API_ROUTES.ROLES.DROP.replace(":role", role)}`,
      { hasPwd, pwd }
    );
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      onCloseEditModal();
      await fetchRoles();
      NotificationManager.success(`${role} is updated`);
    }
  }, []);

  const onCreateUser = useCallback(async (data) => {
    console.log(data);
    const query1 = `CREATE USER ${data.USERNAME} IDENTIFIED BY ${data.PASSWORD} DEFAULT TABLESPACE ${data.DEFAULT_TABLESPACE} QUOTA  ${data.QUOTA} ON ${data.DEFAULT_TABLESPACE} PROFILE ${data.PROFILE} TEMPORARY TABLESPACE ${data.TEMPORARY_TABLESPACE} ACCOUNT  ${data.ACCOUNT_STATUS}`;
    const query2 = `GRANT ${data.ROLE} to ${data.USERNAME}`;
    const res = await postRequest(`${API_ROUTES.USERS.ALL}`, {
      query1,
      query2,
    });
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      setOpenCreateRole(false);
      await fetchRoles();
      NotificationManager.success(`${data.USERNAME} is created`);
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
        <RoleByUser role={selectedRole} />
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
        <EditRole row={selectedRow || []} onEditUser={onEditUser} />
      </ReactModal>
      <ReactModal
        appElement={document.getElementById("root")}
        isOpen={openCreateRole}
        onRequestClose={() => setOpenCreateRole(false)}
      >
        <CreateRole onCreateUser={onCreateUser} />
      </ReactModal>
      <h1 className="text-4xl text-center">Users</h1>
      <button
        className="my-
       p-3 bg-blue-500 text-white rounded"
        onClick={() => setOpenCreateRole(true)}
      >
        Create user
      </button>
      <table className="table border-collapse w-full my-5">
        <thead>
          <tr>
            <th className="border">Username</th>
            <th className="border">Account status</th>
            <th className="border">Lock date</th>
            <th className="border">Created</th>
            <th className="border">Default table space</th>
            <th className="border">Temporary table space</th>
            <th className="border">Profile</th>
            <th className="border">Roles</th>
            <th className="border">Privileges</th>

            <th className="border"></th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row}>
              <td className="border text-center">{row[0]}</td>
              <td className="border text-center">{row[1]}</td>
              <td className="border text-center">
                {row[2] && new Date(row[2]).toLocaleDateString()}
              </td>
              <td className="border text-center">
                {row[3] && new Date(row[3]).toLocaleDateString()}
              </td>
              <td className="border text-center">{row[4]}</td>
              <td className="border text-center">{row[5]}</td>
              <td className="border text-center">{row[6]}</td>
              <td className="border">
                <a
                  href="#"
                  className="text-blue-500 hover:underline text-center block"
                  onClick={(e) => {
                    onSelectUser(e, row[0]);
                    setKey(1);
                  }}
                >
                  View roles
                </a>
              </td>
              <td className="border">
                <a
                  href="#"
                  className="text-blue-500 hover:underline text-center block"
                  onClick={(e) => {
                    onSelectUser(e, row[0]);
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
                    onDropUser(row[0]);
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
