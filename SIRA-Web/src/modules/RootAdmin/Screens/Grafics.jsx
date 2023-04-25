import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useGrafics } from "../customHooks/useGrafics";
import { Loading } from "../../../shared/components/LoadingPage";
import { currentMoth, getDateMonth } from "../../../utils/functions";
import "../../../shared/custom-styles.css";
import { useFormik } from "formik";
import * as yup from "yup";

export const Grafics = (user) => {
  const { onCountReport, onCountReportByAspect } = useGrafics();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const monthC = getDateMonth(currentMoth);
  const formik = useFormik({
    initialValues: {
      startDate: monthC.firstDay,
      endDate: monthC.lastDay,
    },
    validationSchema: yup.object().shape({
      startDate: yup.date().required("La fecha inicio es obligatoria"),
      endDate: yup
        .date()
        .required("La fecha fin es obligatoria")
        .min(
          yup.ref("startDate"),
          "La fecha fin debe ser después de la fecha inicio"
        ),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      !user.aspect
        ? onCountReport(values.startDate, values.endDate)
            .then((resp) => setData(resp))
            .catch(console.error)
            .finally(() => setIsLoading(false))
        : onCountReportByAspect(
            values.startDate,
            values.endDate,
            user.aspect.name
          )
            .then((resp) => setData(resp))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    },
  });

  useEffect(() => {
    formik.resetForm();
    setIsLoading(true);

    !user.aspect
      ? onCountReport(monthC.firstDay, monthC.lastDay)
          .then((resp) => setData(resp))
          .catch(console.error)
          .finally(() => setIsLoading(false))
      : onCountReportByAspect(monthC.firstDay, monthC.lastDay, user.aspect.name)
          .then((resp) => setData(resp))
          .catch(console.error)
          .finally(() => setIsLoading(false));
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
  };

  const optionsAspect = {
    responsive: true,
    maintainAspectRatio: true,
  };

  return (
    <Container fluid>
      <h3 className="text-center my-3">Gráfica de Reportes</h3>
      <form onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={5}>
            <Form.Label className="textForm">Fecha inicio</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              id="startDate"
              className={`border border-success`}
              onChange={formik.handleChange}
              value={formik.values.startDate}
            />
            {formik.errors.startDate && (
              <span className="error-text">{formik.errors.startDate}</span>
            )}
          </Col>
          <Col md={5}>
            <Form.Label className="textForm ">Fecha fin</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              id="endDate"
              className={`border border-success`}
              onChange={formik.handleChange}
              value={formik.values.endDate}
            />
            {formik.errors.endDate && (
              <span className="error-text">{formik.errors.endDate}</span>
            )}
          </Col>
          <Col className="d-flex align-items-center">
            <div className="mt-2">
              <Button type="submit" className="mt-4 bgBtn" disabled={!(formik.isValid && formik.dirty)}>
                Cargar &nbsp;
              </Button>
            </div>
          </Col>
        </Row>
      </form>

      <Row>
        <Col>
          <div className="py-2 mt-1">
            {!!data && (
              <Bar
                data={data}
                options={!user.aspect ? options : optionsAspect}
                style={
                  !user.aspect ? { maxHeight: "380px" } : { maxHeight: "300px" }
                }
              />
            )}
          </div>
        </Col>
      </Row>
      <Loading isLoading={isLoading} text={"Cargando"} />
    </Container>
  );
};
