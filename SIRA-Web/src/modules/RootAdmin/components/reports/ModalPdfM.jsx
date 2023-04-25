import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Modal } from "react-bootstrap";
import { useFormik, yupToFormErrors } from "formik";
import { currentMoth, getDateMonth } from "../../../../utils/functions";
import { useReport } from "../../customHooks/useReport";
import { Loading } from "../../../../shared/components/LoadingPage";
import { useState } from "react";
import * as yup from "yup";

export const ModalPdfM = ({ isOpen, onClose, aspect }) => {
  const [isDown, setIsDown] = useState(false);
  const { downloadReportMonth, downloadAllReportByMonth } = useReport();

  const month = getDateMonth(currentMoth)

  const formik = useFormik({
    initialValues: {
      startDate: month.firstDay,
      endDate: month.lastDay,
    },
    validationSchema: yup.object().shape({
      startDate: yup.date().required("La fecha inicio es obligatoria"),
      endDate: yup.date()
      .required("La fecha fin es obligatoria").min(yup.ref("startDate"), "La fecha fin debe ser después de la fecha inicio")
    }),
    onSubmit: async (values) => {
        console.log(values.startDate);
        console.log(values.endDate);
      aspect
        ? downloadReportMonth(aspect, values.startDate, values.endDate, setIsDown)
        : downloadAllReportByMonth(values.startDate, values.endDate, setIsDown);
    },
  });

  const handleClose = () => {
    onClose();
    formik.resetForm()
  };

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isOpen}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Descargar Resumen Mensual</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Loading isLoading={isDown} text={"Descargando"} />

          <p>
            En este resumen se visualizaran todos los reportes generados en el
            periodo seleccionado
          </p>

          {/* <ListMonth formik={formik} /> */}
          <Form.Label className="textForm">Fecha inicio</Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            id="startDate"
            className={`border border-success`}
            onChange={formik.handleChange}
            value={formik.values.startDate}
          />
           {formik.errors. startDate && (
            <span className="error-text">{formik.errors.startDate}</span>
          )}
          <Form.Label className="textForm mt-4">Fecha fin</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            id="endDate"
            className={`border border-success`}
            onChange={formik.handleChange}
            value={formik.values.endDate}
          />
          {formik.errors. endDate && (
            <span className="error-text">{formik.errors.endDate}</span>
          )}
          <div className="text-end mt-4">
            <Button type="submit" disabled={!(formik.isValid && formik.dirty)} className="bgBtn">
              Descargar PDF &nbsp;
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
