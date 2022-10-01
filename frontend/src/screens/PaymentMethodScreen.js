import React, { useContext, useEffect, useState } from 'react'
import Form from 'react-bootstrap/esm/Form';
import Button from 'react-bootstrap/esm/Button';
import { Helmet } from 'react-helmet-async';
import CheckOutSteps from './CheckOutSteps';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

export default function PaymentMethodScreen() {
    const navigate = useNavigate();

    const { state, dispatch: ctxDispatch } = useContext(Store);
    const {
        cart: { ShippingAddress, paymentMethod },
    } = state;
    const [paymentMethodName, setPaymentMethod] = useState(paymentMethod || 'PayPal');

    useEffect(() => {
        if (!ShippingAddress.address) {
            navigate('/shipping');
        }
    }, [navigate, ShippingAddress]);

    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethodName })
        localStorage.setItem('paymentMehtod', paymentMethodName);
        navigate('/placeorder');
    };
    return <div>
        <CheckOutSteps step1 step2 step3></CheckOutSteps>
        <div className='container small-container'>
            <Helmet>
                <title>Payment Method</title>
            </Helmet>
            <h1 className='my-3'>Payment Method</h1>
            <Form onSubmit={submitHandler}>
                <div className='mb-3'>
                    <Form.Check
                        type="radio"
                        id="payload"
                        label="payload"
                        value="payload"
                        checked={paymentMethodName === 'payload'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    ></Form.Check>
                </div>
                <div className='mb-3'>
                    <Form.Check
                        type="radio"
                        id="Stripe"
                        label="Stripe"
                        value="Stripe"
                        checked={paymentMethodName === 'Stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    ></Form.Check>
                </div>
                <div className='mb-3'>
                    <Button type='submit'>Continue</Button>
                </div>
            </Form>

        </div>
    </div>;

}
