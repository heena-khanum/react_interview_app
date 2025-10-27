import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { UserContext } from "../../context/userContext";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";

const SignUp = ({ setCurrentPage }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    const userData = { name: fullName, email, profileImageUrl: preview };
    updateUser(userData);
    navigate("/dashboard");
  };

  return (
    <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-black mb-4">Create an Account</h3>

      <ProfilePhotoSelector
        image={profilePic}
        setImage={setProfilePic}
        preview={preview}
        setPreview={setPreview}
      />

      <form onSubmit={handleSignUp} className="flex flex-col gap-3">
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          label="Full Name"
          placeholder="John Doe"
          type="text"
        />
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email Address"
          placeholder="john@example.com"
          type="text"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type="password"
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button type="submit" className="btn-primary mt-3">
          SIGN UP
        </button>
      </form>
      <p className="text-[13px] text-slate-800 mt-3">
        Already have an account?{" "}
        <button
          className="font-medium text-primary underline"
          onClick={() => setCurrentPage("login")}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignUp;
