import { useState } from "react";

function CreateRole({ onCreateRole }) {
  const [hasPwd, sethasPwd] = useState(false);
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState("");

  return (
    <>
      <h2 className="text-2xl text-center">Create new role</h2>
      <label className="my-3 block">
        New role name
        <input
          placeholder="New role name"
          className="border ml-5 rounded px-5"
          onChange={(e) => setRole(e.target.value.replace(/\s+/gim, "_"))}
          value={role}
        />
      </label>
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
        disabled={(hasPwd === true && !pwd) || !role}
        onClick={() => onCreateRole(role, hasPwd, pwd)}
      >
        Create
      </button>
    </>
  );
}

export default CreateRole;
