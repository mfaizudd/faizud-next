import React, { ReactElement, useState } from "react";
import Toast from "components/Toast"

interface FloatingButtonProps {
    title: string;
    onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const FloatingButton: React.FC<FloatingButtonProps> = (props) => {
    const initialToastClass = "-top-3/4 opacity-0 invisible"
    let [toastClass, setToastClass] = useState(initialToastClass);
    const onMouseEnter: React.MouseEventHandler = (e) => {
        setToastClass("-top-full");
    }
    const onMouseLeave = () => {
        setToastClass(initialToastClass);
    }
    return (
        <div onClick={props.onClick}>
            <Toast className={`absolute ${toastClass} -left-1/4 transition-all`}>
                {props.title}
            </Toast>
            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="rounded-full bg-gray-800 p-3 cursor-pointer">
                {props.children}
            </div>
        </div>
    )
}

export default FloatingButton;