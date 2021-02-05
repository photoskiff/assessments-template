import React, { FunctionComponent, useEffect, useState } from "react";
import "../style.css";

export type ModalProps = {
    show: boolean;
    onClose: () => void;
}

export const Modal: FunctionComponent<ModalProps> = ({ show, onClose, children, ...rest }) => {
    const [visible, setVisible] = useState(show);
    useEffect(() => {
        setVisible(show);
    }, [show])

    return <div id="myModal" className="modal" style={visible ? { display: "block" } : { display: "none" }}>
        <div className="modal-content">
            <span className="close" onClick={onClose}>&times;</span>
            <div >{children}</div>
        </div>
    </div>
}