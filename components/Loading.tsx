const Loading: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-gray-700 opacity-50 backdrop-filter backdrop-blur-3xl flex">
            <div className="rounded-full border-2 border-blue-400 w-52 h-52 m-auto">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center text-white text-center">
                    Loading...
                </div>
                <span className="animate-ping absolute rounded-full border-2 border-blue-400 w-52 h-52 m-auto"></span>
            </div>
        </div>
    )
}

export default Loading;