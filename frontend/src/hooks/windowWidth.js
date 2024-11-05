import {useState, useEffect} from 'react';


export const useWindowWidth = () => {
    const [mobileWindow, setMobileWindow] = useState(false);
    useEffect(() => {
        const handleResize = () => {
         window.innerWidth < 700 ? setMobileWindow(true) : setMobileWindow(false)
        }
        handleResize()
        window.addEventListener('resize',handleResize)
        return () => window.removeEventListener('resize',handleResize)
    },[window.innerWidth])

    return {mobileWindow}
}