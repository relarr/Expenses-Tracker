import reactDom from "react-dom";
import { CSSTransition } from "react-transition-group";
import './SideDrawer.css';

const SideDrawer = props => {
    return reactDom.createPortal(
        <CSSTransition
            in={props.show}
            timeout={300}
            classNames='slide-in-left'
            mountOnEnter
            unmountOnExit >
            <aside
                className='side-drawer'
                onClick={props.onClick} >
                {props.children}
            </aside>
        </CSSTransition>,
        document.getElementById('side-drawer')
    );
};

export default SideDrawer;