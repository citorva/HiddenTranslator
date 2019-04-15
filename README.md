# HiddenTranslator

An easy to use class used to create a translating system under google translate service.

# Example

This example uses the file `hiddenTr.min.js` located at `javascript`. It automatically translates a page from english to french:

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

This script requires a Google API key used to manage Google service usage and service shipping. The use of google service is not free and this key is private. To prevent any inconveniences, read the `Securing an API key` in the API key documentation or follow this [link](https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key).

# Documentation

This script provides these functions:

 * `constructor(key : string)` The constructor of the object. The `key` argument is a Google API key. The page https://cloud.google.com/docs/authentication/api-keys helps you to create an API key.
 * `check_lang()` This function get page text and asks Google in what lang is this page. It returns a string with the language code like `en` for English. See  https://cloud.google.com/translate/docs/reference/rest/v2/translate for more information.
 * `available_lang()` This function list all langs currently available on Google Translation service. See https://cloud.google.com/translate/docs/reference/rest/v2/languages for more information
 * `translate_page(from : string, to : string)` This function translates the page using a language defined in `from` to the new language defined in `to`. Normally, `from` needs to be the language code given by `check_lang` method. See https://cloud.google.com/translate/docs/reference/rest/v2/translate for more information.
