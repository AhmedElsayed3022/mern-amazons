import Alert from 'react-bootstrap/Alert';

export default function MessageBox(props) {
    return (
        <Alert veriant={props.veriant || 'info'}>
            {props.children}
        </Alert>
    )
}