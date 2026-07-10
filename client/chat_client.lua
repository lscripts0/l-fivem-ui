if not Config.Chat then return end

local chatInputActive = false
local chatLoaded = false
local currentResourceName = GetCurrentResourceName()

local function UsePreSecurityBehavior()
  return GetConvar('sysresource_chat_disableOriginSecurityChecks', 'true') == 'true'
end

RegisterNetEvent('chatMessage')
RegisterNetEvent('chat:addTemplate')
RegisterNetEvent('chat:addMessage')
RegisterNetEvent('chat:addSuggestion')
RegisterNetEvent('chat:addSuggestions')
RegisterNetEvent('chat:addMode')
RegisterNetEvent('chat:removeMode')
RegisterNetEvent('chat:removeSuggestion')
RegisterNetEvent('chat:clear')

RegisterNetEvent('__cfx_internal:serverPrint')

RegisterNetEvent('_chat:messageEntered')

AddEventHandler('chatMessage', function(author, color, text)
  local args = { text }
  if author ~= "" then
    table.insert(args, 1, author)
  end
  SendNUIMessage({
    type = 'ON_MESSAGE',
    message = {
      color = color,
      multiline = true,
      args = args
    }
  })
end)

AddEventHandler('__cfx_internal:serverPrint', function(msg)
  print(msg)

  SendNUIMessage({
    type = 'ON_MESSAGE',
    message = {
      templateId = 'print',
      multiline = true,
      args = { msg },
      mode = '_global'
    }
  })
end)

local addMessage = function(message)
  if type(message) == 'string' then
    message = {
      args = { message }
    }
  end

  SendNUIMessage({
    type = 'ON_MESSAGE',
    message = message
  })
end

exports('addMessage', addMessage)
AddEventHandler('chat:addMessage', addMessage)

local addSuggestion = function(name, help, params)
  SendNUIMessage({
    type = 'ON_SUGGESTION_ADD',
    suggestion = {
      name = name,
      help = help,
      params = params or nil
    }
  })
end

exports('addSuggestion', addSuggestion)
AddEventHandler('chat:addSuggestion', addSuggestion)

AddEventHandler('chat:addSuggestions', function(suggestions)
  SendNUIMessage({
    type = 'ON_SUGGESTION_ADD',
    suggestion = suggestions
  })
end)

AddEventHandler('chat:removeSuggestion', function(name)
  SendNUIMessage({
    type = 'ON_SUGGESTION_REMOVE',
    name = name
  })
end)

AddEventHandler('chat:addMode', function(mode)
  SendNUIMessage({
    type = 'ON_MODE_ADD',
    mode = mode
  })
end)

AddEventHandler('chat:removeMode', function(name)
  SendNUIMessage({
    type = 'ON_MODE_REMOVE',
    name = name
  })
end)

AddEventHandler('chat:addTemplate', function(id, html)
  SendNUIMessage({
    type = 'ON_TEMPLATE_ADD',
    template = {
      id = id,
      html = html
    }
  })
end)

AddEventHandler('chat:clear', function(name)
  SendNUIMessage({
    type = 'ON_CLEAR'
  })
end)

RegisterRawNuiCallback('chatResult', function(requestData, cb)
  local resource = requestData.resource
  local securityDisabled = UsePreSecurityBehavior();

  if resource == nil and not securityDisabled then
    return
  end
  
  chatInputActive = false
  SetNuiFocus(false)
  
  local data = json.decode(requestData.body)
  
  if not data.canceled then
    if data.message:sub(1, 1) == '/' then
      if resource == currentResourceName or securityDisabled then
        ExecuteCommand(data.message:sub(2))
      end
    else
      local id = PlayerId()
      local r, g, b = 0, 0x99, 255
      TriggerServerEvent('_chat:messageEntered', GetPlayerName(id), { r, g, b }, data.message, data.mode)
    end
  end
  
  cb({ body = 'ok' })
end)

local function refreshCommands()
  if GetRegisteredCommands then
    local registeredCommands = GetRegisteredCommands()

    local suggestions = {}

    for _, command in ipairs(registeredCommands) do
        if IsAceAllowed(('command.%s'):format(command.name)) and command.name ~= 'toggleChat' then
            table.insert(suggestions, {
                name = '/' .. command.name,
                help = ''
            })
        end
    end

    TriggerEvent('chat:addSuggestions', suggestions)
  end
end

local function refreshThemes()
  local themes = {}

  for resIdx = 0, GetNumResources() - 1 do
    local resource = GetResourceByFindIndex(resIdx)

    if GetResourceState(resource) == 'started' then
      local numThemes = GetNumResourceMetadata(resource, 'chat_theme')

      if numThemes > 0 then
        local themeName = GetResourceMetadata(resource, 'chat_theme')
        local themeData = json.decode(GetResourceMetadata(resource, 'chat_theme_extra') or 'null')

        if themeName and themeData then
          themeData.baseUrl = 'nui://' .. resource .. '/'
          themes[themeName] = themeData
        end
      end
    end
  end

  SendNUIMessage({
    type = 'ON_UPDATE_THEMES',
    themes = themes
  })
end

AddEventHandler('onClientResourceStart', function(resName)
  Wait(500)

  refreshCommands()
  refreshThemes()
end)

AddEventHandler('onClientResourceStop', function(resName)
  Wait(500)

  refreshCommands()
  refreshThemes()
end)

RegisterNUICallback('loaded', function(data, cb)
  TriggerServerEvent('chat:init')

  refreshCommands()
  refreshThemes()

  chatLoaded = true
  cb('ok')
end)

CreateThread(function()
  SetTextChatEnabled(false)
  SetNuiFocus(false)
end)

local function openChatInput()
  if not chatLoaded or chatInputActive then
    return
  end

  if LUIRadialOpen then
    return
  end

  chatInputActive = true

  SendNUIMessage({
    type = 'ON_OPEN'
  })

  SetNuiFocus(true)
end

RegisterCommand('chatInput', openChatInput, false)

if RegisterKeyMapping then
  RegisterKeyMapping('chatInput', 'Open chat', 'keyboard', 't')
end
