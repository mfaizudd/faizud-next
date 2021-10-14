import { HTMLProps } from "react";

const Toast: React.FC<HTMLProps<HTMLDivElement>> = (props) => {
    return (
        <div className={props.className}>
            <div className="bg-opacity-95 bg-gray-800 rounded-md text-white p-2 text-center">
                {props.children}
            </div>
        </div>
    )
}

export default Toast;