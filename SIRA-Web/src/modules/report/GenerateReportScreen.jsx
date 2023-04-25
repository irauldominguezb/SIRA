import React, {  useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Button, Col, Row, Form, Card, Container, OverlayTrigger, Tooltip } from 'react-bootstrap'
import * as yup from 'yup'
import FeatherIcon from 'feather-icons-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCheck } from '@fortawesome/free-solid-svg-icons'
import { ModalImage } from '../../shared/components/ModalImage';
import GoogleMapWraper from './GoogleMapWraper';
import '../../../src/shared/custom-styles.css'
import { useAspects } from './hooksCustom/useAspects';
import { useReport } from './hooksCustom/useReport';
import { Loading } from '../../shared/components/LoadingPage';
import { newDateFormat } from '../../utils/functions';
import PublicNavbar from '../../shared/components/PublicNavbar';
import { ModalVista } from '../../shared/components/ModalVista';

export const GenerateReportScreen = () => {

    const [showSelectPhoto, setShowSelectPhoto] = useState(false)
    const [image, setImage] = useState(null)
    const [preImage, setPreImage] = useState(null)
    const { aspects } = useAspects()
    const [coord, setCoord] = useState({
        lat: 18.849296,
        lng: -99.200293
    })
    const [isLoading, setIsLoading] = useState(false)
    const { onSaveAndSendReport } = useReport(setIsLoading)




    const formik = useFormik({
        initialValues: {
            description: '',
            location_description: '',
            date_start: newDateFormat(),
            email: '',
            aspect:''
        },
        validationSchema: yup.object().shape({
            email: yup.string().email('Ingrese un correo electronico').required('Campo obligatorio'),
            aspect: yup.string().required('Selecciona una opción'),
            description: yup.string().required('Campo obligatorio'),
            location_description: yup.string().required('Campo obligatorio'),
        }),
        onSubmit: async (values) => {        
            values.photo=image
            values.longitude = coord.lng
            values.latitude = coord.lat
            const res = await onSaveAndSendReport(values)
            if(res==='OK')  {formik.resetForm(); setImage(null); setPreImage(null)}         
        },
    });
    useEffect(() => {document.title = 'Reporte | SIRA';}, []);


    return (
        <>
        <ModalVista/>
            <PublicNavbar back={true}/>            
            <Loading isLoading={isLoading} text={'Enviando'} />
            <Container className='rounded-3 text-black animate__animated animate__fadeIn animate__fast' fluid={'sm'}>
                <Card.Header>
                    <Row>
                        <h3 className='text-center text-bold mt-1 ' style={{ color: '#002957' }}>REPORTE DE INCIDENCIA AMBIENTAL</h3>
                    </Row>
                </Card.Header>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Card.Body className='px-lg-5 mx-lg-5'>
                        <Row>
                            <Col lg>
                                <Form.Group className='form-outline my-lg-4 mt-lg-3'>
                                    <Form.Label htmlFor='email' className='textForm'> Ingresa correo electrónico <sup
                                        style={{ color: '#f00' }}>*</sup> </Form.Label>
                                    <Form.Control
                                        placeholder='20213tn001@utez.edu.mx'
                                        id='email'
                                        autoComplete='off'
                                        name='email'
                                        className={`border ${formik.errors.email ? 'border-danger is-invalid' : 'border-success'}`}
                                        onChange={formik.handleChange}
                                        value={formik.values.email}
                                    />

                                    {formik.errors.email && (
                                        <span className='error-text'>
                                            {formik.errors.email}
                                        </span>
                                    )}
                                </Form.Group>

                                <Form.Group className='form-outline mb-lg-4'>
                                    <Form.Label htmlFor='aspect' className='textForm'>Aspecto ambiental<sup
                                        style={{ color: '#f00' }}> *</sup> </Form.Label>

                                    <Form.Select
                                        name='aspect'
                                        id='aspect'
                                        className={`border ${formik.errors.aspect ? 'border-danger is-invalid' : 'border-success'}`}
                                        onChange={formik.handleChange}
                                        value={formik.values.aspect}
                                    >
                                        <option value={''} >Selecciona</option>
                                        {
                                            aspects && aspects.map((aspect) =>
                                                <option key={aspect.id} value={aspect.name} onChange={formik.handleChange} >{aspect.name}</option>)
                                        }
                                    </Form.Select>

                                    {formik.errors.aspect && (
                                        <span className='error-text'>
                                            {formik.errors.aspect}
                                        </span>
                                    )}
                                </Form.Group>

                                <Form.Group className='form-outline mb-lg-4'>
                                    <Form.Label htmlFor='location_description' className='textForm'>Descripción del lugar<sup
                                        style={{ color: '#f00' }}> *</sup></Form.Label>

                                    <Form.Control
                                        className={`border ${formik.errors.location_description ? 'border-danger is-invalid' : 'border-success'}`}
                                        placeholder='¿Dónde es?'
                                        id='location_description'
                                        autoComplete='off'
                                        name='location_description'
                                        value={formik.values.location_description}
                                        onChange={formik.handleChange}
                                    />
                                    {formik.errors.location_description && (
                                        <span className='error-text'>
                                            {formik.errors.location_description}
                                        </span>
                                    )}
                                </Form.Group>

                                <Form.Group className='form-outline mb-4'>
                                    <Form.Label htmlFor='description' className='textForm'> Descripción del problema<sup
                                        style={{ color: '#f00' }}> *</sup></Form.Label>
                                    <Form.Control
                                        className={`border ${formik.errors.description ? 'border-danger is-invalid' : 'border-success'}`}
                                        as='textarea'
                                        rows={2}
                                        style={{ maxHeight: '100px', minHeight: '50px' }}
                                        placeholder='¿Cúal es el problema?'
                                        id='description'
                                        autoComplete='off'
                                        name='description'
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                    />

                                    {formik.errors.description && (
                                        <span className='error-text'>
                                            {formik.errors.description}
                                        </span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col>
                                <h3 className='mt-lg-3 textForm' style={{ fontWeight: 'bold' }}>Localización</h3>

                                <div>
                                    <GoogleMapWraper setCoord={setCoord} />
                                </div>

                                <Form.Group className='mt-lg-5 my-4'>
                                    <div className='d-grid gap-2 '>
                                        <Button onClick={() => {
                                            setShowSelectPhoto(true)
                                        }} variant={image ? 'success' : 'outline-success'} size='lg'><FontAwesomeIcon
                                                icon={image ? faCheck : faCamera} />&nbsp; {
                                                image ? 'Imagen Cargada' : 'Subir foto'
                                            } </Button>
                                    </div>

                                </Form.Group>


                            </Col>
                        </Row>

                        <ModalImage isShow={showSelectPhoto} setIsShow={setShowSelectPhoto} setImage={setImage} preImage={preImage} setPreImage={setPreImage}/>

                        <Form.Group className='mt-2 '>
                            <OverlayTrigger placement='top' overlay={<Tooltip>LLena todo el formulario</Tooltip>}>

                                <div className='d-grid gap-2  '>
                                    <Button className='inputBlue2' size='lg' type='submit'
                                        disabled={!(formik.isValid && formik.dirty)}
                                    > <FeatherIcon icon={'send'} />
                                        &nbsp; Enviar reporte</Button>
                                </div>

                            </OverlayTrigger>
                        </Form.Group>

                    </Card.Body>
                </form>

            </Container>
        </>
    )
}
