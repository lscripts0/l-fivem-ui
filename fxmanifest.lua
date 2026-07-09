fx_version 'cerulean'
game 'gta5'

author 'lscripts'
description 'UI kit for FiveM'
version '1.0.0'
lua54 'yes'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/theme.css',
    'html/assets/*'
}

shared_scripts {
    'config.lua',
    'locales/*.lua',
    'locale.lua'
}

client_scripts {
    'client/main.lua',
    'client/chat.lua'
}

server_scripts {
    'server/main.lua',
    'server/chat.lua',
    'server/version.lua'
}
