interface SubmitProps {
    label: string;
}

const Submit: React.FC<SubmitProps> = ({label}) => {
    return (
        <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
            {label}
        </button>
    )
}

export default Submit;