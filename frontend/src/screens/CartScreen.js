import React, { useContext } from 'react'
import Col from 'react-bootstrap/esm/Col';
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/esm/Row';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card';
import { Store } from '../Store';
import axios from 'axios';

function CartScreen() {
    const navigate = useNavigate();
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItem }
    } = state;

    const updateCartHandler = async (item, quantity) => {
        const { data } = await axios.get(`/api/products/${item._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry, Product is Out of Stock');
            return;
        }
        ctxDispatch({
            type: 'ADD_TO_CART',
            payload: { ...item, quantity },
        })
    }
    const removeItemsHandler = (item) => {
        ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item })
    }

    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
    }
    return (
        <div>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <Row>
                <Col md={8}>
                    {cartItem.length === 0 ? (
                        <MessageBox>
                            Cart is empty. <Link to='/'>Go Shopping</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup>
                            {cartItem.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className='align-items-center'>
                                        <Col md={4}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className='img-fluid rounded img-thumbnail'
                                            ></img>{' '}
                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={3}>
                                            <Button variant='light' onClick={() => updateCartHandler(item, item.quantity - 1)} disabled={item.quantity === 1}>
                                                <i className='fas fa-minus-circle'></i>
                                            </Button>
                                            <span>{item.quantity}</span>{' '}
                                            <Button variant='light' onClick={() => updateCartHandler(item, item.quantity + 1)} disabled={item.quantity === cartItem.countInStock}>
                                                <i className='fas fa-plus-circle'></i>
                                            </Button>
                                        </Col>
                                        <Col md={3}>${item.price}</Col>
                                        <Col md={2}>
                                            <Button variant='light' onClick={() => removeItemsHandler(item)}>
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup>
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItem.reduce((a, c) => a + c.quantity, 0)}{' '}
                                        items) : $
                                        {cartItem.reduce((a, c) => a + c.price * c.quantity, 0)}
                                    </h3>
                                </ListGroup.Item>
                            </ListGroup>
                            <ListGroup>
                                <ListGroup.Item>
                                    <div className='d-grid'>
                                        <Button
                                            type='button'
                                            variant='primary'
                                            onClick={checkoutHandler}
                                            disabled={cartItem.length === 0}
                                        >
                                            Proceed To Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default CartScreen
