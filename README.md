# [OriginStamp](http://originstamp.org)

The OriginStamp JavaScript Plugin provides the background-creation of timestamps. According to the explanations on www.originstamp.org the trusted timestamps are submitted to the Bitcoin blockchain.

## Table of contents

 - [Documentation](#documentation)
 - [Contributing](#contributing)

## Documentation

For a quickstart add the following line to your JavaScript

1. `OriginStamp.init();`
2. Add the data-attributes to your form fields. (See an example file)
3. Add the CSS selector to your form

### Overrides

Overrides allow to bind custom success/error callbacks and the elment selector for the form.

| Option        | Type          | Default                                                  | Description |
| ------------- | ------------- | -------------------------------------------------------- | ----------- |
| success       | method        | `function(element, xhr) { element.submit() }`            | The success callback. If you want to submit the form after creating the stamp add `element.submit()` at the end. |
| error         | method        | `function(element, xhr, errors) { console.log(errors) }` | The error callback. |
| selector      | string        | `.originstamp`                                           | The form selector accordlingly to [document.querySelectorAll(*your-selector*)](https://developer.mozilla.org/en-US/docs/Web/API/Document.querySelectorAll) |


### Available data-attributes

Forms need to be extended by the OriginStamp data-attributes. E.g. `data-originstamp="content"` specifies the field which the SHA256 hash gets generated from.

| Attribute | Description |
| ----------| ----------- |
| content   | The input field or textarea you want to get hashed.
| response  | A Checkbox wether the user should be able to decide if he wants to get a copy of his data by email. **This requires to send the data to our server**. |
| sender    | An email address |
| title     | An optional title which is visible to everyone on originstamp.org |

## Contributing

Since this project is in an early stage, every feedback und contribution is welcome. Feel free to send your issues, feature wishes and pull requests.
