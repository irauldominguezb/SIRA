import { Container } from 'react-bootstrap'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginScreen } from '../../auth/LoginScreeen'

export const PublicRoutes = () => {

    return (
        <>
            {/* <PublicNavbar/> */}
            <Container fluid className='mt-4 px-5'>
                <Routes>
                    <Route path='/login' element={<LoginScreen/>} />
                    <Route path="*" element={<Navigate to={"/login"}/>} />
                </Routes>
            </Container>
        </>
    )
}
