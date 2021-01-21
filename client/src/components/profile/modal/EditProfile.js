/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { API_ROUTES, getRequest } from "../../../api";

function EditProfile({ row = [], onEditRole }) {
  const profile = row[0];
  const [data, setData] = useState({ rows: [], page: 0, size: 10, total: 0 });
  const [isFetching, setIsFetching] = useState(false);

  const [res, setRes] = useState({ name: "", value: "", numValue: "" });

  const fetchPrivByRole = useCallback(
    async (page = 0) => {
      if (!profile) return;
      setIsFetching(true);
      const res = await getRequest(
        `${API_ROUTES.PROFILES.RES.replace(
          ":profile",
          profile
        )}?page=${page}&size=10000`
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
      <h2 className="text-2xl text-center">Edit {profile}</h2>
      <div>
        <span>
          Select a resource:
          <span>
            <select
              placeholder="Select a resource"
              value={res.name}
              onChange={(e) => {
                if (e.target.value === "") return;
                let row = null;
                for (let i = 0; i < data.rows.length; i++) {
                  for (let j = 0; j < 3; j++) {
                    if (data.rows[i][j] === e.target.value) {
                      row = data.rows[i];
                      break;
                    }
                  }
                }
                console.log(row);
                setRes({
                  name: row[0],
                  value: row[2],
                  numValue: parseInt(row[2]) || 0,
                });
              }}
            >
              <option value="">Select a resource</option>
              {data.rows.map((row, i) => (
                <option key={i} value={row[0]}>
                  {row[0]}
                </option>
              ))}
            </select>
            <span className="ml-5">
              Unlimited:{" "}
              <input
                type="radio"
                value="UNLIMITED"
                name="VAL"
                checked={res.value === "UNLIMITED"}
                onChange={(e) => {
                  setRes((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                }}
              />
            </span>
            <span className="ml-5">
              Default:{" "}
              <input
                type="radio"
                value="DEFAULT"
                checked={res.value === "DEFAULT"}
                name="VAL"
                onChange={(e) => {
                  setRes((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }));
                }}
              />
            </span>
            <span className="ml-5">
              Any:{" "}
              <input
                type="radio"
                value="ANY"
                name="VAL"
                checked={res.value !== "DEFAULT" && res.value !== "UNLIMITED"}
                onChange={(e) => {
                  setRes((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }));
                }}
              />
              {res.value !== "DEFAULT" && res.value !== "UNLIMITED" && (
                <input
                  type="text"
                  className="border rounded ml-2"
                  value={res.numValue}
                  onChange={(e) => {
                    setRes((prev) => ({
                      ...prev,
                      numValue: e.target.value,
                    }));
                  }}
                />
              )}
            </span>
          </span>
        </span>
      </div>

      <button
        className="mx-auto block p-3 bg-green-500 text-white rounded"
        // disabled={hasPwd === true && !pwd}
        // onClick={() => onEditRole(profileName, hasPwd, pwd)}
      >
        Update
      </button>
    </>
  );
}

export default EditProfile;
