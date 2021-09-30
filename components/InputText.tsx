import { ChangeEventHandler } from "react";

interface InputTextProps {
    name: string;
    placeholder?: string;
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    valid?: boolean;
    errors?: string[];
}

const InputText: React.FC<InputTextProps> = (props) => {
    let classNames = "appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-all";
    if (props.valid == false) {
        classNames = "appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white transition-all"
    }

    return (
        <div className="w-full px-3 mb-4 mt-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                {props.name}
            </label>
            <input 
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                className={classNames}
                type="text" 
                placeholder={props.placeholder} />

            <ul className="list-disc px-3">
                {props.errors?.map((error, index) => (
                    <li key={index} className="text-red-500 text-xs italic list-item">{error}</li>
                ))}
            </ul>
        </div>
    )
}

export default InputText;