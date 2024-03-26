// LoginForm.js
import React, { useState } from 'react';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <>
    <h1>Login ForgeHabits</h1>
    <form onSubmit={handleSubmit} className="form-class">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-class"
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-class"
        placeholder="Password"
      />
      <button type="submit" className="button-class">Login</button>
    </form>
    </>
    
  );
}

export default LoginForm;
