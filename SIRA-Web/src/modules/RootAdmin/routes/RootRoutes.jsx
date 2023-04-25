import React from "react";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";

import Profile from "../../../shared/screens/Profile";
import { RootNavbar } from "../components/RootNavbar";
import { AspectList } from "../Screens/AspectList";
import { Grafics } from "../Screens/Grafics";
import { ReportList } from "../Screens/ReportList";
import { UsersList } from "../Screens/UsersList";
import { useEffect } from "react";

export const RootRoutes = ({ user }) => {
    
    useEffect(() => {document.title = 'Admin | SIRA';}, []);
  return (
    <>
      <RootNavbar name={user.user.fullname} rubro={user.user.role.name} />
      <Container fluid className="mt-4 px-5">
        <Container>
          <Routes>
            <Route path="reports" element={<ReportList user={user}/>} />
            <Route path="aspects" element={<AspectList />} />
            <Route path="users" element={<UsersList user={user.user} />} />
            <Route path="grafic" element={<Grafics  />} />
            <Route path="profile" element={<Profile user={user.user} />} />

            <Route path="/*" element={<Navigate to={"/reports"} />} />
            {/* <Route path='*' element={<Error404 />} /> */}
          </Routes>
        </Container>
      </Container>
    </>
  );
};
