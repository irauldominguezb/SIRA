import React, { useEffect, useState } from "react";
import { Button, Col, Form, FormSelect, Modal, Row } from "react-bootstrap";
import * as yup from "yup";
import { useFormik } from "formik";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import Alert, {
  confirmMsj,
  confirmTitle,
  successMsj,
  successTitle,
  errorMsj,
  errorTitle,
} from "../../../../shared/plugins/alerts";
import AxiosClient from "../../../../shared/plugins/axios";

export const EditAspect = ({ isEditing, setAspects, onClose, aspect, reload }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getUsers = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/user/role/Encargado/status/1" });
      if (!data.error) setUsers(data.data);
    } catch (error) {
      //alerta
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const form = useFormik({
    initialValues: {
      id: 0,
      name: "",
      status: false,
      user: aspect.user,
    },
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .required("Campo obligatorio")
        .min(3, "Mínimo 3 caracteres"),
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
              method: "PUT",
              url: `/aspect/${aspect.id}`,
              data: JSON.stringify(values),
            });
            if (!response.error) {
              setAspects((aspects) => [
                response.data,
                ...aspects.filter((aspect) => aspect.id !== values.id),
              ]);
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

  React.useMemo(() => {
    const { name, id, status, ...user } = aspect;
    form.values.id = id;
    form.values.name = name;
    form.values.status = status;
  }, [aspect]);

  const handleClose = () => {
    form.resetForm();
    onClose();
    reload();
  };

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isEditing}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar Aspecto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={form.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="textFormModal">Nombre</Form.Label>
            <Form.Control
              className={`border ${
                form.errors.aspect
                  ? "border-danger is-invalid"
                  : "border-primary"
              }`}
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
            <Form.Label htmlFor="aspects" className="textFormModal">
              Encargado
            </Form.Label>
            <FormSelect
              name="user.email"
              id="user.email"
              onChange={form.handleChange}
              value={form.values.aspect}
            >
              {aspect.user ?<option key={aspect.user.id} value={aspect.user.id}>
                {aspect.user.fullname}
              </option> : <option key={100000} value={undefined}>
                Selecciona una opción
              </option>}
              {users.map((user_id) => (
                <option
                  key={user_id.id}
                  value={user_id.email}
                  onChange={form.handleChange}
                >
                  {user_id.fullname}
                </option>
              ))}
            </FormSelect>
            {form.errors.aspect && (
              <span className="error-text">{form.errors.aspect}</span>
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
