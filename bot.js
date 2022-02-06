import { Telegraf } from 'telegraf'
import album from './lib/album.js'
import 'dotenv/config'

const bot = new Telegraf(process.env.BOT)

const channelID = process.env.CHAT
const args = process.argv.splice(2)

let url = args[0]

album(url)
    .then(async (bgmAlbum) => {
        console.info(`${bgmAlbum.bgms.length} music are fetched`)
        await bot.telegram.sendPhoto(channelID, bgmAlbum.poster, {'caption': bgmAlbum.title})
        bgmAlbum.bgms.forEach(async (bgm) => {
            console.info(`Sending ${bgm.bgmName} to Telegram Group...`)
            await bot.telegram.sendAudio(
                channelID,
                bgm.bgmSource,
                {'caption': bgm.bgmName}
            )
            console.info(`${bgm.bgmName} to Telegram Group...`)
        })
    })
