import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';


function Product(props) {
    const { product } = props;
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { cartItem }
    } = state;

    const addToCartHandler = async (item) => {
        const existItem = cartItem.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
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
    return (

        <Card>
            <Link to={`/product/${product.slug}`}>
                <img src={product.image} className='card-img-top' alt={product.name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Card.Text>${product.price}</Card.Text>
                <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                {product.countInStock === 0 ?
                    <Button variant='light' disabled>Out Of Stock</Button>
                    :
                    <Button onClick={() => addToCartHandler(product)}>Add To Cart</Button>
                }
            </Card.Body>
        </Card>
    )
}

export default Product