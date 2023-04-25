import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../modules/auth/authContext';
import { PublicRoutes } from '../../modules/report/routes/PublicRoutes';
import { AspectAdminRoutes } from '../../modules/ApectAdmin/routes/AspectAdminRoutes';
import { RootRoutes } from '../../modules/RootAdmin/routes/RootRoutes';
import { GenerateReportScreen } from '../../modules/report/GenerateReportScreen';


export const AppRouter = () => {
  const { user } = useContext(AuthContext);
  
  const validate = () => {
    if (user.user.role.name === 'Administrador') {
      return <RootRoutes user={user}/>
    }else if (user.user.role.name === 'Encargado'){
      return <AspectAdminRoutes user={user}/>
    }else{
      return <PublicRoutes/>
    }
  }
  
  return (
    <Router>
      <Routes>
        <Route path='/report' element={<GenerateReportScreen/>} />
        <Route path='/*' element={
          user.isLogged ? (
            validate()
          ) : (
            <PublicRoutes/>
          )
        } />
      </Routes>
    </Router>
  );
};
