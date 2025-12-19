import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SearchBar from './components/SearchBar';
import UserList from './components/UserList';
import CreateUserModal from './components/CreateUserModal';
import { Container, Row, Col, Button, Navbar} from 'react-bootstrap';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleUserCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand >User Management Dashboard</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row className="mb-4">
          <Col md={8}>
            <SearchBar onSearch={handleSearch} />
          </Col>
          <Col md={4} className="d-flex justify-content-end">
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              Create New User
            </Button>
          </Col>
        </Row>

        <Row>
          <Col>
            <UserList searchTerm={searchTerm} refreshTrigger={refreshTrigger} />
          </Col>
        </Row>
      </Container>

      <CreateUserModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}

export default App;
