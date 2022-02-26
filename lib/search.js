import urls from "./urls.js"
import Fuse from 'fuse.js'
import { parse } from './utils.js'

let allURLS = await urls.allAlbumURLS()

export let sources = allURLS.map(url => {
    return {
        'url': url,
        'parsedURL': parse(url)
    }
})


export const search = (query) => {
    const fuse = new Fuse(sources, {
        'includeScore': true,
        'keys': ['parsedURL'],
    })
    return fuse.search(query)
}

export default search
