import React, { useState } from "react";
import Header   from "../componentes/header/header";
import Login    from "../componentes/login/login";
import Register from "../componentes/register/register";

function App(){
  const [view, setView] = useState("login");

  return (
    <div className="app-container">
      {/* Paso por props la función para cambiar a login */}
      <Header
        onRegisterClick={() => setView("register")}
        onLoginClick={()    => setView("login")}
      />

      {view === "login" ? <Login /> : <Register />}
    </div>
  );
}

export default App;
