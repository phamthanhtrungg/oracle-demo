import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { API_ROUTES, getRequest } from "../../../api";

function CreateRole({ onCreateUser }) {
  const [data, setData] = useState({ rows: [] });
  const [rols, setRols] = useState({ rows: [] });
  const [profiles, setProfiles] = useState({ rows: [] });
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    onCreateUser(data);
  };
  const fetchTableSpaces = async () => {
    const res = await getRequest(API_ROUTES.TABLE_SPACES);
    setData(res.data);
  };
  const fetchRoles = async () => {
    const res = await getRequest(API_ROUTES.ALL_ROLE);
    setRols(res.data);
  };
  const fetchProfiles = async () => {
    const res = await getRequest(API_ROUTES.ALL_PROFILES);
    setProfiles(res.data);
  };

  useEffect(() => {
    fetchTableSpaces();
    fetchRoles();
    fetchProfiles();
  }, []);

  return (
    <>
      <h2 className="text-2xl text-center">Create new user</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-1/2 mx-auto">
        <input
          name="USERNAME"
          required
          ref={register}
          placeholder="Username"
          className="border p-2 rounded block my-2"
        />
        <input
          name="PASSWORD"
          type="password"
          required
          ref={register}
          placeholder="Password"
          className="border p-2 rounded block my-2"
        />
        <input
          name="QUOTA"
          type="text"
          required
          ref={register}
          placeholder="Quota"
          className="border p-2 rounded block my-2"
        />
        <label>
          Profile:{" "}
          <select
            name="PROFILE"
            ref={register}
            required
            className="border p-2 rounded block my-2"
          >
            {profiles.rows.map((row) => (
              <option value={row}>{row}</option>
            ))}
          </select>
        </label>{" "}
        <label>
          Role:{" "}
          <select
            name="ROLE"
            ref={register}
            required
            className="border p-2 rounded block my-2"
          >
            {rols.rows.map((row) => (
              <option value={row}>{row}</option>
            ))}
          </select>
        </label>{" "}
        <label>
          Account status:{" "}
          <select
            name="ACCOUNT_STATUS"
            ref={register}
            required
            className="border p-2 rounded block my-2"
          >
            <option value="LOCK">LOCK</option>
            <option value="UNLOCK">UNLOCK</option>
          </select>
        </label>
        <label>
          Default table space:{" "}
          <select
            name="DEFAULT_TABLESPACE"
            ref={register}
            required
            className="border p-2 rounded block my-2"
          >
            {data.rows.map((row) => (
              <option value={row}>{row}</option>
            ))}
          </select>
        </label>
        <label>
          Temporary table space:{" "}
          <select
            name="TEMPORARY_TABLESPACE"
            ref={register}
            required
            className="border p-2 rounded block my-2"
          >
            {data.rows.map((row) => (
              <option value={row}>{row}</option>
            ))}
          </select>
        </label>
        <button
          className="mx-auto block p-3 bg-green-500 text-white rounded"
          type="submit"
        >
          Create
        </button>
      </form>
    </>
  );
}

export default CreateRole;
