import React, { useState } from "react";

interface SignupFormProps {
  onSignup: (username: string, password: string) => void;
}
const SignupForm: React.FC<{ onSignup: (username: string, password: string) => void; onCancel: () => void }> = ({
  onSignup,
  onCancel,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSignup(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button className="custom-btn btn-1" type="submit">Sign Up</button>
      <button className="custom-btn btn-1" type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default SignupForm;
