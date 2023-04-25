import { useFormik } from "formik";
import * as yup from "yup";
import React, { useState, useEffect } from "react";
import { Button, Col, Modal, Row, Form, FormSelect } from "react-bootstrap";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import AxiosClient from "../../../../shared/plugins/axios";
import Alert, {
  confirmMsj,
  confirmTitle,
  successMsj,
  successTitle,
  errorMsj,
  errorTitle,
} from "../../../../shared/plugins/alerts";

export const NewUser = ({ isOpen, setUsers, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const passwordInputType = showPassword ? "text" : "password";

  const getRoles = async () => {
    try {
      const data = await AxiosClient({ url: "/role/" });
      if (!data.error) setRoles(data.data);
    } catch (error) {
      //alerta
    } finally {
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

    const form = useFormik({
        initialValues: {
            email: "",
            password: "",
            fullname: "",
            role: ""
        },
        validationSchema: yup.object().shape({
            fullname: yup.string().required("Campo obligatorio"),
            password: yup.string().required("Campo obligatorio").min(6, "Mínimo 6 caracteres"),
            email: yup.string().email('Formato Incorrecto').required("Campo obligatorio"),
            role: yup.string().required("Campo obligatorio"),
        }),
        onSubmit: async (values) => {
            const payload = {
                email: values.email,
                password: values.password,
                fullname: `${values.fullname.trim()}`,
                status: false,
                role: {
                    name: values.role
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
                            url: "/user/",
                            data: JSON.stringify(payload),
                        });
                        if (!response.error) {
                            setUsers((users) => [response.data, ...users]);
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
              }
    )
}})

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
                <Modal.Title>Registrar Encargado</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={form.handleSubmit}>
                    <Row>
                        <Col md>
                            <Form.Group className="mb-3">
                                <Form.Label className='textFormModal'>Nombre Competo<sup style={{ color: "#f00" }}> *</sup> </Form.Label>
                                <Form.Control
                                    className={`border ${form.errors.fullname ? 'border-danger is-invalid' : 'border-primary'}`}
                                    name="fullname"
                                    placeholder="Nombre Completo"
                                    value={form.values.fullname}
                                    onChange={form.handleChange}
                                />
                                {form.errors.fullname && (
                                    <span className="error-text">{form.errors.names}</span>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label className='textFormModal' >Correo Electrónico<sup style={{ color: "#f00" }}> *</sup></Form.Label>
                        <Form.Control
                            name="email"
                            className={`border ${form.errors.email ? 'border-danger is-invalid' : 'border-primary'}`}
                            placeholder="ejemplo@utez.edu.mx"
                            value={form.values.email}
                            onChange={form.handleChange}
                        />
                        {form.errors.email && (
                            <span className="error-text">{form.errors.email}</span>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3">
            <Form.Label className="textFormModal">
              Contraseña<sup style={{ color: "#f00" }}> *</sup>
            </Form.Label>
            <div className="input-group mb-3">
              <input
                className={`border ${
                  form.errors.password
                    ? "border-danger is-invalid"
                    : "border-primary"
                } form-control`}
                name="password"
                placeholder="********"
                style={{ backgroundColor: "#ffff", borderRightWidth: "0" }}
                value={form.values.password}
                onChange={form.handleChange}
                type={passwordInputType}
              />
              <span
                className="input-group-text pe-3"
                style={{ backgroundColor: "#ffff", borderLeftWidth: "0" }}
              >
                <i id="togglePassword" style={{ cursor: "pointer" }}>
                {showPassword ? (<FeatherIcon icon="eye" onClick={togglePasswordVisibility} />) : (<FeatherIcon icon="eye-off" onClick={togglePasswordVisibility} />)}
                </i>
              </span>
            </div>
            {form.errors.password && (
              <span className="error-text">{form.errors.password}</span>
            )}
          </Form.Group>
                    <Form.Group className="form-outline mb-lg-4 mb-3">
                        <Form.Label htmlFor="aspects" className='textFormModal'>Rol<sup style={{ color: "#f00" }}> *</sup></Form.Label>
                        <FormSelect
                            name='role'
                            id='role'
                            className={`border ${form.errors.role ? 'border-danger is-invalid' : 'border-primary'}`}
                            onChange={form.handleChange}
                            value={form.values.role}
                        >
                            <option value={''}>Selecciona un rol</option>
                            {roles.map(role_id => (
                                <option key={role_id.id} value={role_id.name} onChange={form.handleChange}>{role_id.name}</option>
                            ))}
                        </FormSelect>

                        {form.errors.role && (
                            <span className="error-text">
                                {form.errors.role}
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

