import { useContext, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Card,
  Container,
  Figure,
  Form,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import FeatherIcon from "feather-icons-react";
import { AuthContext } from "./authContext";
import AxiosClient from "../../shared/plugins/axios";
import Alert from "../../shared/plugins/alerts";
import logoUtez from "../../assets/Logo-utez.png";
import "../../shared/custom-styles.css";
import { useState } from "react";

export const LoginScreen = () => {
  const navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const passwordInputType = showPassword ? "text" : "password";
  const { user, dispatch } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().required("Campo obligatorio"),
      password: yup
        .string()
        .required("Campo obligatorio")
        .min(6, "Mínimo 6 caracteres"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await AxiosClient({
          url: "/auth/login",
          method: "POST",
          data: JSON.stringify(values),
        });
        if (!response.error) {
          const action = {
            type: "LOGIN",
            payload: response.data,
          };
          dispatch(action);
          navigation("/reports", { replace: true });
        } else {
          throw Error();
        }
      } catch (err) {
        Alert.fire({
          title: "Verificar datos",
          text: "Usuario y/o contraseña incorrectos",
          icon: "error",
          confirmButtonColor: "#f27474",
          confirmButtonText: "Aceptar",
        });
      }
    },
  });

  useEffect(() => {
    document.title = "Login | SIRA";
  }, []);

  if (user.isLogged) {
    return <Navigate to={"/"} />;
  }

  return (
    <section className="gradient-form">
      <Container className="h-100">
        <Row className="d-flex justify-content-center align-items-center h-100">
          <Col className="col-xl-10">
            <Card className="rounded-3 text-black shadow text-black animate__animated animate__fadeIn ">
              <Row className="g-0">
                <Col
                  lg
                  className=" d-flex align-items-center gradient-custom-2"
                >
                  <div className="text-white mx-md-4 p-5 px-5">
                    <h4 className="mb-4 text-uppercase">
                      Sistema de Gestión de Reportes de Incidencias Ambientales
                    </h4>
                    <h5>Instrucciones:</h5>
                    <p className="small mb-0">
                      Comprometidos con brindar solución a cualquier incidente
                      ambiental de la mejor y más rápida manera posible.
                    </p>
                    <div className="text-center">
                      <Link to={"/report"} className="p-3">
                        {""}
                        {/* <FeatherIcon className="mt-3" icon={"arrow-left"} /> */}
                        <Button className="inputBlue mt-3 text-center">
                          GENERAR REPORTE
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Col>
                <Col className="col-lg-6">
                  <Card.Body className="p-md-4 mx-md-4">
                    <div className="text-center">
                      <Figure>
                        <Figure.Image alt="SIRA" src={logoUtez} />
                      </Figure>
                      <h4 className="mt-1 mb-3 pb-1">SIRA</h4>
                    </div>
                    <Form onSubmit={formik.handleSubmit}>
                      <Form.Group className="form-outline mb-4">
                        <Form.Label htmlFor="email">
                          Correo electrónico
                        </Form.Label>
                        <Form.Control
                          placeholder="20213tn000@utez.edu.mx"
                          id="username"
                          autoComplete="off"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                        />
                        {formik.errors.email ? (
                          <span className="error-text">
                            {formik.errors.email}
                          </span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="form-outline mb-4">
                        <Form.Label htmlFor="password">Contraseña</Form.Label>
                        <div className="input-group mb-3">
                          <input
                            className={`border ${
                              formik.errors.aspect
                                ? "border-danger is-invalid"
                                : "border-primary"
                            } form-control`}
                            name="password"
                            placeholder="********"
                            style={{
                              backgroundColor: "#ffff",
                              borderRightWidth: "0",
                            }}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            type={passwordInputType}
                          />
                          <span
                            className="input-group-text pe-3"
                            style={{
                              backgroundColor: "#ffff",
                              borderLeftWidth: "0",
                            }}
                          >
                            <i
                              id="togglePassword"
                              style={{ cursor: "pointer" }}
                            >
                              {showPassword ? (
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
                        {formik.errors.password ? (
                          <span className="error-text">
                            {formik.errors.password}
                          </span>
                        ) : null}
                      </Form.Group>
                      <Form.Group className="form-outline">
                        <div className="text-center pt-1 pb-1">
                          <Button
                            className="inputBlue"
                            type="submit"
                            disabled={!(formik.isValid && formik.dirty)}
                          >
                            <FeatherIcon icon={"log-in"} />
                            &nbsp; Iniciar sesión
                          </Button>
                        </div>
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
