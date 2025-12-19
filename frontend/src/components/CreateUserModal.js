import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;


const CreateUserModal = ({ show, handleClose, onUserCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: { city: '', zipcode: '', geo: { lat: '', lng: '' } }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      console.log('Submitting form data:', formData);
      try {
        await axios.post(`${API_URL}/create`, formData);
        onUserCreated();
        handleClose();
        resetForm();
      } catch (error) {
        console.error('Error creating user:', error);
        setErrors({ submit: 'Failed to create user. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      address: { city: '', zipcode: '', geo: { lat: '', lng: '' } }
    });
    setErrors({});
  };

  const handleCloseModal = () => {
    handleClose();
    resetForm();
  };

  return (
    <Modal show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Create New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errors.submit && <Alert variant="danger">{errors.submit}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              isInvalid={!!errors.name}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              isInvalid={!!errors.email}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // remove non-digits
                if (value.length <= 10) {
                  setFormData({ ...formData, phone: value });
                }
              }}
              isInvalid={formData.phone.length > 0 && formData.phone.length !== 10}
            />
            <Form.Control.Feedback type="invalid">
              Phone number must be exactly 10 digits
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              value={formData.address.city}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Zipcode</Form.Label>
            <Form.Control
              type="text"
              value={formData.address.zipcode}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipcode: e.target.value } })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="text"
              value={formData.address.geo.lat}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, geo: { ...formData.address.geo, lat: e.target.value } } })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="text"
              value={formData.address.geo.lng}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, geo: { ...formData.address.geo, lng: e.target.value } } })}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCloseModal} className="me-2">Cancel</Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateUserModal;
