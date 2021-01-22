import { useState } from "react";

function EditRole({ row = [], onEditRole }) {
  const rolename = row[0];

  const [hasPwd, sethasPwd] = useState(row[1] === "YES");
  const [pwd, setPwd] = useState("");

  return (
    <>
      <h2 className="text-2xl text-center">Edit {rolename}</h2>
      <label>
        <span>
          Does this role has password?
          <span className="ml-5">
            <label className="mr-5">
              No
              <input
                type="radio"
                checked={hasPwd === false}
                name="hasPwd"
                value="NO"
                onChange={() => {
                  sethasPwd(false);
                  setPwd("");
                }}
              />
            </label>
            <label>
              Yes
              <input
                type="radio"
                checked={hasPwd === true}
                name="hasPwd"
                value="YES"
                onChange={() => {
                  sethasPwd(true);
                }}
              />
            </label>
          </span>
        </span>
      </label>
      {hasPwd && (
        <label className="block mt-3">
          Enter new password?
          <input
            type="password"
            placeholder="Enter new password"
            className="border ml-5 rounded px-5"
            onChange={(e) => setPwd(e.target.value)}
          />
        </label>
      )}
      <button
        className="mx-auto block p-3 bg-green-500 text-white rounded"
        disabled={hasPwd === true && !pwd}
        onClick={() => onEditRole(rolename, hasPwd, pwd)}
      >
        Update
      </button>
    </>
  );
}

export default EditRole;
