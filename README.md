# simple-html-form

# link to the site
[https://jakic12.github.io/simple-html-form/](https://jakic12.github.io/simple-html-form/)

# How it works
The form generates by the code specified in `js/fields.js`

## How to write your own fields.js array
FieldGroups is an array of `fieldGroups`. Every field group must have an unique id. FieldGroups must start with an `fieldGroup` of an id `greet` and end with an id of `finish`;

---
# Types of field Groups

## greet

`id` **String** greet  
`groupName` **String** The text that will appear at the sidebar
`title` **String** The title that appears on the page  
`subtitle` **String** The subtitle that appears on the page  
`btnText` **String** The text that appears on the submit button on the page


## custom

`id` **String** unique identifier of the group  
`groupName` **String** The text that will appear at the sidebar
`fields` **Array** Array of [fields](#types-of-fields)  
`passParam` **Function** *optional* Function that gets called after a form group gets submitted, data is passed to the function as the first argument. If the function returns true, the formGroup passes, if not, it does not.


## finish

`id` **String** finish  
`groupName` **String** The text that will appear at the sidebar
`title` **String** The title that appears on the page  
`subtitle` **String** The subtitle that appears on the page  
`btnText` **String** The text that appears on the submit button on the page

---
# Types of fields
The specified element gets put in a card with an icon

## input field
`fieldName` **String** the name property of the input element  
`placeholder` **String** placeholder property of the input element
`inputType` **String** type property of the input element
`iconSrc` **Url** *optional* the src of the icon  
`required` **boolean** *optional* required property of the input element


## custom field
`tagType` **String** the dom element (div, select...)  
`fieldName` **String** the name property of the input element  
`children` **Array\<CustomFieldChild\>** an array of children that will be put in as children of the created element
* `CustomFieldChild` **Object**
  + `tagType` **String** the dom element (div, select...)
  + `props` **Object** Object of props to get applied to the created child element
  + `text` **String** text in the created element