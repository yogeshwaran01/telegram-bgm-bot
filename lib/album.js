import cheerio from 'cheerio'
import { fetchURL } from './utils.js'


let fetchAlbum = async (url) => {
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

    if (bgms.length === 0) {
        let links = $('a')
        $(links).each((_, link) => {
            let text = $(link).text()
            let href = $(link).attr('href')
            if (href.endsWith('.mp3') && !text.endsWith('>')) {
                bgms.push({
                    'bgmName': text,
                    'bgmSource': href.replace('download.php?file=', "")
                })
            }
        })
    }

    return {
        'bgms': bgms,
        'poster': $('.external-img').map((_, a) => $(a).attr('data-lazy-src')).toArray()[0],
        'title': $('.entry-title').text()
    }
}

export default fetchAlbum
