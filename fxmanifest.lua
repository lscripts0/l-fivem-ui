fx_version 'cerulean'
game 'gta5'

author 'lscripts'
description 'UI kit for FiveM'
version '1.1.0'
lua54 'yes'

provide 'chat'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/theme.css',
    'html/assets/*',
    'html/chat.css',
    'html/chat.js',
    'html/vendor/*.css',
    'html/vendor/fonts/*.woff2'
}

shared_scripts {
    'config.lua',
    'locales/*.lua',
    'locale.lua'
}

client_scripts {
    'client/main.lua',
    'client/chat_client.lua'
}

server_scripts {
    'server/main.lua',
    'server/chat_server.lua',
    'server/version.lua'
}
