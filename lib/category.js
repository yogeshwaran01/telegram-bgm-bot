import cheerio from 'cheerio'
import fetchURL from "./utils.js"


let get = async (url) => {
    let markup = await fetchURL(url)
    const $ = cheerio.load(markup)
    let c = $('.list-block').toArray()
    let data = []
    c.forEach(e => {
        const $ = cheerio.load(e)
        const required = {
            title: $('a').attr('title'),
            link: $('a').attr('href')
        }
        data.push(required)
    })

    return data
}
