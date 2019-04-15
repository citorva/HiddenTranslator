# HiddenTranslator
A simple to use class used to create a translate system under google translate service.

# Example

This example uses the file `hiddenTr.min.js` located at `javascript`. It automatically translate a page from en to fr:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- Headings -->
    <script src="js/hiddenTr.min.js"></script>
  </head>
  <body>
    <!-- Page content -->
    <script type="text/javascript">
      let google_api_key = ""; // This key is required to use the google service to translate the page
      let translator = new Translator(google_api_key); // Create the object with the given google api key
      translator.translate_page("en", "fr"); // Translate the page
    </script>
  </body>
</html>
```

# Security issue

This script requires a google api key used to manage google service usage and service shipping. The use of google service is not free and this key is private. As a consequence, you need to limit the code usage for your site.

# Documentation

This script provides thes functions:

 * `constructor(key : string)` The constructor of the object. The `key` argument is a google api key. The page https://cloud.google.com/docs/authentication/api-keys helps you to create an API key.
 * `check_lang()` This function get page text and asks to google in what lang is this page. It return string with the language code like `en` for English. See  https://cloud.google.com/translate/docs/reference/rest/v2/translate for more informations.
 * `available_lang()` This function list all langs currently available on Google Translation service. See https://cloud.google.com/translate/docs/reference/rest/v2/languages for more informations
 * `translate_page(from : string, to : string)` This function translate the page usign a langage defined in `from` to the new langage defined in `to`. Normally, `from` needs to be the langage code given by `check_lang` method. See https://cloud.google.com/translate/docs/reference/rest/v2/translate for more information.
