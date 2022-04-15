import fetchAlbum from "./lib/album.js";

fetchAlbum("https://www.bgmringtones.com/kgf-2-bgm-ringtone-for-smartphone/")
    .then(data => {
        console.log(data)
    })
