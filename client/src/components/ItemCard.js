import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, ProgressBar, Card, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchItem, bidItem } from '../actions';

const ItemCard = props => {
    const { fetchItem, bidItem } = props;
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    
    useEffect(() => {
        fetchItem(props.item.id);
        if (props.item.bidTimer && props.item.bidTimer > 0) {
            const interval = setInterval(() => bidItem(props.item.id, {bidTimer: props.item.bidTimer - 1}), 100);
            return () => clearInterval(interval);
        } else {
            if (props.item.bidCount < 2) {
                bidItem(props.item.id, {bidTimer: 100, bidCount: props.item.bidCount + 1});
            } else if (props.item.bidCount === 2 && props.item.buyerId) {
                bidItem(props.item.id, {itemSold: true});
                if (props.currentUserId === props.item.buyerId) {
                    setShow(true);
                }
            }
        }
    }, [props.item.bidTimer])

    const bidClick = (id, currBid, prevBid, newBid, buyer, buyerName) => {
        if (currBid) {
            bidItem(id, {newBid: (parseFloat(currBid) + parseFloat(newBid)).toFixed(2), buyerId: buyer, buyerName: buyerName, bidTimer: 100, bidCount: 0 });
        } else if (prevBid) {
            bidItem(id, {currentBid: parseFloat(prevBid).toFixed(2), newBid: (parseFloat(prevBid) + parseFloat(newBid)).toFixed(2), buyerId: buyer, buyerName: buyerName, bidTimer: 100, bidCount: 0 });
        }
    }

    return (
        <>
            <Card>
                <Card.Header as="h4" className="bg-secondary title-text">{props.item.title}</Card.Header>
                {props.item.itemSold !== true ?
                    <Card.Body>
                        <Card.Text>
                            {props.item.shortDesc}
                        </Card.Text>
                        <Row>
                            <Col md={4}>
                                <Link to="/" className="text-white">
                                    <Button variant="primary">
                                        More Info
                                    </Button>
                                </Link>
                            </Col>
                            <Col md={6} className="text-right">
                                {props.item.buyerName &&
                                    <div className="float-left">
                                        {props.item.buyerName} is winning!
                                    </div>
                                }
                                <div className="float-right">
                                    Current Bid:<br />
                                    {props.item.newBid ?
                                        <span>{props.item.newBid}</span> :
                                        <span>{props.item.currentBid}</span>
                                    }
                                </div>
                            </Col>
                            <Col md={2}>
                                {props.item.sellerId !== props.currentUserId ?
                                    <div>
                                        {props.item.newBid ?
                                            <Button variant="primary" className="increase-bid" onClick={() => bidClick(props.item.id, null, props.item.newBid, props.item.increment, props.currentUserId, props.firstName, props.item.bidTimer, props.item.bidCount)}>
                                                Bid
                                            </Button> :
                                            <Button variant="primary" className="increase-bid" onClick={() => bidClick(props.item.id, props.item.currentBid, null, props.item.increment, props.currentUserId, props.firstName, props.item.bidTimer, props.item.bidCount)}>
                                                Bid
                                            </Button>
                                        }
                                    </div> :
                                    <Button disabled>Bid</Button>
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col>&nbsp;</Col>
                        </Row>
                        <Card.Footer>
                            <Row>
                                <Col>
                                    {props.item.bidCount === 0 &&
                                        <ProgressBar animated variant="success" now={props.item.bidTimer} label="A new bidder has emerged" />
                                    }
                                    {props.item.bidCount === 1 &&
                                        <ProgressBar animated variant="warning" now={props.item.bidTimer} label="Going once..." />
                                    }
                                    {props.item.bidCount === 2 &&
                                        <ProgressBar animated variant="danger" now={props.item.bidTimer} label="GOING TWICE..." />
                                    }
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card.Body> :
                    <Card.Body>
                        <h1 className="display-1 text-center">This item is sold</h1>
                    </Card.Body>
                }
            </Card>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered dialogClassName="modal-90w">
                <h1 className="text-center">You won!</h1>
                <h3 className="text-center">Please fill out the information below to claim your treasure!</h3>
            </Modal>
        </>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        item: state.items[ownProps.item],
        isSignedIn: state.auth.isSignedIn,
        currentUserId: state.auth.userId,
        firstName: state.auth.firstName
    }
};

export default connect(mapStateToProps, { fetchItem, bidItem })(ItemCard);
