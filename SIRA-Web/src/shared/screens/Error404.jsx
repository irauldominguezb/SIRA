import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/error404.css";

export const Error404 = ({ title, description, btnText }) => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-self-center">
      <div className="notfound mt-5">
        <div className="notfound-404">
          <h1>
            4<span></span>4
          </h1>
        </div>
        <h2>{title ? title : "Oops! Tenemos un problema"}</h2>
        <p>
          {description
            ? description
            : "Pochita comenzó a llorar porque la página que estas buscando no se encuentra en el servidor, mejor regresemos a un lugar más seguro que si exista  :))"}
        </p>
        <Button onClick={() => navigate("reports", { replace: true })} className="bgBtn">
          {btnText ? btnText : "Regresar"}
        </Button>
      </div>
    </div>
  );
};
