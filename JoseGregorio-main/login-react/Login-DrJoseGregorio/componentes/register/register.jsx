    import "./register.css";
    import { useState } from "react";

    const Register = () =>{

        const [userUsario, setUserUsario] = useState ("");
        const [userName, setUserName] = useState("");
        const [password, setPassword] = useState("");
        const [dataSend, setDataSend] = useState(false);

        const inputHandlers = {
        User:     setUserUsario,
        mail:     setUserName,
        password: setPassword
}

        const handleInputChange = (event) =>{
            const {name, value} = event.target;
            const handler = inputHandlers[name];
        if (handler){
            handler(value);
        }
        }

        const handleDataSend = (event) => {
            event.preventDefault();
            console.log(userUsario);
            console.log(userName);
            console.log(password);
            setDataSend(true);
        }

        const errorUsuario = ((userUsario === "" || !userUsario.includes("")) && dataSend);
        const errorMail = ((userName === "" || !userName.includes("@")) && dataSend);
        const errorPass = ((password === "" || password.length < 6) && dataSend);
        return (
            <div className="login-form-container">
            <form className="login-form">
                <h1>Registrate</h1>
                <input type="text" name="User" placeholder="Nombre" className={`input-field ${errorUsuario ? "input-field-error" : ""}`} onChange={(event) => handleInputChange(event)} />
                <input type="text" name="mail" placeholder="Usuario" className={`input-field ${errorMail ? "input-field-error" : ""}`} onChange={(event) => handleInputChange(event)} />
                <input type="password" name="password" placeholder="Contraseña" className={`input-field ${errorPass ? "input-field-error" : ""}`} onChange={(event) => handleInputChange(event)}/>
                <button type="submit" className="submit-button" onClick={(event)=>handleDataSend(event)}>Registro</button>
            </form>
        </div>
        );
        
    }

    export default Register;