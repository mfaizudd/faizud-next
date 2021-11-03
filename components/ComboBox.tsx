import React from "react";
import Select, { ActionMeta, GroupBase, OptionsOrGroups } from "react-select";

interface ComboBoxProps {
    name: string;
    value?: any;
    onChange?: (newValue: any, actionMeta: ActionMeta<any>) => void;
    options: OptionsOrGroups<unknown, GroupBase<unknown>>;
}

const ComboBox: React.FC<ComboBoxProps> = ({ name, value, onChange, options }) => {
    return (
        <div className="w-full px-3 mb-4 mt-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                {name}
            </label>
            <Select
                value={value}
                onChange={onChange}
                options={options} />
        </div>
    )
}

export default ComboBox;