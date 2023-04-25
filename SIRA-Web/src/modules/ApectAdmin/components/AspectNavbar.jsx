import React from 'react'
import { useContext } from 'react';
import Avatar from 'react-avatar';
import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../../assets/sheet.png';
import { AuthContext } from '../../../modules/auth/authContext';
import { splitName } from '../../../utils/functions';


export const AspectNavbar = ({ name = 'Anonimo', rubro = '....' }) => {

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
        navigate('/auth', { replace: true });
    }

    const goProfile = () => {
        navigate('/profile', { replace: true });
    }

    const nameAvatar = () => {
        const names = splitName(name)
        return `${names.name}`;
    }


    return (
        <Navbar className='bgNav ' expand='lg' variant='dark'>
            <Container fluid className='px-4'>

                <Navbar.Brand className='nav-link navbar-brand'>
                    <NavLink className='nav-item nav-link'>
                        <Image src={logo} alt='' width={70} height={40} />SIRA
                    </NavLink>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls='navbarScroll' />

                <Navbar.Collapse id='navbarScroll'>

                    <Nav className='my-2  my-lg-0' style={{ maxHeight: '120px' }} navbarScroll >
                        <NavLink className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`} to='/reports'  >Reportes</NavLink>
                        <NavLink className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`} to='/grafics'  >
                            Estadística</NavLink>
                    </Nav>

                    <Container fluid className='d-flex justify-content-end mx-lg-3'>
                        <span className='d-flex'>
                            <div >
                                <div className='text-end'>
                                    <p className='m-0 p-0 pe-4 text-white'><b>Encargado: </b>{rubro}</p>
                                    <NavDropdown title={name} id='basic-nav-dropdown' className='text-white me-4' align={{ lg: 'end' }}>
                                        <NavDropdown.Item onClick={goProfile} >
                                            Perfil
                                        </NavDropdown.Item>

                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout} >
                                            Cerrar Sesión
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </div>
                            </div>
                            <Avatar name={nameAvatar()} size='45' round />
                        </span>
                    </Container>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
