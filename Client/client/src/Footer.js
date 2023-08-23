import React from "react";
import './Footer.css'
export default class Footer extends React.Component {
    render() {
        return (<div id="footer">
            <div className="col-md-4 d-flex align-items-center">
                <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                    <svg className="bi" width="30" height="24"><use href="#bootstrap" /></svg>
                </a>
                <span className="mb-3 mb-md-0 text-muted">© 2022 Company, Inc</span>
            </div>

            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li className="ms-3"><a className="text-muted" href="#"><svg className="bi" width="24" height="24"><use href="#twitter" /></svg></a></li>
                <li className="ms-3"><a className="text-muted" href="#"><svg className="bi" width="24" height="24"><use href="#instagram" /></svg></a></li>
                <li className="ms-3"><a className="text-muted" href="#"><svg className="bi" width="24" height="24"><use href="#facebook" /></svg></a></li>
            </ul>
        </div>);
    }
}
//



