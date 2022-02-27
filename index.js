import fetchAlbum from "./lib/album.js";
import { fetchSources, search } from "./lib/search.js";
import { Markup, Telegraf } from 'telegraf'
import * as messages from './lib/messages.js'
import 'dotenv/config'

const bot = new Telegraf(process.env.BOT)
const sources = await fetchSources()

bot.on('inline_query', async (context) => {
    let query = context.inlineQuery.query
    let res = await search(query, sources)
    let results = res.splice(0, 10).map((result, index) => {
        return {
            'type': 'article',
            'title': result.item.parsedURL,
            'id': index.toString() + "-id",
            'message_text': "* " + result.item.parsedURL
        }
    })

    return await context.answerInlineQuery(results)
})

bot.start(context => {
    context.replyWithMarkdown(messages.welcomeMessage,
        Markup.inlineKeyboard([
            Markup.button.switchToCurrentChat('🔍 Search', ' '),
            Markup.button.callback('🧑‍💻 Developer', 'dev'),
            Markup.button.callback('ℹ️ Info', 'info')
        ])
    )
})

bot.action('dev', (context) => {
    return context.replyWithMarkdown(messages.aboutDeveloperMessage)
})

bot.action('info', (context) => {
    return context.replyWithMarkdown(messages.infoMessage)
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
            `🔍 Search`,
            Markup.inlineKeyboard([
                Markup.button.switchToCurrentChat('🔍 Search', ' ')
            ])
        )
    }
})

bot.catch(err => {
    console.log(err)
    bot.telegram.sendMessage(1047531822, "err")
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
