import { useState } from "react";

function CreateRole({ onCreateProfile }) {
  const [profile, setProfile] = useState("");

  return (
    <>
      <h2 className="text-2xl text-center">Create new profile</h2>
      <label className="my-3 block">
        New profile name
        <input
          placeholder="New profile name"
          className="border ml-5 rounded px-5"
          onChange={(e) => setProfile(e.target.value.replace(/\s+/gim, "_"))}
          value={profile}
        />
      </label>
      <button
        className="mx-auto block p-3 bg-green-500 text-white rounded"
        disabled={!profile}
        onClick={() => onCreateProfile(profile)}
      >
        Create
      </button>
    </>
  );
}

export default CreateRole;
