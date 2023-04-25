import React, { useState } from 'react';
import { Button, Card, Col, Row, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import { DataTableRoot } from '../components/DataTableRoot';
import { NewUser } from '../components/users/NewUser';
import AxiosClient from '../../../shared/plugins/axios';
import { useEffect } from 'react';
import { EditUser } from '../components/users/EditUser';

export const UsersList = ({ user }) => {

  const [isOpenNew, setIsOpenNew] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);

  const getUsers = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: '/user/' });
      if (!data.error) setUsers(data.data.filter(person => person.id !== user.id));
    } catch (error) {
      //alerta
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
    setReload(false)
    setSelectedUser(null);
  }, [reload]);

  const data = users.filter(
    (user) => (
      user.fullname.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email.toLowerCase().includes(filterText.toLowerCase()) ||
      user.fullname.toLowerCase().includes(filterText.toLowerCase())
    )
  );


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
      name: 'Nombre',
      cell: (row) => <div>{row.fullname}</div>,
      sortable: true,
      style: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      selector: (row) => row.fullname,
    },
    {
      name: 'Correo electronico',
      cell: (row) => <div>{row.email}</div>,
      sortable: true,
      style: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      selector: (row) => row.email,
    },
    {
      name: 'Estado',
      cell: (row) => {

        const statusName =  row.status ? 'Disponible' : 'Ocupado';
        const statusColor =  row.status ? 'success' : 'secondary';
        return <Badge bg={statusColor} className='p-2'>{statusName}</Badge>

      }
      ,
      sortable: true,
      style: {
        '&:hover': {
          cursor: 'pointer',
        },
      },
      selector: (row) => row.status,
    },
    {
      name: 'Acciones',
      cell: (row) => <Actions row={row} />,
    },
  ], []);

  const Actions = ({ row }) => {
    return (
      <>
        <OverlayTrigger
          placement={'top'}
          overlay={<Tooltip>Editar usuario</Tooltip>}
        >
          <Button
            className='me-1 inputBlue2'
            onClick={() => {
              setIsEditing(true);
              setSelectedUser(row);
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </Button>
        </OverlayTrigger>
      </>
    );
  };

  return (
    <>
      <Card>
        <Card.Header style={{ backgroundColor: '#0EAF85' }}>
          <Row>
            <Col className='d-flex align-self-center '>
              <b className='text-white'>Lista de Usuarios</b>
            </Col>
            <Col className='text-end'>
              <Button className='bgBtn' onClick={() => setIsOpenNew(true)}>
                Nuevo usuario &nbsp;
                <FontAwesomeIcon icon={faPlus} />{' '}
              </Button>
              <NewUser
                isOpen={isOpenNew}
                onClose={() => setIsOpenNew(false)}
                setUsers={setUsers}
              />
              {selectedUser && (
                <EditUser
                  isEditing={isEditing}
                  setUsers={setUsers}
                  onClose={() => setIsEditing(false)}
                  user={selectedUser}
                  reload={() => setReload(true)}
                />
              )}
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <DataTableRoot columns={columns} data={data} isLoading={isLoading} setFilterText={setFilterText}
            filterText={filterText} />
        </Card.Body>
      </Card>
    </>
  );
};
