/*
 index.js - ESP3D WebUI initialization file

 Copyright (c) 2020 Luc Lebosse. All rights reserved.

 This code is free software; you can redistribute it and/or
 modify it under the terms of the GNU Lesser General Public
 License as published by the Free Software Foundation; either
 version 2.1 of the License, or (at your option) any later version.

 This code is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public
 License along with This code; if not, write to the Free Software
 Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

"use strict"
import { setLang } from "../translations"
import { SendCommand, SendGetHttp, SendPostHttp } from "../http"
import { T } from "../translations"
import { applyConfig } from "../app"
import { setcurrentprefs } from "../settings"
import { setupWebSocket } from "../websocket"
import { showDialog } from "../dialog"

/*
 * Local variables
 *
 */
let preferences

/*
 * Some constants
 */
const default_preferences =
    '{"settings":{"language":"en","banner": "true","autoload" : "true"}}'
const preferencesFileName = "preferences.json"

/*
 * Function starting initialization
 */
function initApp() {
    preferences = JSON.parse(default_preferences)
    document.title = document.location.host
    showDialog({ type: "loader" })
    loadPreferences()
}

/*
 * To copy new preferences
 */
function setPreferences(data) {
    if (!data.settings) return false
    preferences = data
    return true
}

/*
 * Load Language
 */
function loadLanguage(lang) {
    const url = "/" + lang + ".json" + "?" + Date.now()
    SendGetHttp(url, loadLanguageSuccess, loadLanguageError)
    console.log("load language file " + "/" + lang + ".json")
}

/*
 * Load Language query success
 */
function loadLanguageSuccess(responseText) {
    try {
        let langressource = JSON.parse(responseText)
        setLang(preferences.settings.language, langressource)
        loadConfig()
    } catch (err) {
        console.log("error")
        console.log(responseText)
        showDialog({
            type: "error",
            numError: err,
            message: T("S7"),
            next: loadConfig,
        })
    }
}

/*
 * Load Language query error
 */
function loadLanguageError(errorCode, responseText) {
    console.log(
        "no valid /" +
            preferences.settings.language +
            ".json.gz file, use default"
    )
    loadConfig()
}

/*
 * Load Preferences query success
 */
function loadPreferencesSuccess(responseText) {
    try {
        preferences = JSON.parse(responseText)
        setcurrentprefs(preferences)
        if (preferences.settings.language != "en")
            loadLanguage(preferences.settings.language)
        else loadConfig()
    } catch (err) {
        console.log("error")
        console.log(responseText)
        showDialog({
            type: "error",
            numError: err,
            message: T("S7"),
            next: loadConfig,
        })
    }
}

/*
 * Load Preferences query error
 */
function loadPreferencesError(errorCode, responseText) {
    console.log("no valid " + preferencesFileName + ", use default")
    setcurrentprefs(preferences)
    loadConfig()
}

/*
 * Load Preferences
 */
function loadPreferences() {
    const url = "/preferences.json?" + Date.now()
    SendGetHttp(url, loadPreferencesSuccess, loadPreferencesError)
    console.log("load preferences")
}

/*
 * Load Firmware settings
 */
function loadConfig() {
    var d = new Date()
    var PCtime =
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0") +
        "-" +
        String(d.getHours()).padStart(2, "0") +
        "-" +
        String(d.getMinutes()).padStart(2, "0") +
        "-" +
        String(d.getSeconds()).padStart(2, "0")
    const cmd = encodeURIComponent("[ESP800]" + "time=" + PCtime)
    showDialog({ type: "loader", message: T("S1") })
    console.log("load FW config")
    SendCommand(cmd, loadConfigSuccess, loadConfigError)
}

/*
 * Load Firmware settings query success
 */
function loadConfigSuccess(responseText) {
    var data = {}
    try {
        data = JSON.parse(responseText)
        applyConfig(data)
        if (data.WebSocketIP && data.WebCommunication && data.WebSocketport) {
            setupWebSocket(
                data.WebCommunication,
                data.WebSocketIP,
                data.WebSocketport
            )
        }
    } catch (e) {
        console.log("Parsing error:", e)
        console.log(responseText)
        showDialog({ type: "error", numError: e, message: T("S4") })
    }
}

/*
 * Load Firmware settings query error
 */
function loadConfigError(errorCode, responseText) {
    showDialog({ type: "error", numError: errorCode, message: T("S5") })
}

export { initApp, preferences, preferencesFileName, setPreferences }
