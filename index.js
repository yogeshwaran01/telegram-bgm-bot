import fetchAlbum from "./lib/album.js";
import { search, sources } from "./lib/search.js";
import { Markup, Telegraf } from 'telegraf'
import 'dotenv/config'

const bot = new Telegraf(process.env.BOT)


bot.on('inline_query', async (context) => {
    let query = context.inlineQuery.query
    let results = search(query).splice(0, 10).map((result, index) => {
        return {
            'type': 'article',
            'title': result.item.parsedURL,
            'id': index,
            'message_text': "* " + result.item.parsedURL
        }
    })

    return await context.answerInlineQuery(results)
})

bot.start(context => {
    context.replyWithMarkdown(
        `🔍 Search 💿 BGMS and ⬇️ Download

*** Here you can search bgms in Inline mode ***

Source of Music: [bgmringtones](https://www.bgmringtones.com/)`,
        Markup.inlineKeyboard([
            Markup.button.switchToCurrentChat('🔍 Search', ' '),
            Markup.button.callback('🧑‍💻 Developer', 'dev'),
            Markup.button.callback('ℹ️ Info', 'info')
        ])
    )
})

bot.action('dev', (context) => {
    context.replyWithMarkdown(
        `Bot developed by [yogeshwaran01](https://yogeshwaran01.github.io)`
    )
})

bot.action('info', (context) => {
    context.replyWithMarkdown(
        `***Source*** : [bgmringtones](https://www.bgmringtones.com)
***Language*** : Javascript
***SourceCode*** : [Github Repo](https://github.com/yogeshwaran01/telegram-bgm-bot)`
    )
})

bot.on('text', async (context) => {
    let text = context.message.text
    if (text.startsWith('*')) {
        let arr = text.split(" ")
        arr.shift()
        let query = arr.join(" ")
        let des = sources.filter(s => s.parsedURL === query)[0]
        let target = des.url
        fetchAlbum(target)
            .then(async (data) => {
                await context.replyWithPhoto(data.poster, {
                    'caption': data.title
                })

                data.bgms.forEach(async (bgm) => {
                    await context.replyWithAudio(bgm.bgmSource, {
                        'caption': bgm.bgmName
                    })
                })

            })
    } else {
        context.reply('Only inline Search')
        context.replyWithMarkdown(
            `🔍 Search 💿 BGMS and ⬇️ Download
    
*** Here you can search bgms in Inline mode ***
`,
            Markup.inlineKeyboard([
                Markup.button.switchToCurrentChat('🔍 Search', ' ')
            ])
        )
    }
})



bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
