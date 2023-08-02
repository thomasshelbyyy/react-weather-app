import { useState } from "react"

const InputComponent = (props) => {
    const [city, setCity] = useState('')

    const handleChange = e => setCity(e.target.value)
    
    return(
        
    )
}

export default InputComponent