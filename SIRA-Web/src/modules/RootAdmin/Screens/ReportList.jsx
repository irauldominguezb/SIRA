import React, { useEffect, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faFrown, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { DataTableRoot } from '../components/DataTableRoot';
import { ModalPdfM } from '../components/reports/ModalPdfM';
import { ReportSee } from '../components/reports/ReportSee';
import { useReport } from '../customHooks/useReport';
import { Loading } from '../../../shared/components/LoadingPage';
import { dateFormat } from '../../../utils/functions';



export const ReportList = ({ id, aspect, user }) => {

  const { downLoadReport, getReports, completedReport, getReportsByAscpect } = useReport();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isOpenPdfMoth, setIsOpenPdfMoth] = useState(false);
  const [isSeeReport, setIsSeeReport] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    setIsLoading(true);
    id ? getReportsByAscpect(setReports, id) : getReports(setReports)
    setIsLoading(false);
  }, []);

  const data = reports.filter(
    item => {
      const constDate = dateFormat(item.date_start)
      return (
        item.description.toLowerCase().includes(filterText.toLowerCase()) ||
        item.location_description.toLowerCase().includes(filterText.toLowerCase()) ||
        item.location_description.toLowerCase().includes(filterText.toLowerCase()) ||
        constDate.toLowerCase().includes(filterText.toLowerCase()) ||
        item.aspect.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.user.fullname.toLowerCase().includes(filterText.toLowerCase())
      )
    }
  )


  const columns = React.useMemo(() => [
    {
      name: '#',
      cell: (row, index, column, id) => (
        <div>
          <b>{index + 1}</b>
        </div>
      ),
      sortable: true,
      maxWidth: '1500px',
      style: {
        color: '#000',
        '&:hover': {
          cursor: 'pointer',
          color: '#fff',
          backgroundColor: 'rgba(80, 220, 150, 0.8)',
        },
      },
      reorder: true
    }, {
      name: 'Descripción del reporte',
      cell: (row) => <div>{row.description}</div>,
      style: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      sortable: true,
      selector: (row) => row.description,
    }, {
      name: 'Descripción del lugar',
      cell: (row) => <div>{row.location_description}</div>,
      sortable: true,
      style: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      selector: (row) => row.location_description,
    }, {
      name: 'Aspecto',
      cell: (row) => <div>{row.aspect.name}</div>,
      sortable: true,
      style: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      selector: (row) => row.aspect.name,
    }, {
      name: 'Fecha inicio',
      cell: (row) => <div>{dateFormat(row.date_start)}</div>,
      sortable: true,
      style: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      selector: (row) => row.date_start,
    }, 
    user ? {
      name: 'Estado',
      cell: (row) => {
        const statusName =  row.status ? 'Pendiente' : 'Completado';
        const statusColor =  row.status ? 'danger' : 'success';
        return <Badge bg={statusColor} className='p-2'>{statusName}</Badge>
      },
      sortable: true,
      selector: (row) => row.status,
      maxWidth: '100px',
    } :
    {
      name: 'Estado',
      cell: (row) => <Status row={row} />,
      sortable: true,
      selector: (row) => row.status,
      maxWidth: '100px',
    }, {
      name: 'Acciones',
      cell: (row) => <Actions row={row} />,
    },
  ]);



  const Status = ({ row }) => {
    return (<>
      {row.status ? (
        <OverlayTrigger placement={'top'} overlay={<Tooltip>Pendiente</Tooltip>} >
          <Button variant='outline-danger' onClick={() => {
            completedReport(row, setReports, id)
          }}>
            <FontAwesomeIcon icon={faFrown} />
          </Button>
        </OverlayTrigger>
      ) : (
        <OverlayTrigger placement={'top'} overlay={<Tooltip>Completado</Tooltip>} >
          <Button variant='success' >
            <FontAwesomeIcon icon={faCircleCheck} />
          </Button>
        </OverlayTrigger>
      )}
    </>)
  };

  const Actions = ({ row }) => {
    return (
      <>
        <OverlayTrigger placement={'top'} overlay={<Tooltip>Ver</Tooltip>}>
          <Button
            className='me-1 inputBlue2'
            onClick={() => { setIsSeeReport(true); setSelectedReport(row) }}
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
        </OverlayTrigger>

        <OverlayTrigger
          placement={'top'}
          overlay={<Tooltip>Descargar reporte</Tooltip>}
        >
          <Button variant='outline-warning' className='me-1' onClick={() => {
            downLoadReport(row.id, setIsDownloading)

          }}
          >
            <FontAwesomeIcon icon={faDownload} />
          </Button>
        </OverlayTrigger>
      </>
    );
  };

  return (
    <>
      <Loading isLoading={isDownloading} text={'Descargando'} />

      <Card>
        <Card.Header style={{ backgroundColor: '#0EAF85' }}>
          <Row>
            <Col className='d-flex align-self-center '>
              <b className='text-white'>Lista de Reportes</b>
            </Col>
            <Col className='text-end'>
              <Button className='bgBtn' onClick={() => setIsOpenPdfMoth(true)}>
                Resumen Mensual &nbsp;
                <FontAwesomeIcon icon={faCalendar} />{' '}
              </Button>
              <ModalPdfM isOpen={isOpenPdfMoth} onClose={() => setIsOpenPdfMoth(false)} aspect={aspect} />
              {selectedReport && <ReportSee
                isOpen={isSeeReport}
                onClose={() => setIsSeeReport(false)}
                report={selectedReport} setReports={setReports}
              />}
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <DataTableRoot
            columns={columns}
            data={data}
            isLoading={isLoading}
            setFilterText={setFilterText}
            filterText={filterText}

          />
        </Card.Body>
      </Card>
    </>
  );
};
