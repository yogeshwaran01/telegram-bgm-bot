import Fuse from 'fuse.js'
import { parse } from './utils.js'
import urls from './urls.js'

export const fetchSources = async () => {
    let allURLs = await urls.allAlbumURLS()
    return allURLs.map(url => {
        return {
            'url': url,
            'parsedURL': parse(url)
        }
    })
    
} 


export const search = async (query, sources) => {
    
    const fuse = new Fuse(sources, {
        'includeScore': true,
        'keys': ['parsedURL'],
    })
    return fuse.search(query)
}
