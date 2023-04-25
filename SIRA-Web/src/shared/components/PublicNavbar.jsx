import { Image } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import '../../shared/custom-styles.css';

import logo from '../../assets/sheet.png';

function PublicNavbar({back}) {
  return (
    <Navbar className='bgNav' expand='lg' variant='dark'>
      <Container fluid>
        <Link href='#' className='nav-link navbar-brand'><Image src={logo} alt='' width={70 } height={40 } />SIRA</Link>
        <Navbar.Toggle aria-controls='navbarScroll' />
        <Navbar.Collapse id='navbarScroll'>
          <Nav
            className='me-auto my-2 my-lg-0'
            style={{ maxHeight: '100px' }}
            navbarScroll>
            {/* <Link  to='/report' className='ms-1 nav-link active'>REPORTES</Link> */}            
          </Nav>
          {back ? ( <Link to={'/login'} className='btn bgBtnLogin' >REGRESAR</Link>) : ( <Link to={'/report'} className='btn bgBtnLogin' >GENERAR REPORTE</Link>)}
         
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default PublicNavbar;