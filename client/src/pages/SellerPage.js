import React from 'react';
import { Container, Row, Form, InputGroup, Button } from 'react-bootstrap';
import { addItem } from '../actions';
import { connect } from 'react-redux';

class ItemPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                title: '',
                description: '',
                shortdesc: '',
                openingBid: '',
                category: 'select',
                sellTimer: 600000,
                readyToSell: false,
                timerSet: false,
                increment: '',
                img: [],
                sellerUserId: ''
            }
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.myChangeHandler = this.myChangeHandler.bind(this);
    };

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ values: { ...this.state.values, sellerUserId: this.props.currentUserId } });
        this.props.addItem(this.state.values);
    }

    myChangeHandler = (e) => {
        this.setState({
            values: { ...this.state.values, [e.target.name]: e.target.value }
        });
    }
    
    render() {
        return (
            <Container className="App">
                <h2>What are You Looking to Sell?</h2>
                <Row>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Name of Item</Form.Label>
                            <Form.Control type="text" name="title" id="title" bsSize="lg" required value={this.state.values.title} onChange={this.myChangeHandler} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Type of Item</Form.Label>
                            <Form.Control as="select" name="category" id="category" bsSize="lg" required value={this.state.values.category} onChange={this.myChangeHandler}>
                                <option default disabled value={null}>Select One</option>
                                <option value="furniture">Furniture</option>
                                <option value="electronics">Electronics</option>
                                <option value="automotive">Automotive</option>
                                <option value="clothing">Clothing</option>
                                <option value="services">Services</option>
                                <option value="other">Other</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Short Description</Form.Label>
                            <Form.Control type="textarea" style={{height: '200px'}} name="shortdesc" id="shortdesc" bsSize="lg" required value={this.state.values.shortdesc} onChange={this.myChangeHandler} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Long Description</Form.Label>
                            <Form.Control type="textarea" style={{height: '200px'}} name="description" id="description" bsSize="lg" required value={this.state.values.description} onChange={this.myChangeHandler} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Opening Bid</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>$</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="number" name="openingBid" id="openingBid" bsSize="lg" required value={this.state.values.openingBid} onChange={this.myChangeHandler} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Bid Increments (How much for each bid increase)</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>$</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="number" name="increment" id="increment" bsSize="lg" required value={this.state.values.increment} onChange={this.myChangeHandler} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            <Form.File
                                id="img"
                                label="Images"
                                multiple
                                value={this.state.values.img}
                                onChange={this.myChangeHandler}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" type="submit">Submit</Button>
                        </Form.Group>
                    </Form>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return { 
        message: state.message,
        isSignedIn: state.auth.isSignedIn,
        currentUserId: state.auth.userId
    }
}

export default connect(mapStateToProps, { addItem })(ItemPage);
