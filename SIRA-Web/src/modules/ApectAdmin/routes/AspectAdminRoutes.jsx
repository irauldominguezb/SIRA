import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import { Error404 } from "../../../shared/screens/Error404";
import Profile from "../../../shared/screens/Profile";
import { AspectNavbar } from "../components/AspectNavbar";
import { ReportList } from "../../RootAdmin/Screens/ReportList";
import { useAspectsG } from "../../RootAdmin/customHooks/useAspectsG";
import { Grafics } from "../../RootAdmin/Screens/Grafics";
import { Loading } from "../../../shared/components/LoadingPage";

export const AspectAdminRoutes = ({ user }) => {
  const { getAspectByUserId } = useAspectsG();
  const [aspect, setAspect] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAspectByUserId(setAspect, user.user.id);
    document.title = "Encargado | SIRA";
  }, []);

  console.log(aspect)


  return !aspect ? (
    <Loading isLoading={true} text={"Cargando"} />

  ) : !aspect.name? (
    <None aspect={aspect} user={user} />
    
  ): (
    <Aspect aspect={aspect} user={user} />
  );
};

const Aspect = ({ user, aspect }) => {
  return (
    <>
      <AspectNavbar name={user.user.fullname} rubro={aspect.name} />
      <Container fluid className="mt-4 px-5">
        <Container>
          <Routes>
            <Route path="/*" element={<Navigate to={"/reports"} />} />
            <Route path="profile" element={<Profile user={user.user} />} />
            <Route
              path="reports"
              element={<ReportList id={user.user.id} aspect={aspect} />}
            />
            <Route
              path="grafics"
              element={<Grafics user={user.user} aspect={aspect} />}
            />
          </Routes>
        </Container>
      </Container>
    </>
  );
};

const None = ({ user }) => {
  const [message] = useState({
    title: "Oops! Parece que no tienes un aspecto asignado",
    description: "Para que se te asigne un aspecto acude con un administrador",
    btnText: "Ir a perfil",
  });

  return (
    <>
      <AspectNavbar name={user.user.fullname} rubro={"Ningun aspecto"} />
      <Container fluid className="mt-4 px-5">
        <Container>
          <Routes>
            <Route path="/*" element={<Navigate to={"/reports"} />} />
            <Route path="profile" element={<Profile user={user.user} />} />
            <Route
              path="reports"
              element={
                <Error404
                  title={message.title}
                  description={message.description}
                  btnText={message.btnText}
                />
              }
            />
          </Routes>
        </Container>
      </Container>
    </>
  );
};
