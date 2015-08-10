# Proposed Features #
### File Type Validation ###
Can already be done manually using onSelect callback, but it would be handy to provide an easy way to add accepted file extensions.

eg.
```
$(element).upload({
    fileTypes: ['jpg', 'gif', 'png']
});
```

What would happen if the user selects an invalid filetype? add a callback function so the developer can decide?
### File Que ###
Could use one upload element to select more than one file at a time and submit them at the same time. Could keep track of what files are in the que and remove files if needed.
### Mouseover/Hover Effects ###
#### Problem ####
Because the input form is placed over top of the element with opacity 0 the hover effects of the underlying element are ignored.
#### Solutions ####
Maybe it is possible to read the css of the underlying element and apply the hover styles manually when the mouse is in the area of the element?

### Mouseover Icon ###
#### Problem ####
File input element does not support changing the cursor
#### Solutions ####
It may be helpful to place a small image beside the cursor when mousing over the element?