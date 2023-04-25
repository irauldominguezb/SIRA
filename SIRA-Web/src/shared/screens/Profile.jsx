import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { useFormik } from "formik";
import * as yup from "yup";
import React, { useContext, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import Alert, {
  confirmMsj,
  confirmTitle,
  successMsj,
  successTitle,
  errorMsj,
  errorTitle,
} from "../plugins/alerts";
import AxiosClient from "../plugins/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../modules/auth/authContext";

function Profile({ user }) {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    show1: false,
    show2: false,
    show3: false,
  });
  const togglePasswordVisibility = () => setShowPassword({show1: !showPassword.show1, show2: showPassword.show2, show3: showPassword.show3});
  const togglePasswordVisibility2 = () => setShowPassword({show1: showPassword.show1, show2: !showPassword.show2, show3: showPassword.show3});
  const togglePasswordVisibility3 = () => setShowPassword({show1: showPassword.show1, show2: showPassword.show2, show3: !showPassword.show3});
  const passwordInputType = showPassword.show1 ? "text" : "password";
  const passwordInputType2 = showPassword.show2 ? "text" : "password";
  const passwordInputType3 = showPassword.show3 ? "text" : "password";

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/auth", { replace: true });
  };
  const form = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confPasword: "",
    },
    validationSchema: yup.object().shape({
      oldPassword: yup
        .string()
        .required("Campo obligatorio")
        .min(6, "Mínimo 6 caracteres"),
      newPassword: yup
        .string()
        .required("Campo obligatorio")
        .min(6, "Mínimo 6 caracteres"),
      confPasword: yup
        .string()
        .required("Campo obligatorio")
        .min(6, "Mínimo 6 caracteres")
        .oneOf([yup.ref("newPassword"), null], "Las contraseñas no coinciden"),
    }),
    onSubmit: async (values) => {
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
              method: "PATCH",
              url: `/user/updatePassword/${user.id}`,
              data: JSON.stringify(values),
            });
            if (!response.error) {
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
              handleLogout();
            } else {
              Alert.fire({
                title: errorTitle,
                text: "Por favor verifica que los datos sean correctos",
                icon: "error",
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
  };

  return (
    <>
      <h3 className="text-center">Perfil</h3>
      <hr />
      <Row>
        <Col md={6}>
          <h5 className="text-center text-capitalize">Datos personales</h5>
          <Form onSubmit={form.handleSubmit} className="mx-5">
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                size="sm"
                name="name"
                placeholder="nombre completo"
                value={user.fullname}
                onChange={() => {}}
                readOnly={true}
              />
              {false && <span className="error-text">{false}</span>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                size="sm"
                name="name"
                placeholder="nombre(s)"
                value={user.email}
                onChange={() => {}}
                readOnly={true}
              />
              {false && <span className="error-text">{false}</span>}
            </Form.Group>
          </Form>
        </Col>
        <Col md={6}>
          <h5 className="text-center text-capitalize">Cambio de contraseña</h5>
          <Form onSubmit={form.handleSubmit} className="mx-5">
            <Form.Group className="mb-3">
              <Form.Label>Contraseña actual</Form.Label>
              <div className="input-group mb-3">
                <input
                  className={`border ${
                    form.errors.aspect
                      ? "border-danger is-invalid"
                      : "border-primary"
                  } form-control`}
                  name="oldPassword"
                  placeholder="********"
                  style={{
                    backgroundColor: "#ffff",
                    borderRightWidth: "0",
                  }}
                  value={form.values.password}
                  onChange={form.handleChange}
                  type={passwordInputType}
                />
                <span
                  className="input-group-text pe-3"
                  style={{
                    backgroundColor: "#ffff",
                    borderLeftWidth: "0",
                  }}
                >
                  <i id="togglePassword" style={{ cursor: "pointer" }}>
                    {showPassword.show1 ? (
                      <FeatherIcon
                        icon="eye"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <FeatherIcon
                        icon="eye-off"
                        onClick={togglePasswordVisibility}
                      />
                    )}
                  </i>
                </span>
              </div>
              {form.errors.oldPassword && (
                <span className="error-text">{form.errors.oldPassword}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nueva contraseña</Form.Label>
              <div className="input-group mb-3">
                <input
                  className={`border ${
                    form.errors.aspect
                      ? "border-danger is-invalid"
                      : "border-primary"
                  } form-control`}
                  name="newPassword"
                  placeholder="********"
                  style={{
                    backgroundColor: "#ffff",
                    borderRightWidth: "0",
                  }}
                  value={form.values.password}
                  onChange={form.handleChange}
                  type={passwordInputType2}
                />
                <span
                  className="input-group-text pe-3"
                  style={{
                    backgroundColor: "#ffff",
                    borderLeftWidth: "0",
                  }}
                >
                  <i id="togglePassword" style={{ cursor: "pointer" }}>
                    {showPassword.show2 ? (
                      <FeatherIcon
                        icon="eye"
                        onClick={togglePasswordVisibility2}
                      />
                    ) : (
                      <FeatherIcon
                        icon="eye-off"
                        onClick={togglePasswordVisibility2}
                      />
                    )}
                  </i>
                </span>
              </div>
              {form.errors.newPassword && (
                <span className="error-text">{form.errors.newPassword}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <div className="input-group mb-3">
                <input
                  className={`border ${
                    form.errors.aspect
                      ? "border-danger is-invalid"
                      : "border-primary"
                  } form-control`}
                  name="confPasword"
                  placeholder="********"
                  style={{
                    backgroundColor: "#ffff",
                    borderRightWidth: "0",
                  }}
                  value={form.values.password}
                  onChange={form.handleChange}
                  type={passwordInputType3}
                />
                <span
                  className="input-group-text pe-3"
                  style={{
                    backgroundColor: "#ffff",
                    borderLeftWidth: "0",
                  }}
                >
                  <i id="togglePassword" style={{ cursor: "pointer" }}>
                    {showPassword.show3 ? (
                      <FeatherIcon
                        icon="eye"
                        onClick={togglePasswordVisibility3}
                      />
                    ) : (
                      <FeatherIcon
                        icon="eye-off"
                        onClick={togglePasswordVisibility3}
                      />
                    )}
                  </i>
                </span>
              </div>
              {form.errors.confPasword && (
                <span className="error-text">{form.errors.confPasword}</span>
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
                    <FeatherIcon icon="x-circle" /> &nbsp;Cancelar
                  </Button>
                  <Button type="submit" variant="outline-success">
                    <FeatherIcon icon="check" /> &nbsp;Actualizar
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  );
}

export default Profile;
