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
import CreateProfile from "./modal/CreateProfile";
import EditProfile from "./modal/EditProfile";
import ResourceByProfile from "./modal/ResourceByProfile";
import UserByProfile from "./modal/UserByProfile";

function Profile() {
  const [isFetching, setIsFetching] = useState(true);
  const [data, setData] = useState({ rows: [], size: 10, page: 0 });
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [openCreateRole, setOpenCreateRole] = useState(false);
  const [key, setKey] = useState(0);

  const fetchProfiles = useCallback(async (page = 0) => {
    const res = await getRequest(`${API_ROUTES.PROFILES.ALL}?page=${page}`);
    if (res.success) {
      setData(res.data);
      setIsFetching(false);
    }
  }, []);

  const onDropProfile = useCallback(async (profile) => {
    if (!window.confirm(`Do you want to delete profile ${profile}?`)) {
      return;
    }
    const res = await deleteRequest(
      `${API_ROUTES.PROFILES.DROP.replace(":profile", profile)}`
    );
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      await fetchProfiles();
      NotificationManager.success(`${profile} is deleted`);
    }
  });

  const onSelectProfile = (e, profile) => {
    e.preventDefault();
    setSelectedProfile(profile);
  };

  const onClearRoleClick = useCallback(() => {
    setSelectedProfile("");
  }, []);

  const onEditRowClick = useCallback((e, row) => {
    e.preventDefault();
    setSelectedRow(row);
  }, []);

  const onCloseEditModal = useCallback(() => {
    setSelectedRow(null);
  }, []);

  const onEditProfile = useCallback(async (profile, name, value, numValue) => {
    const res = await putRequest(
      `${API_ROUTES.PROFILES.RES.replace(":profile", profile)}`,
      { name, value, numValue }
    );
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      onCloseEditModal();
      await fetchProfiles();
      NotificationManager.success(`${profile} is updated`);
    }
  }, []);

  const onCreateProfile = useCallback(async (profile) => {
    const res = await postRequest(`${API_ROUTES.PROFILES.ALL}`, {
      profile,
    });
    if (!res.success) {
      NotificationManager.error(res.message);
    } else {
      setOpenCreateRole(false);
      await fetchProfiles();
      NotificationManager.success(`${profile} is created`);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
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
        isOpen={selectedProfile !== "" && key === 1}
        onRequestClose={onClearRoleClick}
      >
        <UserByProfile profile={selectedProfile} />
      </ReactModal>
      <ReactModal
        appElement={document.getElementById("root")}
        isOpen={selectedProfile !== "" && key === 2}
        onRequestClose={onClearRoleClick}
      >
        <ResourceByProfile profile={selectedProfile} onE />
      </ReactModal>
      <ReactModal
        appElement={document.getElementById("root")}
        isOpen={selectedRow !== null}
        onRequestClose={onCloseEditModal}
      >
        <EditProfile row={selectedRow || []} onEditProfile={onEditProfile} />
      </ReactModal>
      <ReactModal
        appElement={document.getElementById("root")}
        isOpen={openCreateRole}
        onRequestClose={() => setOpenCreateRole(false)}
      >
        <CreateProfile onCreateProfile={onCreateProfile} />
      </ReactModal>
      <h1 className="text-4xl text-center">Profiles</h1>
      <button
        className="my-
       p-3 bg-blue-500 text-white rounded"
        onClick={() => setOpenCreateRole(true)}
      >
        Create profile
      </button>
      <table className="table border-collapse w-full my-5">
        <thead>
          <tr>
            <th className="border">Profiles</th>
            <th className="border">User in this profile</th>
            <th className="border">Resource of this profile</th>
            <th className="border"></th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row}>
              <td className="border text-center">{row[0]}</td>
              <td className="border">
                <a
                  href="#"
                  className="text-blue-500 hover:underline text-center block"
                  onClick={(e) => {
                    onSelectProfile(e, row[0]);
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
                    onSelectProfile(e, row[0]);
                    setKey(2);
                  }}
                >
                  View resources
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
                    onDropProfile(row[0]);
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
        onPageClick={fetchProfiles}
      />
    </>
  );
}

export default Profile;
