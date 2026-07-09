Config = {}

-- Language for built in ui texts. Locale files live in locales/, add your own there.
Config.Locale = 'en'

-- Check GitHub for a newer release on server start and print the result to the server console.
Config.VersionCheck = true

-- The chat built into this ui (input only, replaces the default cfx chat resource).
-- Disabled by default: l-ui already owns the server chat (provide 'chat') on this
-- server. Only enable this if l-ui is NOT running, otherwise the chat doubles.
Config.Chat = false

-- Where the text ui prompt is placed on screen (default, can be overridden per call).
-- Available: 'top-left', 'top-center', 'top-right', 'left-center', 'right-center',
--            'bottom-left', 'bottom-center', 'bottom-right'
Config.TextUIPosition = 'right-center'

-- How many menu items are visible at once before the list starts scrolling.
Config.MaxVisibleItems = 8

-- Where notifications stack up.
-- Available: 'top-left', 'top-center', 'top-right',
--            'bottom-left', 'bottom-center', 'bottom-right'
Config.NotifyPosition = 'top-left'

-- Default notification duration in milliseconds (can be overridden per call).
Config.NotifyDuration = 4000

-- Default announce banner duration in milliseconds (can be overridden per call).
Config.AnnounceDuration = 5000

-- Default mission text (GTA style bottom-center subtitle) duration in milliseconds
-- (can be overridden per call).
Config.MissionTextDuration = 5000

-- How long a key must be held for the hold text ui, in milliseconds
-- (default, can be overridden per call).
Config.HoldTextUIDuration = 1000

-- How long a key confirmation stays on screen before it times out,
-- in milliseconds (default, can be overridden per call).
Config.KeyConfirmDuration = 10000

-- Where the objectives tracker is placed, same options as Config.TextUIPosition
-- (default, can be overridden per call).
Config.ObjectivesPosition = 'right-center'

-- Segmented progress bar. Start it with the Progress export, stop it early with
-- CancelProgress, query it with IsProgressActive. There is no in-game cancel key.
Config.Progress = {
    -- Number of segments the bar is split into.
    segments = 12,
    -- Where the bar shows up, same options as Config.TextUIPosition.
    position = 'bottom-center'
}

-- Fullscreen warn ui.
Config.Warn = {
    -- Seconds the player must hold enter to dismiss the warn.
    holdSeconds = 5,
    -- Text shown above the hold progress bar.
    holdLabel = 'Hold ENTER to acknowledge'
}

-- txAdmin integration: catch txAdmin events server side and show them in this ui.
Config.TxAdmin = {
    -- Show txAdmin announcements as the announce banner.
    announcements = true,
    -- Show scheduled restart warnings as the announce banner.
    scheduledRestart = true,
    -- Show direct messages from txAdmin staff as a support notification.
    directMessage = true,
    -- Show txAdmin warns as the fullscreen warn ui.
    warns = true,
    -- Titles used for the txAdmin banners and notifications.
    restartTitle = 'Server Restart',
    announceTitle = 'Announcement',
    directMessageTitle = 'Support',
    warnTitle = 'Warning',
    -- How long the restart banner and direct message notification stay on screen, in milliseconds.
    restartDuration = 10000,
    directMessageDuration = 10000
}

-- Frontend sounds played on menu actions.
-- Set enabled to false to mute everything, or swap name/ref per action.
-- GTA built-in frontend sounds (no audio files needed), same house set the other
-- lscripts resources use. Called as PlaySoundFrontend(-1, name, ref, true).
Config.Sounds = {
    enabled = true,
    open   = { name = 'SELECT', ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET' },
    close  = { name = 'BACK', ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET' },
    back   = { name = 'BACK', ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET' },
    nav    = { name = 'NAV_UP_DOWN', ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET' },
    change = { name = 'NAV_LEFT_RIGHT', ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET' },
    select = { name = 'SELECT', ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET' },
    -- Set an entry to false to mute just that action.
    notify = { name = 'CHECKPOINT_NORMAL', ref = 'HUD_MINI_GAME_SOUNDSET' },
    notifyHide = false,
    announce = { name = 'SELECT', ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET' },
    announceHide = false,
    warn = { name = 'ERROR', ref = 'HUD_FRONTEND_DEFAULT_SOUNDSET' }
}
