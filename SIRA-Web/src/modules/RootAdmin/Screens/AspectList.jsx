import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
//iconos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { DataTableRoot } from '../components/DataTableRoot';
import { NewAspect } from '../components/aspects/NewAspect';
import AxiosClient from '../../../shared/plugins/axios';
import Alert, { confirmMsj,confirmTitle,successMsj,successTitle,errorMsj,errorTitle} from '../../../shared/plugins/alerts';
import { EditAspect } from '../components/aspects/EditAspect';

export const AspectList = () => {
  const [aspects, setAspects] = useState([]);
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterText, setFilterText] = useState('');
 
  const [reload, setReload] = useState(false);



  const getAspects = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: '/aspect/' });
      if (!data.error) {
        const userss = data.data;
        for (let index = 0; index < userss.length; index++) {
          if (userss[index].user == null) {
            userss[index].user = { fullname: 'Sin encargado' }
          }
  
        }
        setAspects(userss);
      }
    } catch (error) {
      //alerta de error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAspects();
    setReload(false);
    setSelectedAspect(null);
  }, [reload]);


  const data = aspects.filter(
    (aspect) => (
      aspect.name.toLowerCase().includes(filterText.toLowerCase()) ||
      aspect.user.fullname.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const enableOrDisable = (row) => {
    Alert.fire({
      title: confirmTitle,
      text: confirmMsj,
      icon: 'warning',
      confirmButtonColor: '#009574',
      confirmButtonText: 'Aceptar',
      cancelButtonColor: '#DD6B55',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      backdrop: true,
      showCancelButton: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Alert.isLoading,
      preConfirm: async () => {
        row.status = !row.status;
        try {
          const response = await AxiosClient({
            method: 'PATCH',
            url: `/aspect/${row.id}`,
            data: JSON.stringify(row),
          });
          if (!response.error) {
            Alert.fire({
              title: successTitle,
              text: successMsj,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar',
            });
          }
          return response;
        } catch (error) {
          Alert.fire({
            title: errorTitle,
            text: errorMsj,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
          });
        } finally {
          getAspects();
        }
      },
    });
  };



  const columns = React.useMemo(() => [
    {
      name: '#',
      cell: (row, index) => (
        <div>
          <b>{index + 1}</b>
        </div>
      ),
      sortable: true,
      maxWidth: '150px',
      style: {
        color: '#000',
        '&:hover': {
          cursor: 'pointer',
          color: '#fff',
          backgroundColor: 'rgba(80, 220, 150, 0.8)',
        },
      },
    },
    {
      name: 'Aspecto',
      cell: (row) => <div>{row.name}</div>,
      sortable: true,
      style: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      selector: (row) => row.name,
    },
    {
      name: 'Responsable',
      cell: (row) => <div>{row.user.fullname}</div>,
      sortable: true,
      selector: (row) => row.user.fullname.toLowerCase(),
      style: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
    },
    {
      name: 'Acciones',
      cell: (row) => <Actions row={row} />,
    },
  ],[]);

  const Actions = ({ row }) => {
    return (
      <>
        <OverlayTrigger
          placement={'top'}
          overlay={<Tooltip>Editar aspecto</Tooltip>}
        >
          <Button
            className='me-1 inputBlue2'
            onClick={() => {
              setIsEditing(true);
              setSelectedAspect(row);
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </OverlayTrigger>
        {row.status ? (
          <OverlayTrigger
            placement={'top'}
            overlay={<Tooltip>Deshabilitar</Tooltip>}
          >
            <Button
              variant='outline-danger'
              className='me-1'
              onClick={() => {
                enableOrDisable(row);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
          </OverlayTrigger>
        ) : (
          <OverlayTrigger
            placement={'top'}
            overlay={<Tooltip>Habilitar</Tooltip>}
          >
            <Button
              variant='outline-success'
              className='me-1'
              onClick={() => {
                enableOrDisable(row);
              }}
            >
              <FontAwesomeIcon icon={faCircleCheck} />
            </Button>
          </OverlayTrigger>
        )}
      </>
    );
  };

  return (
    <>
      <Card>
        <Card.Header style={{ backgroundColor: '#0EAF85' }}>
          <Row>
            <Col className='d-flex align-self-center '>
              <b className='text-white'>Aspectos Ambientales</b>
            </Col>
            <Col className='text-end'>
              <Button
                onClick={() => {
                  setIsOpenNew(true);
                }}
                className='bgBtn'
              >
                Nuevo Aspecto &nbsp;
                <FontAwesomeIcon icon={faPlus} />{' '}
              </Button>
              <NewAspect
                isOpen={isOpenNew}
                onClose={() => setIsOpenNew(false)}
                setAspects={setAspects}
                reload={() => setReload(true)}
              />
              {selectedAspect && (
                <EditAspect
                  isEditing={isEditing}
                  setAspects={setAspects}
                  onClose={() => setIsEditing(false)}
                  aspect={selectedAspect}
                  reload={() => setReload(true)}
                />
              )}
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
