import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL;


const UserList = ({ searchTerm, refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success | reject

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: {
      city: '',
      zipcode: '',
      geo: { lat: '', lng: '' }
    }
  });

  /*AUTO HIDE MESSAGE*/
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  /*FETCH USERS*/
  useEffect(() => {
    fetchUsers();
  }, [refreshTrigger]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/all`);
      const usersArray = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setUsers(usersArray);
      setFilteredUsers(usersArray);
    } catch (error) {
      console.error(error);
      setUsers([]);
      setFilteredUsers([]);
      setMessage('Failed to fetch users');
      setMessageType('danger');
    }
  };

  /*SEARCH*/
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  /*HANDLERS*/
  const handleView = (user) => {
    setSelectedUser(user);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      company: user.company || '',
      address: {
        city: user.address?.city || '',
        zipcode: user.address?.zipcode || '',
        geo: {
          lat: user.address?.geo?.lat || '',
          lng: user.address?.geo?.lng || ''
        }
      }
    });
    setShowModal(true);
  };

  const handleDelete = async (email) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      await axios.delete(`${API_URL}/delete/${email}`);
      setMessage('User deleted successfully');
      setMessageType('success');
      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage('Failed to delete user');
      setMessageType('danger');
    }
  };

  /*VALIDATION*/
  const validateForm = () => {
    const err = {};
    if (!formData.name.trim()) err.name = 'Name is required';
    if (!formData.email.trim()) err.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) err.email = 'Invalid email';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /*SUBMIT*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(
        `${API_URL}/update/${selectedUser.email}`,
        formData
      );
      setMessage('User updated successfully');
      setMessageType('success');
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      setMessage('Operation failed');
      setMessageType('danger');
    }
  };

  /*UI*/
  return (
    <>
      {message && (
        <Alert variant={messageType} dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredUsers) && filteredUsers.map(user => (
            <tr key={user.email}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Button size="sm" onClick={() => handleView(user)}>View</Button>{' '}
                <Button size="sm" variant="warning" onClick={() => handleEdit(user)}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(user.email)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit User' : 'User Details'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {isEditing ? (
            <Form onSubmit={handleSubmit}>

              <Form.Label>Email</Form.Label>
              <Form.Control className="mb-2" value={formData.email} disabled />

              <Form.Label>Name</Form.Label>
              <Form.Control
                className="mb-2"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                isInvalid={!!errors.name}
              />

              <Form.Label>Phone</Form.Label>
              <Form.Control
                className="mb-2"
                placeholder="Phone"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />

              <Form.Label>Company</Form.Label>
              <Form.Control
                className="mb-2"
                placeholder="Company"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />

              <Form.Label>City</Form.Label>
              <Form.Control
                className="mb-2"
                placeholder="City"
                value={formData.address.city}
                onChange={e =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })
                }
              />
              <Form.Label>Zipcode</Form.Label>
              <Form.Control
                className="mb-2"
                placeholder="Zipcode"
                value={formData.address.zipcode}
                onChange={e =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, zipcode: e.target.value }
                  })
                }
              />
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                className="mb-2"
                placeholder="lat"
                value={formData.address.geo.lat}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, geo: { ...formData.address.geo, lat: e.target.value } } })}
                isInvalid={!!errors.lat}
              />

              <Form.Label>Longitude</Form.Label>
              <Form.Control
                className="mb-2"
                placeholder="lng"
                value={formData.address.geo.lng}
                onChange={e => setFormData({ ...formData, address: { ...formData.address, geo: { ...formData.address.geo, lng: e.target.value } } })}
                isInvalid={!!errors.lng}
              />

              <Button type="submit">Save</Button>
            </Form>
          ) : (
            selectedUser && (
              <>
                <p><b>Name:</b> {selectedUser.name}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>Phone:</b> {selectedUser.phone || 'N/A'}</p>
                <p><b>Company:</b> {selectedUser.company || 'N/A'}</p>
                <p><b>City:</b> {selectedUser.address?.city || 'N/A'}</p>
                <p><b>Zipcode:</b> {selectedUser.address?.zipcode || 'N/A'}</p>
                <p><b>Geo:</b> Lat: {selectedUser.address?.geo?.lat || 'N/A'}, Lng: {selectedUser.address?.geo?.lng || 'N/A'}</p>
              </>
            )
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserList;
