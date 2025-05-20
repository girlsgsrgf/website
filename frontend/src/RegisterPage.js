import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const handleRegister = () => {
    if (!email || !password || password !== confirm) {
      alert("Please check your inputs.");
      return;
    }
    alert(`Registered with: ${email}`);
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Flyup Chain</h2>

      <div className="register-logo-title">
        <img src="/images/wings.png" className="register-wings-img" alt="Wings" />
        <h1 className="register-brand">Fly Up</h1>
        <p className="register-ecosystem">ecosystem</p>
      </div>

      <div className="register-form-box">
        <h3 className="form-title">Register</h3>

        <input
          type="email"
          placeholder="Email"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="eye-button" onClick={togglePassword}>👁</button>
        </div>

        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            className="register-input"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button className="eye-button" onClick={togglePassword}>👁</button>
        </div>

        <p className="register-terms">
          By signing up you submit our terms of use
        </p>

        <button className="register-button" onClick={handleRegister}>
          Register
        </button>

        <p className="login-redirect">Already have an account?</p>
      </div>
    </div>
  );
};

export default RegisterPage;
