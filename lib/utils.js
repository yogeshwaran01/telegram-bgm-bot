import axios from 'axios'

export const fetchURL = async (url) => {
    const response = await axios.get(url)
    return await response.data
}

export const parse = (url) => {
    let urlString = new URL(url)
    let path = urlString.pathname.slice(1, -1).split("-").join(" ")
    return path
}
