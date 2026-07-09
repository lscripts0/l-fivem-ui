# l-fivem-ui

UI kit for FiveM: arrow key menus, npc conversations, radial menu, text ui, hold text ui, notifications, announce banner, mission text, fullscreen warn, alert/input/form dialogs, pin pad, code pad, key confirmations, progress bar and circle, skillcheck minigames, countdown, objectives tracker, a grouped key legend and a full chat replacement. Built with React, TypeScript and MUI.

## Install

1. Drop the resource into your resources folder.
2. Add `ensure l-fivem-ui` to your server.cfg.
3. Optional: tweak `config.lua` (language, text ui position, sounds, visible rows).

Built in texts are localized through `locales/` (`en` and `de` ship with the resource, set via `Config.Locale`, add your own file for other languages). On start the server checks GitHub for a newer release and prints the result to the console (`Config.VersionCheck`).

## Performance

Measured with resmon on a Ryzen 7 5700X: 0.01 ms idle (0.00 ms with the chat disabled via `Config.Chat`), 0.03 to 0.05 ms while a menu is open and its keys are being polled. Elements without key input (notifications, progress, text ui) stay at idle cost.

## Theming

All colors live in `html/theme.css` as css variables: text, panel background, borders, selection highlight, glow, the confirm green and the cancel red. Edit the values there and restart the resource, no rebuild needed. The file explains every variable.

## Menu

```lua
exports['l-fivem-ui']:OpenMenu({
    title = '24/7 Store',
    subtitle = 'Los Santos',
    position = 'right',         -- 'left' | 'right'
    items = {
        { id = 'buy', label = 'Buy water', icon = 'fa-solid fa-basket-shopping', rightLabel = '$1.50', description = 'A bottle of water.',
            onSelect = function(item) print('bought water') end },
        { id = 'ammo', label = 'Ammo', type = 'options', options = { 'Regular', 'Express' }, index = 1,
            onChange = function(item) print(item.options[item.index]) end },
        { id = 'amount', label = 'Amount', type = 'slider', min = 1, max = 10, step = 1, value = 1 },
        { id = 'wrap', label = 'Bag it', type = 'checkbox', checked = false },
        { id = 'more', label = 'More goods', arrow = true },
        { id = 'locked', label = 'Sold out', disabled = true }
    },
    onSelect = function(item) print(item.id) end,
    onChange = function(item) print(item.id, item.value, item.index, item.checked) end,
    onBack = function() end,    -- backspace, menu closes first; reopen a parent menu here
    onClose = function() end    -- escape or CloseMenu()
})
```

Every item can carry its own `onSelect` and `onChange`; when set they are called instead of the menu level ones, so you do not need an id switch in one big callback. The menu level `onSelect`/`onChange` still fire for items without their own.

Controls: arrow keys to navigate and change values, enter to select, backspace for back. Menus do not grab input, the player can keep moving while a menu is open.

Every item takes an optional `icon` with a Font Awesome class (free set is bundled). A bare name like `'star'` is treated as `fa-solid fa-star`.

Other exports:

```lua
exports['l-fivem-ui']:CloseMenu()
exports['l-fivem-ui']:IsMenuOpen()
```

## Conversation

An npc dialog panel at the bottom of the screen: npc name, spoken line and a list of answers. Arrow keys pick, enter selects, backspace or escape closes. Selecting closes the conversation; open the next one inside `onSelect` to build a dialog tree.

```lua
exports['l-fivem-ui']:OpenConversation({
    name = 'Mechanic',
    text = 'What can I do for you?',
    choices = {
        { id = 'repair', label = 'Repair my vehicle',
            onSelect = function(choice) print('repairing') end },
        { id = 'upgrade', label = 'Upgrade the engine' },
        { id = 'leave', label = 'Not interested.' }
    },
    onSelect = function(choice) print(choice.id) end,
    onClose = function() end       -- backspace, escape or CloseConversation()
})

exports['l-fivem-ui']:CloseConversation()
exports['l-fivem-ui']:IsConversationOpen()
```

Like the menus, every choice can carry its own `onSelect`; the conversation level `onSelect` is the fallback for choices without one. Conversations do not grab input, the player keeps control.

## Radial Menu

A mouse driven wheel. The cursor is grabbed while it is open; click a slice to select. Right click, escape or a click on the center goes back one level, or closes the wheel at the top level.

```lua
exports['l-fivem-ui']:OpenRadialMenu({
    items = {
        { id = 'greet', label = 'Greet', icon = 'handshake',
            onSelect = function(item) print('greeted') end },
        { id = 'rob', label = 'Rob', icon = 'sack-dollar' },
        { id = 'vehicle', label = 'Vehicle', icon = 'car', items = {
            { id = 'engine', label = 'Engine', icon = 'power-off' },
            { id = 'doors', label = 'Doors', icon = 'car-side' }
        } }
    },
    onSelect = function(item) print(item.id) end,
    onClose = function() end
})

exports['l-fivem-ui']:CloseRadialMenu()
exports['l-fivem-ui']:IsRadialMenuOpen()
```

An item with its own `items` table opens that list as a sub wheel instead of selecting (marked with a small arrow next to the label, nest as deep as you want). Like in the menus, every item can carry its own `onSelect`; the top level `onSelect` is the fallback for items without one. Icons take Font Awesome classes like the menu items.

## Text UI

```lua
exports['l-fivem-ui']:ShowTextUI({
    text = 'Open door',
    key = 'E',                 -- optional key badge
    position = 'top-center'    -- optional, defaults to config
})

exports['l-fivem-ui']:HideTextUI()
exports['l-fivem-ui']:IsTextUIOpen()
```

The short form `ShowTextUI('Open door', 'E', 'top-center')` works too. The default position is set in `config.lua`. Valid positions: `top-left`, `top-center`, `top-right`, `left-center`, `right-center`, `bottom-left`, `bottom-center`, `bottom-right`.

## Hold Text UI

A prompt where the player must hold a key. You pass the label shown in the badge and the actual FiveM control id that gets polled; the badge fills up while holding.

```lua
exports['l-fivem-ui']:ShowHoldTextUI({
    text = 'Hold to open the door',
    key = 'E',                     -- label shown in the badge
    keyHash = 38,          -- FiveM control id that gets polled
    duration = 1500,               -- optional ms, defaults to config
    position = 'left-center',      -- optional, defaults to config
    onComplete = function()
        print('held long enough')  -- ui hides itself before this fires
    end
})

exports['l-fivem-ui']:HideHoldTextUI()
exports['l-fivem-ui']:IsHoldTextUIOpen()
```

The short form `ShowHoldTextUI('Hold', 'E', 38, 1500, onComplete, position)` works too.

## Notify

```lua
exports['l-fivem-ui']:Notify({
    message = 'Money received',
    type = 'success',              -- 'info' | 'success' | 'warning' | 'error' | 'support', default 'info'
    duration = 6000,               -- optional ms, defaults to config
    title = 'Store',               -- optional line above the message
    position = 'top-right'         -- optional, overrides the config position
})

exports['l-fivem-ui']:Notify('Money received', 'success', 6000, 'Store')  -- short form
```

Notifications stack and slide in on a dark panel, with an icon per type and a slim vertical bar next to the icon that drains with the remaining display time. A sound plays when they appear and another when they fade out (both set in `config.lua`, same for the announce banner). Stack position and default duration are set in `config.lua`.

## Announce

```lua
exports['l-fivem-ui']:Announce({
    title = 'Los Santos',
    subtitle = 'Welcome to the city',  -- optional
    duration = 8000                    -- optional ms, defaults to config
})

exports['l-fivem-ui']:Announce('Los Santos', 'Welcome to the city', 8000)  -- short form
```

A big centered panel at the top edge of the screen that fades in and out, for zone arrivals, event starts and similar moments.

## Mission Text

A GTA style subtitle at the bottom center of the screen: white text with a dark outline that fades in, holds and fades out on its own, for objectives, instructions and mission lines. `*text*` between stars is shown in the accent color.

```lua
exports['l-fivem-ui']:MissionText({
    text = 'Get to the *marina* before the timer runs out.',
    duration = 5000               -- optional ms, defaults to config
})

exports['l-fivem-ui']:MissionText('Head to the *docks*.', 5000)  -- short form

exports['l-fivem-ui']:HideMissionText()
exports['l-fivem-ui']:IsMissionTextOpen()
```

Calling it again replaces the current line. The default duration is set in `config.lua` (`Config.MissionTextDuration`).

## Warn

```lua
exports['l-fivem-ui']:Warn({
    message = 'You broke the rules.',
    title = 'Warning',             -- optional, defaults to the localized warning word
    author = 'Admin'               -- optional, shown under the message
})

exports['l-fivem-ui']:Warn('You broke the rules.', 'Warning', 'Admin')  -- short form
```

A fullscreen overlay the player has to dismiss by holding enter for `Config.Warn.holdSeconds`, with a progress bar. The hold hint text is set via `Config.Warn.holdLabel`.

## Alert, Input and Form

Centered dialogs with a dimmed backdrop. The player is locked while one is open; enter confirms, escape cancels. Each of them can be called two ways: with callbacks the call returns immediately, without callbacks it blocks your thread until the player is done and returns the result directly.

```lua
exports['l-fivem-ui']:Alert({
    title = 'Delete vehicle',
    message = 'Are you sure?',
    submitLabel = 'Delete',                   -- optional, default 'Confirm'
    cancelLabel = 'Keep',                     -- optional, default 'Cancel', false hides the button
    onConfirm = function() end,
    onCancel = function() end                 -- also fired on escape
})

local confirmed = exports['l-fivem-ui']:Alert({  -- true | false
    title = 'Delete vehicle',
    message = 'Are you sure?'
})

exports['l-fivem-ui']:Alert({                  -- one button, escape does nothing
    title = 'Welcome',
    message = 'Press F1 to open the help menu.',
    submitLabel = 'Continue',
    cancelLabel = false
})

exports['l-fivem-ui']:Input({
    title = 'Character name',
    label = 'Name',                           -- optional
    type = 'text',                            -- 'text' | 'number' | 'password' | 'textarea'
    placeholder = 'Enter a name',
    value = '',                               -- prefill
    required = true,                          -- blocks empty submit
    onSubmit = function(value) end,
    onCancel = function() end
})

local name = exports['l-fivem-ui']:Input({       -- string | nil on cancel
    title = 'Character name',
    label = 'Name',
    required = true
})

exports['l-fivem-ui']:Form({
    title = 'Register vehicle',
    submitLabel = 'Save',
    fields = {
        { id = 'plate', label = 'Plate', type = 'text', placeholder = 'Enter plate', required = true },
        { id = 'year', label = 'Year', type = 'number', min = 1950, max = 2024, value = 2020 },
        { id = 'color', label = 'Color', type = 'select', options = { 'Black', 'White', 'Red' }, index = 1 },
        { id = 'tint', label = 'Window tint', type = 'slider', min = 0, max = 100, step = 5, value = 40 },
        { id = 'notes', label = 'Notes', type = 'textarea' },
        { id = 'insured', label = 'Insured', type = 'checkbox', checked = true }
    },
    onSubmit = function(values)
        print(values.plate, values.year, values.color, values.insured)
    end,
    onCancel = function() end
})

local values = exports['l-fivem-ui']:Form({      -- table | nil on cancel
    title = 'Register vehicle',
    fields = {
        { id = 'name', label = 'Name', type = 'text', required = true }
    }
})

exports['l-fivem-ui']:CloseDialog()
exports['l-fivem-ui']:IsDialogOpen()
```

`values` is keyed by field id: strings for text fields, numbers for number fields (clamped to min/max) and sliders, booleans for checkboxes, the selected option string for selects. Required fields highlight and block the submit while empty.

## Pin Pad and Code Pad

Two ways to enter a code. `PinPad` is a combination lock: the digits sit in a row and each one is turned up or down with the arrows above and below it, like the dials on a safe. `CodePad` is a numeric keypad: a display row plus 1-9 / 0 buttons with clear and backspace, for door codes and keypads. Both work with mouse and keyboard (number keys type or set a digit, enter confirms, escape cancels), share the same options and both come back as a string so leading zeros survive. Same two call styles as the dialogs.

```lua
exports['l-fivem-ui']:PinPad({
    title = 'Safe',
    length = 4,                    -- number of digits, default 4
    onSubmit = function(code) print(code) end,
    onCancel = function() end
})

exports['l-fivem-ui']:CodePad({    -- numeric keypad instead of the dials
    title = 'Door Code',
    length = 4,
    onSubmit = function(code) print(code) end,
    onCancel = function() end
})

local code = exports['l-fivem-ui']:CodePad({ title = 'Door Code', length = 4 })  -- string | nil on cancel

exports['l-fivem-ui']:ClosePinPad()   -- closes either one
exports['l-fivem-ui']:IsPinPadOpen()
```

`CodePad` is a shortcut for `PinPad({ variant = 'keypad' })`; both use the same close and state exports.

## Key Confirm

A confirmation that slides in from the side and expires with a visible timeout bar. Does not block the player; the keys are polled as FiveM control ids.

```lua
exports['l-fivem-ui']:KeyConfirm({
    text = 'Join the poker table?',
    position = 'right',            -- 'left' | 'right'
    duration = 10000,              -- optional, ms until timeout
    hold = 1000,                   -- optional, keys must be held this long instead of a press
    acceptKey = 38,                -- FiveM control id (38 = E)
    acceptLabel = 'E',             -- badge letter
    acceptText = 'Accept',         -- optional row text
    declineKey = 47,               -- optional second key (47 = G)
    declineLabel = 'G',
    declineText = 'Decline',
    onAccept = function() end,
    onDecline = function() end,
    onTimeout = function() end
})
exports['l-fivem-ui']:CancelKeyConfirm()
exports['l-fivem-ui']:IsKeyConfirmOpen()
```

## Minigames

Five skillcheck style minigames. They take keyboard focus while running (the player stands still). Pass `onFinish = function(success) end` and the call returns immediately, or pass no callback and the call blocks and returns `true`/`false`. Escape always fails.

```lua
local ok = exports['l-fivem-ui']:Skillbar({
    label = 'Lockpicking',
    rounds = 3,          -- how many zones to hit in a row
    speed = 1.2,         -- sweeps per second
    zoneSize = 16        -- target zone width in percent
})

local ok = exports['l-fivem-ui']:Sequence({
    label = 'Hack the terminal',
    length = 6,          -- number of letters to type in order
    time = 6000          -- ms before it fails
})

local ok = exports['l-fivem-ui']:Mash({
    label = 'Break free',
    key = 'E',           -- letter to mash
    time = 6000,         -- ms before it fails
    gain = 8,            -- percent gained per press
    decay = 22           -- percent lost per second
})

local ok = exports['l-fivem-ui']:Circle({
    label = 'Safecracking',
    rounds = 3,          -- how many zones to hit in a row
    speed = 0.6,         -- rotations per second
    zoneSize = 40        -- target zone size in degrees
})

local ok = exports['l-fivem-ui']:Tension({
    label = 'Reeling in',
    time = 15000,        -- ms before it fails
    zoneSize = 25,       -- zone size in percent
    speed = 1,           -- how fast the zone drifts
    gain = 22,           -- progress per second inside the zone
    decay = 16           -- progress lost per second outside
})

exports['l-fivem-ui']:CancelMinigame()
exports['l-fivem-ui']:IsMinigameActive()
```

Skillbar and Circle are hit-the-zone checks, one with a sweeping bar, one with a rotating pointer. Tension is hold-to-stay-in-the-zone: holding space raises the marker, releasing lets it sink while the zone drifts; the progress bar fills inside the zone and drains outside, full wins, empty or the timer running out fails.

## Key Legend

A grouped key hint panel: several key badges with labels in one box, for interactions with multiple keys. Display only, the keys themselves are polled by your script.

```lua
exports['l-fivem-ui']:ShowKeyLegend({
    entries = {
        { key = 'E', label = 'Talk' },
        { key = 'G', label = 'Trade' },
        { key = 'X', label = 'Leave' }
    },
    position = 'bottom-right'      -- optional, defaults to Config.TextUIPosition
})

exports['l-fivem-ui']:HideKeyLegend()
exports['l-fivem-ui']:IsKeyLegendOpen()
```

The short form `ShowKeyLegend(entries, position)` works too.

## Countdown

A countdown in mm:ss at the top center of the screen, for races and events. It slides in, counts down, shows the end word for a moment and slides out again. Fire and forget, no callbacks and no sounds: your script decides when things start, the countdown is just the visual.

```lua
exports['l-fivem-ui']:Countdown({
    seconds = 3,                   -- capped at 59:59
    text = 'FIGHT'                 -- optional, shown at the end instead of GO
})

exports['l-fivem-ui']:Countdown(3, 'FIGHT')     -- short form

exports['l-fivem-ui']:CancelCountdown()
exports['l-fivem-ui']:IsCountdownActive()
```

## Objectives

A small task tracker panel for jobs and heists: a title, a list of objectives with square checkboxes, ticked off one by one from your script.

```lua
exports['l-fivem-ui']:ShowObjectives({
    title = 'Store Robbery',
    position = 'right-center',        -- optional, defaults to Config.ObjectivesPosition
    entries = {
        { id = 'steal', label = 'Grab the cash' },
        { id = 'lose', label = 'Lose the cops' },
        { id = 'drop', label = 'Reach the drop-off', done = false }
    }
})

exports['l-fivem-ui']:SetObjective('steal', true)   -- tick or untick a single entry
exports['l-fivem-ui']:HideObjectives()
exports['l-fivem-ui']:IsObjectivesOpen()
```

## Progress

Display only: it shows a bar or circle for the duration and hides itself. No callbacks, it does not block, your script keeps running and handles its own timing.

```lua
exports['l-fivem-ui']:Progress('Repairing vehicle', 5000)  -- short form

exports['l-fivem-ui']:Progress({
    label = 'Repairing vehicle',
    duration = 5000,
    type = 'bar',                  -- 'bar' (segmented) | 'circle'
    position = 'bottom-center'     -- optional, overrides config (8 spots like the text ui)
})

exports['l-fivem-ui']:CancelProgress()   -- stop it early
exports['l-fivem-ui']:IsProgressActive()
```

The bar shows the label on the left and the percentage on the right, with segments that fill one by one; the circle type shows a ring with the percentage inside and the label below. Segment count and default position are set in `config.lua`.

## Chat

The default cfx chat, reskinned to the hud style: only the input line shows, the message window stays hidden so the hud stays clean. The resource has `provide 'chat'`, so remove `ensure chat` (and any chat theme) from your server.cfg and this takes over. `Config.Chat = false` disables it entirely (set it to false if another resource owns the chat).

It is a drop in replacement: all the standard chat events and exports work unchanged, so txAdmin, ESX and other resources need no changes. `chat:addMessage`, `chat:addSuggestion(s)`, `chat:removeSuggestion`, `chat:addTemplate`, `chat:addMode`/`chat:removeMode`, `chat:clear`, the `chatMessage` server event, `_chat:messageEntered` and the `/say` command all behave like the stock chat, and the exports keep their original names (`exports['l-fivem-ui']:addMessage`, `registerMessageHook`, `registerMode`).

Usage: press T to open, enter sends, escape closes. Arrow up/down cycles the input history, tab completes command suggestions, page up/down switches chat modes when a resource registered any.

## Server side

Everything is triggered through exports only. On the server the exports take the player id as first parameter (`-1` targets every player):

```lua
exports['l-fivem-ui']:Notify(playerId, { message = 'Money received', type = 'success', title = 'Store' })
exports['l-fivem-ui']:Announce(-1, { title = 'Los Santos', subtitle = 'Welcome to the city' })
exports['l-fivem-ui']:MissionText(playerId, 'Head to the *docks*.', 5000)
exports['l-fivem-ui']:Warn(playerId, { message = 'You broke the rules.', author = 'Admin' })
```

The countdown and the objectives tracker can be driven from the server too, which is handy for races and group heists where every player sees the same thing:

```lua
exports['l-fivem-ui']:Countdown(-1, { seconds = 3, text = 'GO' })
exports['l-fivem-ui']:CancelCountdown(-1)

exports['l-fivem-ui']:ShowObjectives(playerId, {
    title = 'Store Robbery',
    entries = {
        { id = 'steal', label = 'Grab the cash' },
        { id = 'lose', label = 'Lose the cops' }
    }
})
exports['l-fivem-ui']:SetObjective(playerId, 'steal', true)
exports['l-fivem-ui']:HideObjectives(playerId)
```

The short positional forms work on the server too.

## txAdmin

The resource catches txAdmin events server side and shows them in this ui, configurable in `config.lua`:

- `Config.TxAdmin.announcements` shows txAdmin announcements as the announce banner
- `Config.TxAdmin.scheduledRestart` shows scheduled restart warnings as the announce banner
- `Config.TxAdmin.directMessage` shows direct messages from staff to a player as a support notification
- `Config.TxAdmin.warns` shows txAdmin warns as the fullscreen warn ui

Set any of them to `false` to disable.

## Development

Frontend source lives in `web/`. Requires Node 18+.

```
cd web
npm install
npm run build
```

The build outputs to `html/`, which is what the resource ships.

## Support

If you find this resource useful, you can support development on Ko-fi:

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/lscripts)
