import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { ListMonth } from "../ListMonth";
import { currentMoth, getDateMonth } from "../../../../utils/functions";
import { useReport } from "../../customHooks/useReport";
import { Loading } from "../../../../shared/components/LoadingPage";
import { useState } from "react";
import { useGrafics } from "../../customHooks/useGrafics";

export const ModalGraficsDates = ({ isOpen, onClose, aspect }) => {
    const { onCountReport2 } = useGrafics();
  const [isDown, setIsDown] = useState(false);
  const { downloadReportMonth, downloadAllReportByMonth } = useReport();
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)

  const formik = useFormik({
    initialValues: {
      startDate: null,
      endDate: null,
    },
    onSubmit: async (values) => {
        console.log(values.startDate);
        console.log(values.endDate);
        setIsLoading(true);
        onCountReport2(values.startDate, values.endDate)
          .then((resp) => setData(resp))
          .catch(console.error)
          .finally(() => {setIsLoading(false); onClose()}); 
    //   aspect
    //     ? downloadReportMonth(aspect, values.startDate, values.endDate, setIsDown)
    //     : downloadAllReportByMonth(values.startDate, values.endDate, setIsDown);
    },
  });

  const handleClose = () => {
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
        <Modal.Title>Generar Rsumen por fecha</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={formik.handleSubmit} noValidate>
          <Loading isLoading={isDown} text={"Descargando"} />

          <p>
            En este resumen se visualizaran todos los reportes generados en el
            mes seleccionado del año en curso
          </p>

          {/* <ListMonth formik={formik} /> */}
          <Form.Label className="textForm">Fecha inicio</Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            id="startDate"
            className={`border border-success`}
            onChange={formik.handleChange}
          />
          <Form.Label className="textForm mt-4">Fecha fin</Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            id="endDate"
            className={`border border-success`}
            onChange={formik.handleChange}

          />

          <div className="text-end mt-4">
            <Button type="submit">
              Cargar &nbsp;
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          </div>
        </form>
      </Modal.Body>
      <Loading isLoading={isLoading} text={"Cargando"} />
    </Modal>
    
  );
};
