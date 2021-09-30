
interface MiniPopupProps {
    children: React.ReactNode;
    hidden: boolean
}

const MiniPopup: React.FC<MiniPopupProps> = ({children, hidden}) => {
    return (
        <div 
            className={`origin-top-right right-0 mt-2 absolute w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ${hidden ? 'hidden' : ''}`} 
            role="menu" 
            aria-orientation="vertical" 
            aria-labelledby="user-menu-button" 
            tabIndex={-1}>

            {children}
        </div>
    )
}

export default MiniPopup