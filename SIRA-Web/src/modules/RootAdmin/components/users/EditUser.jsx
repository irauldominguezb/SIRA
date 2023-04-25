import { useFormik } from "formik";
import * as yup from "yup";
import React, { useState } from "react";
import { Button, Col, Modal, Row, Form } from "react-bootstrap";
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

export const EditUser = ({ isEditing, setUsers, onClose, user, reload }) => {

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const passwordInputType = showPassword ? "text" : "password";

  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
      fullname: user.fullname,
      status: user.status,
      role: user.role,
    },
    validationSchema: yup.object().shape({
      fullname: yup.string().required("Campo obligatorio "),
      email: yup.string().email('Debeser un correo electrónico').required("Campo obligatorio "),
      password: yup.string().required("Campo obligatorio ").min(6, "Mínimo 6 caracteres"),
    }),
    onSubmit: async (values) => {

      const payload = {
        email: values.email,
        password: values.password,
        fullname: `${values.fullname.trim()}`,
        status: values.status,
        role: values.role
      }

      console.log("p", payload)

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
              method: "PUT",
              url: `/user/${user.id}`,
              data: JSON.stringify(payload),
            });
            if (!response.error) {
              reload();
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
            }else{ console.log(response)}
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

    React.useMemo(() => {
    const { fullname, email } = user;
    //const { name, surname, lastName } = splitName(fullname);
    form.values.email = email;
    form.values.fullname = fullname;
  }, [user]); 

  const handleClose = () => {
    form.resetForm();
    onClose();
  };

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isEditing}
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
                <Form.Label className='textFormModal'>Nombre Completo<sup style={{ color: "#f00" }}> *</sup> </Form.Label>
                <Form.Control
                  className={`border ${form.errors.fullname ? 'border-danger is-invalid' : 'border-primary'}`}
                  name="fullname"
                  placeholder="Joel Alejandro"
                  value={form.values.fullname}
                  onChange={form.handleChange}
                />
                {form.errors.fullname && (
                  <span className="error-text">{form.errors.fullname}</span>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="textFormModal">
              Correo Electrónico<sup style={{ color: "#f00" }}> *</sup>
            </Form.Label>
            <Form.Control
              name="email"
              className={`border ${form.errors.email
                ? "border-danger is-invalid"
                : "border-primary"
                }`}
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
                <Button type="submit" variant="outline-success">
                  <FeatherIcon icon="check" /> &nbsp;Guardar
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
