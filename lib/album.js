import cheerio from 'cheerio'
import fetchURL from './utils.js'


let get = async (url) => {
    let markup = await fetchURL(url)
    const $ = cheerio.load(markup)

    let bgmNames = $('.ringtone_name').map((_, a) => $(a).text()).toArray()
    let bgmSources = $('source').map((_, a) => $(a).attr('src')).toArray()
    let bgms = []
    bgmNames.forEach((element, index) => {
        let bgm = {
            'bgmName': element,
            'bgmSource': bgmSources[index]
        }
        bgms.push(bgm)
    })

    return {
        'bgms': bgms,
        'poster': $('.external-img').map((_, a) => $(a).attr('data-lazy-src')).toArray()[0],
        'title': $('entry-title').text()
    }
}

export default get
