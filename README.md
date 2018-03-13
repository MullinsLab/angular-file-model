# File Model: A bridge between File objects and your AngularJS components

This is an [AngularJS][] module containing two generic directives which provide
easy access to browser-created File objects either from `<input type="file">`
elements or drag-and-drop events.

The original version was written for our [TCozy][] application and then made
its way into [Methylation Station][] where additional behaviour was added,
before finally being extracted into a separate component for reuse in
[Viroverse][].  The first version was loosely based on [a snippet from Uncorked
Studios][].


[AngularJS]: https://angularjs.org
[TCozy]: https://mullinslab.microbiol.washington.edu/tcozy/
[Methylation Station]: https://indra.mullins.microbiol.washington.edu/methylation-station/
[Viroverse]: https://viroverse.washington.edu
[a snippet from Uncorked Studios]: https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs


## Usage

The `file-model` directive provides access from within an Angular scope to the
native [HTML File object][File] from an `<input type="file">` element.

The `file-drop` directive does the same for drag-and-drop events on an element.

At a minimum, register the primary directive with the `file-model` or
`file-drop` attributes.  These attributes and others may have optional values
for additional behaviour.

The directives themselves may take a model variable which will be one-way bound
to a File object as appropriate.  **Caution!**  AngularJS documentation claims
that it can't watch File objects properly since it can't copy them.  You should
consider using `file-data` instead.

    file-model="model.file"
    file-drop="model.file"

Other attributes provide easy ways to extract values from the File object:

    file-name="model.name"    # One-way binds the File object's name property to a model variable
    file-data="model.data"    # One-way binds the File object's data to a model variable
    file-data-as="Text"       # Determines how to read data for file-data: DataURL (default) or Text

Note that one-way binding in this context means the file input element or drop
event updates the model variables but not vice versa.

Instead of using an assignable model variable, you may also provide a
non-assignable expression which will be called with a "file", "name", or "data"
variable in scope:

    file-drop="model.parseFile(file)"
    file-name="model.setFileName(name)"
    file-data="model.setFileContents(data)"

A similar effect can be accomplished by passing an assignable model variable
which is defined as a getter/setter on your model object.

Note that multiple files are not supported at this time, although both file
inputs and drag-and-drop events support FileList objects.


[File]: https://developer.mozilla.org/en-US/docs/Web/API/File


## Styling

The class `.file-drop-hover` is applied on a `file-drop` directive's element
when a drag-and-drop operation is active and hovering over the dropzone.  This
is useful for indicating via a visual change that the dropzone is a droppable
area to the user.
