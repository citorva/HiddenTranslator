class Translator {
    api_key : string;

    constructor(key : string) {
        this.api_key = key;
    }

    private static get_text_array() {
        function recursive_gettext (dom_element : ChildNode,
                                    text_array : Array<string>) {
            let childrens = dom_element.childNodes;

            childrens.forEach(element => {
                if (element.nodeType == Node.TEXT_NODE) {
                    if (element.textContent != "" && Translator.check_text(element.textContent))
                            text_array.push(element.textContent);
                }
                else if (element.nodeType != Node.COMMENT_NODE && element.nodeName != "script" && element.nodeName != "style")
                    recursive_gettext(element, text_array);
            });
        }

        let text_array = new Array<string>();

        recursive_gettext(document.body, text_array);

        return text_array;
    }

    private static replace_text_by_map(dat : Map<string, string>) {
        function recursive_replace (dom_element : ChildNode,
                                    dat : Map<string, string>) {
            let childrens = dom_element.childNodes;

            childrens.forEach(element => {
                if (element.nodeType == Node.TEXT_NODE) {
                    if (dat.has(element.textContent))
                        element.replaceWith(dat.get(element.textContent));
                }
                else
                    recursive_replace(element, dat);
            });
        }

        recursive_replace(document.body, dat);
    }

    private static to_string(dat : Array<string>) {
        let ret = "";

        for (var i  = 0; i < dat.length; i++) {
            if (i != 0) ret += "\r\n<>\r\n";
            ret += dat[i].replace("\"", "\\\"")
        }

        return ret;
    }

    private static to_array(dat : string) {

        return dat.split("\r\n<>\r\n");
    }

    private static check_text(text : string) {
        for (var i = 0; i < text.length; i++) {
            if (text[i] != '\n' && text[i] != ' ')
                return true;
        }
        return false;
    }
    
    private get_translation_map(from : string, to : string, dat : Array<string>) {
        if (from == to) return null;

        let text = Translator.to_string(dat);

        let query_dat = new FormData();

        query_dat.append("q", text);
        query_dat.append("target", to);
        query_dat.append("format", "text");
        query_dat.append("source", from);
        query_dat.append("key", this.api_key);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "https://translation.googleapis.com/language/translate/v2?key="+this.api_key, false);
        xhr.send(query_dat);

        if (xhr.status == 200) {
            let data = JSON.parse(xhr.responseText);

            try {
                let tmp = Translator.to_array(data.data.translations[0].translatedText);
                let ret = new Map<string, string>();

                for (var i = 0; i < dat.length; i++) {
                    ret.set(dat[i], tmp[i]);
                }

                return ret;
            } catch {
                return null;
            }
        } else {
            return null;
        }
    }

    public check_lang() {
        let text = Translator.to_string(Translator.get_text_array());

        let query_dat = new FormData();

        query_dat.append("q", text);
        query_dat.append("key", this.api_key);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "https://translation.googleapis.com/language/translate/v2/detect?key="+this.api_key, false);
        xhr.send(query_dat);

        if (xhr.status == 200) {
            let dat = JSON.parse(xhr.responseText);

            try {
                return dat.data.detections[0][0].language;
            } catch {
                return null;
            }
        } else {
            return null;
        }
    }

    public available_lang() {
        let query_dat = new FormData();

        query_dat.append("key", this.api_key);

        let xhr = new XMLHttpRequest();
        xhr.open("GET", "https://translation.googleapis.com/language/translate/v2/languages?key="+this.api_key, false);
        xhr.send(query_dat);

        if (xhr.status == 200) {
            let dat = JSON.parse(xhr.responseText);

            try {
                return dat.data.languages;
            } catch {
                return null;
            }
        } else {
            return null;
        }
    }

    public translate_page(from : string, to : string) {
        if (from == to) return false;

        let translation_map = this.get_translation_map(from, to,
                                Translator.get_text_array());

        if (translation_map == null) return false;

        Translator.replace_text_by_map(translation_map);

        return true;
    }
}
