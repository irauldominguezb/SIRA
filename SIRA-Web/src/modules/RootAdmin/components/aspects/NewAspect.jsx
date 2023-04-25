import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormSelect, Modal, Row } from 'react-bootstrap';
import * as yup from "yup";
import { useFormik } from "formik";
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import Alert, {
  confirmMsj,
  confirmTitle,
  successMsj,
  successTitle,
  errorMsj,
  errorTitle,
} from '../../../../shared/plugins/alerts';
import AxiosClient from '../../../../shared/plugins/axios';


export const NewAspect = ({ isOpen, setAspects, onClose }) => {
  const [users, setUsers] = useState([])
  const getUsers = async () => {
    try {
      const data = await AxiosClient({ url: '/user/role/Encargado/status/1' })
      if (!data.error) setUsers(data.data)
    } catch (error) {
      //alerta
    } finally {
    }
  }

  useEffect(() => {
    getUsers()
  }, [isOpen])

  const form = useFormik({
    initialValues: {
      name: "",
      user: ""
    },
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required("Campo obligatorio")
        .min(3, "Mínimo 3 caracteres"),
      user: yup
        .string()
        .required("Campo obligatorio")
    }),
    onSubmit: async (values) => {

      const payload = {
        name: values.name,
        status: true,
        user: {
          email: values.user,
        }
      }

      return Alert.fire({
          title: confirmTitle,
          text: confirmMsj,
          icon: "warning",
          confirmButtonColor: "#009574",
          confirmButtonText: "Aceptar",
          cancelButtonColor: "#DD6B55",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
          backdrop: true,
          showCancelButton: true,
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Alert.isLoading,
          preConfirm: async () => {
            try {
              const response = await AxiosClient({
                method: "POST",
                url: "/aspect/",
                data: JSON.stringify(payload),
              });
              if (!response.error) {
                setAspects((aspects) => [response.data, ...aspects]);
                Alert.fire({
                  title: successTitle,
                  text: successMsj,
                  icon: "success",
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "Aceptar",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleClose();
                  }
                });
              }
              return response;
            } catch (error) {
              Alert.fire({
                title: errorTitle,
                text: errorMsj,
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleClose();
                }
              });
            }
          },
        });
      },
    });

  const handleClose = () => {
    form.resetForm();
    onClose();
  };


  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isOpen}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title >Registrar Aspecto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={form.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className='textFormModal' >Nombre</Form.Label>
            <Form.Control
              className={`border ${form.errors.name ? 'border-danger is-invalid' : 'border-primary'}`}
              name="name"
              placeholder="Agua"
              value={form.values.name}
              onChange={form.handleChange}
            />
            {form.errors.name && (
              <span className="error-text">{form.errors.name}</span>
            )}
          </Form.Group>

          <Form.Group className="form-outline mb-lg-4">
            <Form.Label htmlFor="user" className='textFormModal'>Encargado</Form.Label>
            <FormSelect
              name='user'
              id='user'
              className={`border ${form.errors.user ? 'border-danger is-invalid' : 'border-primary'}`}
              onChange={form.handleChange}
              value={form.values.user}
            >
              <option value={''}>Selecciona un encargado de aspecto</option>
              {users.map(user_id => (
                <option key={user_id.id} value={user_id.email}>{user_id.fullname}</option>
              ))}
            </FormSelect>

            {form.errors.user && (
              <span className="error-text">
                {form.errors.user}
              </span>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col className="text-end">
                <Button
                  className="me-2"
                  variant="outline-danger"
                  onClick={handleClose}
                >
                  <FeatherIcon icon="x" /> &nbsp;Cerrar
                </Button>
                <Button
                  type="submit"
                  variant="outline-success"
                >
                  <FeatherIcon icon="check" /> &nbsp;Guardar
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
