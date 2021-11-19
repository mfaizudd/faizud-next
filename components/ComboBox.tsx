import React from "react";
import Select, { ActionMeta, GroupBase, OptionsOrGroups } from "react-select";
import Creatable from "react-select/creatable"

interface ComboBoxProps {
    name: string;
    value?: any;
    onChange?: (newValue: any, actionMeta: ActionMeta<any>) => void;
    options: OptionsOrGroups<unknown, GroupBase<unknown>>;
    errors?: string[];
}

const ComboBox: React.FC<ComboBoxProps> = (props) => {
    const {
        name,
        value,
        onChange,
        options
    } = props;

    return (
        <div className="w-full px-3 mb-4 mt-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                {name}
            </label>
            <Creatable
                instanceId={name}
                value={value}
                onChange={onChange}
                options={options} />
            <ul className="list-disc px-3">
                {props.errors?.map((error, index) => (
                    <li key={index} className="text-red-500 text-xs italic list-item">{error}</li>
                ))}
            </ul>
        </div>
    )
}

export default ComboBox;