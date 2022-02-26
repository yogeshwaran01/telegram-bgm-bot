import cheerio from 'cheerio'
import { fetchURL } from "./utils.js"


let fetchAlbumInCategory = async (url) => {
    let markup = await fetchURL(url)
    const $ = cheerio.load(markup)
    let c = $('.list-block').toArray()
    let images = $('.wp-post-image').toArray().map(image => $(image).attr('data-lazy-src'))
    let totalPages = parseInt($('.page-numbers').toArray().map(i => $(i).text(), 10).pop()) || 0
    let data = []
    c.forEach((e, i) => {
        const $ = cheerio.load(e)
        const required = {
            title: $('a').attr('title'),
            link: $('a').attr('href'),
            image: images[i]
        }
        data.push(required)
    })

    return {
        'pages': totalPages,
        'data': data
    }
}

fetchAlbumInCategory('https://www.bgmringtones.com/category/tamil-bgm/page/2/').then(d => console.log(d))

export default fetchAlbumInCategory
