import { useEffect, useState } from "react";

// custom hook to keep state sync with localstorage. 

function useLocalStorage(key, value = null) {
    const initValue = localStorage.getItem(key) || value;
    const [item, setItem] = useState(initValue);

    useEffect(() => {
        if (item === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, item);
        }
    }, [key, item]);

    return [item, setItem];
}

export default useLocalStorage;