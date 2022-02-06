import axios from 'axios'

let fetchURL = async (url) => {
    const response = await axios.get(url)
    return await response.data
}

export default fetchURL
