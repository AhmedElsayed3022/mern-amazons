import { createContext, useReducer } from 'react';

export const Store = createContext();
const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ?
        JSON.parse(localStorage.getItem('userInfo'))
        : null,
    cart: {
        ShippingAddress: localStorage.getItem('shippingAddress')
            ?
            JSON.parse(localStorage.getItem('shippingAddress'))
            : {},
        paymentMethod: localStorage.getItem('paymentMethod')
            ? localStorage.getItem('paymentMethod')
            : '',
        cartItem: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
    },
};
function reducer(state, action) {
    switch (action.type) {
        case 'ADD_TO_CART':
            const newItem = action.payload;
            const existItem = state.cart.cartItem.find(
                (item) => item._id === newItem._id
            );
            const cartItem = existItem
                ? state.cart.cartItem.map((item) =>
                    item._id === existItem._id ? newItem : item
                )
                : [...state.cart.cartItem, newItem];
            localStorage.setItem('cartItems', JSON.stringify(cartItem));
            return { ...state, cart: { ...state.cart, cartItem } };
        case 'CART_REMOVE_ITEM': {
            const cartItem = state.cart.cartItem.filter(
                (item) => item._id !== action.payload._id
            );
            localStorage.setItem('cartItems', JSON.stringify(cartItem));
            return { ...state, cart: { ...state.cart, cartItem } };
        }

        case 'CART_CLEAR':
            return { ...state, cart: { ...state.cart, cartItem: [] } };

        case 'USER_SIGNIN':
            return { ...state, userInfo: action.payload };

        case 'USER_SIGNOUT':
            return {
                ...state, userInfo: null, cart: {
                    cartItem: [],
                    ShippingAddress: {},
                    paymentMethod: '',
                },
            };
        case 'SAVE_SHIPPING-ADDRESS':
            return {
                ...state,
                cart:
                    { ...state.cart, ShippingAddress: action.payload }
            }
        case 'SAVE_PAYMENT_METHOD':
            return {
                ...state,
                cart:
                    { ...state.cart, paymentMethod: action.payload }
            }
        default:
            return state;
    }
}
export function StoreProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
