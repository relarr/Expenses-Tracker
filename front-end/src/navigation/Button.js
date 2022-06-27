import './Button.css';

const Button = props => {
    return (
        <button
            className={`button ${props.delete && 'button-delete'}`}
            type={props.type}
            onClick={props.onClick}
            disabled={props.disabled} >
            {props.children}
        </button>
    );
};

export default Button;