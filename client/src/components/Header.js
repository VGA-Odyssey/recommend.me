import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { NavLink } from 'react-router-dom';

function Header() {
    return (
       <Container fluid={true}>
            <Navbar bg="light" variant="light">
            <Navbar.Brand href="#home">Recommend.it</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link>
                    <NavLink exact activeClassName="active" to="/">
                        Home
                    </NavLink>
                </Nav.Link>
                <Nav.Link>
                    <NavLink exact activeClassName="active" to="/about">
                        About
                    </NavLink>
                </Nav.Link>
            </Nav>
            </Navbar>
       </Container>
    )
}

export default Header;