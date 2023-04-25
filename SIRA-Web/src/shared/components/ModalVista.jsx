import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';

export const ModalVista = () => {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false} >
                <Modal.Header closeButton>
                    <Modal.Title>Aviso Importante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>
                        Instrucciones:
                    </h5>
                    <ol>
                        <li>Ingresar específicamente lo que se pide.</li>
                        <li>En caso de subir una imagen, que sea lo más clara posible.</li>
                        <li>Describir la ubicación detalladamente.</li>
                        <li>Asegúrate de colocar correctamente el marcador de ubicación.</li>
                        <li>Escoge el aspecto ambiental más adecuado para el reporte.</li>
                    </ol>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={handleClose}>Entiendo</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
