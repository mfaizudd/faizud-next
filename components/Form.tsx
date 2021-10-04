import { FormEventHandler } from "react";

interface FormProps {
    method?: string;
    onSubmit?: FormEventHandler<HTMLFormElement>;
}

const Form: React.FC<FormProps> = ({children, method="get", onSubmit}) => {
    return (
        <form onSubmit={onSubmit} className="lg:w-full px-5 mx-auto" method={method}>
            <div className="flex flex-wrap -mx-3 mb-6">
                {children}
            </div>
        </form>
    )
}
export default Form;