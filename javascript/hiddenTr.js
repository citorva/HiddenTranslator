/*!
 * HiddenTranslator JavaScript Library v0.1.0
 * https://github.com/citorva/HiddenTranslator/
 *
 * Copyright Citorva
 * Released under the GNU GPL v3 License
 *
 * Date: 2019-04-14T16:57Z
 */
var Translator = /** @class */ (function () {
    function Translator(key) {
        this.api_key = key;
    }
    Translator.get_text_array = function () {
        function recursive_gettext(dom_element, text_array) {
            var childrens = dom_element.childNodes;
            childrens.forEach(function (element) {
                if (element.nodeType == Node.TEXT_NODE) {
                    if (element.textContent != "" && Translator.check_text(element.textContent))
                        text_array.push(element.textContent);
                }
                else if (element.nodeType != Node.COMMENT_NODE && element.nodeName != "script" && element.nodeName != "style")
                    recursive_gettext(element, text_array);
            });
        }
        var text_array = new Array();
        recursive_gettext(document.body, text_array);
        return text_array;
    };
    Translator.replace_text_by_map = function (dat) {
        function recursive_replace(dom_element, dat) {
            var childrens = dom_element.childNodes;
            childrens.forEach(function (element) {
                if (element.nodeType == Node.TEXT_NODE) {
                    if (dat.has(element.textContent))
                        element.replaceWith(dat.get(element.textContent));
                }
                else
                    recursive_replace(element, dat);
            });
        }
        recursive_replace(document.body, dat);
    };
    Translator.to_string = function (dat) {
        var ret = "";
        for (var i = 0; i < dat.length; i++) {
            if (i != 0)
                ret += "\r\n<>\r\n";
            ret += dat[i].replace("\"", "\\\"");
        }
        return ret;
    };
    Translator.to_array = function (dat) {
        return dat.split("\r\n<>\r\n");
    };
    Translator.check_text = function (text) {
        for (var i = 0; i < text.length; i++) {
            if (text[i] != '\n' && text[i] != ' ')
                return true;
        }
        return false;
    };
    Translator.prototype.check_lang = function () {
        var text = Translator.to_string(Translator.get_text_array());
        var query_dat = new FormData();
        query_dat.append("q", text);
        query_dat.append("key", this.api_key);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://translation.googleapis.com/language/translate/v2/detect?key="+this.api_key, false);
        xhr.send(query_dat);
        if (xhr.status == 200) {
            var dat = JSON.parse(xhr.responseText);
            try {
                return dat.data.detections[0][0].language;
            }
            catch (_a) {
                return null;
            }
        }
        else {
            return null;
        }
    };
    Translator.prototype.available_lang = function () {
        var query_dat = new FormData();
        query_dat.append("key", this.api_key);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://translation.googleapis.com/language/translate/v2/languages?key="+this.api_key, false);
        xhr.send(query_dat);
        if (xhr.status == 200) {
            var dat = JSON.parse(xhr.responseText);
            try {
                return dat.data.languages;
            }
            catch (_a) {
                return null;
            }
        }
        else {
            return null;
        }
    };
    Translator.prototype.get_translation_map = function (from, to, dat) {
        if (from == to)
            return null;
        var text = Translator.to_string(dat);
        var query_dat = new FormData();
        query_dat.append("q", text);
        query_dat.append("target", to);
        query_dat.append("format", "text");
        query_dat.append("source", from);
        query_dat.append("key", this.api_key);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://translation.googleapis.com/language/translate/v2", false);
        xhr.send(query_dat);
        if (xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            try {
                var tmp = Translator.to_array(data.data.translations[0].translatedText);
                var ret = new Map();
                for (var i = 0; i < dat.length; i++) {
                    ret.set(dat[i], tmp[i]);
                }
                return ret;
            }
            catch (_a) {
                return null;
            }
        }
        else {
            return null;
        }
    };
    Translator.prototype.translate_page = function (from, to) {
        if (from == to)
            return false;
        var translation_map = this.get_translation_map(from, to, Translator.get_text_array());
        if (translation_map == null)
            return false;
        Translator.replace_text_by_map(translation_map);
        return true;
    };
    return Translator;
}());
