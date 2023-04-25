import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import React from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

export function AlertSmall({ showAlert, setShowAlert, title = 'Error en la acción', description = 'Revise los datos' }) {

    return (
        <>
            <ToastContainer className="p-3" position={'top-end'} >
                <Toast onClose={() => setShowAlert(false)} show={showAlert} delay={5000} autohide bg='danger'>
                    <Toast.Header closeButton >
                        <FeatherIcon icon={'alert-circle'} className='text-danger' /> &nbsp; &nbsp;
                        <strong className="me-auto text-dark">{title}</strong>
                    </Toast.Header>
                    <Toast.Body  className='ps-4 text-white' > {description}</Toast.Body>
                </Toast>
            </ToastContainer>

        </>
    );
}
