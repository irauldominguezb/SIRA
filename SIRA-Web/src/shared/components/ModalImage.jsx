import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import { Button, Form, Image, Modal } from 'react-bootstrap';
import default_image from '../../assets/default_image.png'
import '../styles/inputs.css'
import { AlertSmall } from './AlertSmall';
import { useState } from 'react';

export const ModalImage = ({ isShow, setIsShow, setImage, preImage, setPreImage, review = false }) => {

    const [showAlert, setShowAlert] = useState(false)

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            if (["image/jpeg", "image/png"].includes(event.target.files[0].type)) {
                setPreImage(event.target.files[0]);
            } else {
                setShowAlert(true)
                event.target.files[0] = ''
            }
        }
    }

    //validate
    const lookImage = () => {
        if (!review) {
            return preImage ? URL.createObjectURL(preImage) : default_image
        }
        return preImage
    }


    return (
        <>

            <Modal show={isShow} onHide={() => setIsShow(false)} backdrop='static' keyboard={false} style={{ backgroundColor: '#000a' }}>
                <AlertSmall showAlert={showAlert} title='Formato de archivo no válido' description='Únicamente puedes subir imágenes' setShowAlert={setShowAlert} />
                <Modal.Header closeButton />
                <Modal.Body>
                    <h5>Imagen de incidencia: </h5>
                    <Image src={lookImage()} width='100%' className='px-5 border' alt='Image-Incidencia-Ambiental' />
                    {
                        !review && (
                            <Form.Group controlId='formFile' className='mt-3'>
                                <Form.Group className='mt-2'>
                                    <div className='d-grid gap-2 '>
                                        <Button variant='outline-primary' className='contenedor-btn-file' size='lg'>
                                            <FeatherIcon icon={'image'} /> &nbsp;
                                            Seleccionar Imagen
                                            <label htmlFor='btn-file'></label>
                                            <input type='file' id='btn-file' onChange={onImageChange} accept='image/png,image/jpeg' />
                                        </Button>
                                    </div>
                                </Form.Group>
                            </Form.Group>
                        )
                    }

                </Modal.Body>
                <Modal.Footer>
                    {
                        !review && (
                            <Button variant={`success ${!preImage && 'disabled'}`} onClick={() => { setIsShow(false); setImage(preImage) }}> <FeatherIcon icon={'upload'} /> Cargar</Button>
                        )
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}
