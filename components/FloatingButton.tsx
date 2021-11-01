import React, { ReactElement, useState } from "react";
import Toast from "components/Toast"

interface FloatingButtonProps {
    title: string;
    onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const FloatingButton: React.FC<FloatingButtonProps> = (props) => {
    const initialToastClass = "top-1 opacity-0 invisible"
    let [toastClass, setToastClass] = useState(initialToastClass);
    const onMouseEnter: React.MouseEventHandler = (e) => {
        setToastClass("top-0");
    }
    const onMouseLeave = () => {
        setToastClass(initialToastClass);
    }
    return (
        <div onClick={props.onClick}>
            <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="rounded-full bg-gray-800 p-3 cursor-pointer">
                {props.children}
            </div>
            <div className="absolute origin-top -top-full">
                <Toast className={`relative ${toastClass} -left-3 transition-all mb-1`}>
                    {props.title}
                </Toast>
            </div>
        </div>
    )
}

export default FloatingButton;