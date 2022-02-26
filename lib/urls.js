import { fetchURL } from "./utils.js"
import cheerio from "cheerio"

const postSiteMap = "https://www.bgmringtones.com/post-sitemap.xml"
const categorySiteMap = "https://www.bgmringtones.com/category-sitemap.xml"

let allAlbumURLS = async () => {
    const xml = await fetchURL(postSiteMap)
    const $ = cheerio.load(xml, {
        xmlMode: true
    })
    return $('loc').map((_, a) => $(a).text()).toArray().slice(1)
}


let allCategoryURLS = async () => {
    const xml = await fetchURL(categorySiteMap)
    const $ = cheerio.load(xml, {
        xmlMode: true
    })
    return $('loc').map((_, a) => $(a).text()).toArray()
}


export default { allAlbumURLS, allCategoryURLS }
