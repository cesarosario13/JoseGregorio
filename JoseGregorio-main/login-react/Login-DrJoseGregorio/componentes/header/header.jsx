// src/components/header/header.jsx
import React from "react";
import "./header.css";
import logo from "../../assets/Imagen1.png";

const Header = ({ onRegisterClick, onLoginClick }) => {
return (
    <header className="header">
    <img src={logo} alt="logo" />

    <div className="header-buttons">
        <button
        className="registro-btn"
        onClick={onRegisterClick}
        >
        Registro
        </button>

        {/* Solo cuando estés en “register” (es decir, 
            onLoginClick esté definido y quieras volver) */}
        {onLoginClick && (
        <button
            className="registro-btn"
            onClick={onLoginClick}
        >
            Login
        </button>
        )}
    </div>
    </header>
);
};

export default Header;
