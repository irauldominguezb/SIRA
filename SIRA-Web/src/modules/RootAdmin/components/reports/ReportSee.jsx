import { faDownload, faFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  Button,
  Col,
  Modal,
  Row,
  Form,
  OverlayTrigger,
  Tooltip,
  Container,
  Image,
} from "react-bootstrap";

import {
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import GoogleMapWraper from "../../../report/GoogleMapWraper";
import { useReport } from "../../customHooks/useReport";
import { ModalImage } from "../../../../shared/components/ModalImage";
import '../../../../../src/shared/custom-styles.css'
import { Loading } from "../../../../shared/components/LoadingPage";
import { dateFormat } from "../../../../utils/functions";
import noImage from "../../../../assets/noImage.png"


export const ReportSee = ({ isOpen, onClose, report, setReports }) => {

  const { completedReport, downLoadReport } = useReport()
  const [isDownloading, setIsDownloading] = useState(false);

  const [isShow, setIsShow] = useState(false)

  const handleClose = () => { onClose(); };


  const ButtonStatus = () => {
    return (
      <>
        {
          report.status ? (
            <OverlayTrigger placement={"top"} overlay={<Tooltip>Pendiente</Tooltip>} >
              <Button variant="outline-danger" className="me-1"
                onClick={() => {
                  completedReport(report, setReports)
                }}
              >Estado &nbsp;
                <FontAwesomeIcon icon={faFrown} />
              </Button>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger placement={"top"} overlay={<Tooltip>Completado</Tooltip>} >
              <Button variant="success" className="me-1" >
                Estado  &nbsp;
                <FontAwesomeIcon icon={faCircleCheck} />
              </Button>
            </OverlayTrigger>
          )
        }
      </>
    )
  }


  return (
    <Modal backdrop="static" keyboard={false} show={isOpen} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Reporte</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <ModalImage isShow={isShow} setIsShow={setIsShow} review={true} preImage={report.photo} />
        <Loading isLoading={isDownloading} text={'Descargando'} />

        <Container fluid>

          <Container className="d-lg-flex align-content-around">
            <div >
              <p>
                <b className="textFormSee pe-2">Aspecto: </b> <b>{report.aspect.name}</b>
              </p>
              <p>
                <b className="textFormSee pe-2"> Encargado de aspecto: </b> <b>{report.aspect.user.fullname}</b>
              </p>

              <div className="d-lg-flex justify-content-between mb-3 ">
                <div className=" d-lg-flex flex-wrap mb-3 mb-lg-0 ">
                  <b className="textFormSee pe-2">Fecha inicio:</b>
                  <b> {dateFormat(report.date_start)}</b>
                </div>

                <div className=" d-lg-flex flex-wrap ">
                  <b className="textFormSee pe-2">Fecha fin:</b>
                  <b>  {report.date_end ? dateFormat(report.date_end) : "Sin finalizar"}</b>
                </div>
              </div>

              <p>
                <b className="textFormSee">Lugar:</b> <b> {report.location_description}</b>
              </p>
            </div>

            <Container fluid className="m-0 p-0" style={{ width: '100%' }} >
              <p className="textFormSee mb-2">Lugar de la incidencia</p>
              <Container fluid className="border ">
                <GoogleMapWraper height="210px" location={{ lat: Number(report.latitude), lng: Number(report.longitude) }} />
              </Container>
            </Container>

          </Container>
          <hr />

          <Container >
            <Container fluid className="ps-0">
              <p className="lh-sm textFormSee fw-bold">Descripción del problema: </p>
              <p className="lh-sm p-0">{report.description} </p>
            </Container>
          </Container>

          <Row>
            <Col>
              <Container className="text-center px-lg-5">
                <Image src={report.photo?report.photo: noImage} width={report.photo?'100%':'50%'} className='px-5 py-3 border' alt='Image-Incidencia-Ambiental' />
              </Container>
            </Col>
          </Row>
        </Container>


        <Form.Group className="my-3">
          <Row>
            <Col className="text-end">
              <OverlayTrigger placement={"top"} overlay={<Tooltip>Descargar PDF</Tooltip>} >
                <Button variant="outline-primary" className="me-3" onClick={() => {
                  downLoadReport(report.id, setIsDownloading)
                }}>
                  Descargar <FontAwesomeIcon icon={faDownload} />
                </Button>
              </OverlayTrigger>
              <ButtonStatus />
            </Col>
          </Row>
        </Form.Group>

      </Modal.Body>
    </Modal>
  );
};
