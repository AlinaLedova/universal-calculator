<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Creator for UniCalc</title>
    <link rel="stylesheet" type="text/css" href="../../style/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="../../style/all.min.css">
    <link rel="stylesheet" type="text/css" href="style/style.css">
</head>
<body>
<div class="container">
    <div class="row">
        <header class="col-12">
            <h1 class="text-success">UNICALC Creator v.0.7</h1>
        </header>
    </div>
    <div class="row">
        <div class="col-12">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">Calc ID</span>
                </div>
                <input type="text" class="form-control" data-bind="textInput: id">
            </div>
        </div>
    </div>
    <fieldset>
        <legend>Form</legend>
        <div class="row">
            <div class="col-4">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">ID</span>
                    </div>
                    <input class="form-control" data-bind="textInput: params.id">
                </div>
            </div>
            <div class="col-4">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Action</span>
                    </div>
                    <input class="form-control" data-bind="textInput: params.action">
                </div>
            </div>
            <div class="col-4">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Method</span>
                    </div>
                    <select class="form-control" data-bind="options: Object.values(AllowedFormSubmissionMethods), optionsText: Object.keys(AllowedFormSubmissionMethods), value: params.method"></select>
                </div>
            </div>
        </div>
    </fieldset>
    <fieldset>
        <legend>Columns</legend>
        <div class="row">
            <div class="col-12 p-2">
                <button class="btn btn-success" data-bind="click: ()=>AddColumn()"><i class="far fa-plus fa-fw"></i>Add New Column</button>
            </div>
        </div>
        <div class="row" data-bind="foreach: { data: columns, as: 'column' }">
            <div class="col border-right border-info">
                <fieldset>
                    <legend class="border-bottom border-info p-2">
                        Column #<span data-bind="text: $index()"></span>
                        <button title="Remove Column" class="btn btn-sm btn-outline-danger" data-bind="click: ()=>$root.RemoveColumn(column)"><i class="far fa-trash fa-fw"></i></button>
                    </legend>
                    <div class="row">
                        <div class="col-12">
                            <button title="Move to First" class="btn btn-sm btn-outline-info" data-bind="click: ()=>$root.MoveColumnToTop($data)"><i class="far fa-arrow-to-left fa-fw"></i></button>
                            <button title="Move left" class="btn btn-sm btn-outline-info" data-bind="click: ()=>$root.MoveColumnUp($data)"><i class="far fa-arrow-left fa-fw"></i></button>
                            <button title="Move right" class="btn btn-sm btn-outline-info" data-bind="click: ()=>$root.MoveColumnDown($data)"><i class="far fa-arrow-right fa-fw"></i></button>
                            <button title="Move to Last" class="btn btn-sm btn-outline-info" data-bind="click: ()=>$root.MoveColumnToBottom($data)"><i class="far fa-arrow-to-right fa-fw"></i></button>
                        </div>
                    </div>
                    <!-- ko foreach: {data: column.tags, as: 'tag'} -->
                    <div class="row">
                        <div class="col-12">
                            <fieldset class="border rounded border-primary p-1">
                                <legend class="p-1 ml-3 w-auto">
                                    <span data-bind="text: `&lt;${tag.tagname}&gt;  #${$index()}`"></span>
                                    <button title="Remove Tag" class="btn btn-sm btn-outline-danger" data-bind="click: ()=>$parent.RemoveTag(tag)"><i class="far fa-trash fa-fw"></i></button>
                                </legend>
                                <div class="row">
                                    <div class="col-12">
                                        <button title="Move to Top" class="btn btn-sm btn-outline-info" data-bind="click: ()=>$parent.MoveTagToTop($data)"><i class="far fa-arrow-to-top fa-fw"></i></button>
                                        <button title="Move up" class="btn btn-sm btn-outline-info" data-bind="click: ()=>$parent.MoveTagUp($data)"><i class="far fa-arrow-up fa-fw"></i></button>
                                        <button title="Move down" class="btn btn-sm btn-outline-info" data-bind="click: ()=>$parent.MoveTagDown($data)"><i class="far fa-arrow-down fa-fw"></i></button>
                                        <button title="Move to Bottom" class="btn btn-sm btn-outline-info" data-bind="click: ()=>$parent.MoveTagToBottom($data)"><i class="far fa-arrow-to-bottom fa-fw"></i></button>
                                    </div>
                                </div>
                                <!-- ko template: {name: `Tag${tag.tagname.toUCFirst()}`, data: tag}-->
                                <!-- /ko -->
                            </fieldset>
                        </div>
                    </div>
                    <!-- /ko -->
                </fieldset>
                <fieldset class="mt-5">
                    <legend>Add Element</legend>
                    <div class="row">
                        <div class="col-12">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text">Create: </span>
                                </div>
                                <select class="form-control" data-bind="options: Object.values(AllowedTagNames), optionsText: Object.keys(AllowedTagNames), value: $context.tagname"></select>
                                <button title="Add Tag" class="btn btn-info input-group-append" data-bind="click: ()=>column.AddTag($context.tagname)"><i class="fa fa-fw fa-edit"></i></button>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    </fieldset>
    <hr class="mt-5">
    <fieldset>
        <legend>Result:</legend>
        <button class="btn btn-success" data-bind="click: ()=>toJSON()"><i class="far fa-save fa-fw"></i>Export to JSON</button>
        <!--<button class="btn btn-info" data-bind="click: ()=>getData()"><i class="far fa-eye fa-fw"></i>Preview</button>-->
        <span data-bind="if: DownloadData"><a class="btn btn-primary text-light" data-bind="BlobDownload: DownloadData"><i class="fas fa-fw fa-download"></i></a></span>
    </fieldset>
</div>

<!-- TEMPLATES START -->
<template id="TagInput">
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">ID</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.id">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Name</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.name">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Type</span>
        </div>
        <select class="form-control" data-bind="options: Object.values(AllowedInputTypes), optionsText: Object.keys(AllowedInputTypes), value: $data.params.type"></select>
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Value</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.value">
    </div>
</template>

<template id="TagButton">
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">ID</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.id">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Name</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.name">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Type</span>
        </div>
        <select class="form-control" data-bind="options: Object.values(AllowedButtonTypes), optionsText: Object.keys(AllowedButtonTypes), value: $data.params.type"></select>
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Button Text</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.innerText">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Role</span>
        </div>
        <select class="form-control" data-bind="options: Object.values(AllowedButtonRoles), optionsText: Object.keys(AllowedButtonRoles), value: $data.params.role"></select>
    </div>
</template>

<template id="TagSelect">
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">ID</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.id">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Name</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.name">
    </div>
    <fieldset class="border rounded border-info p-1">
        <legend class="p-1 ml-3 w-auto">Options:</legend>
        <!-- ko foreach: { data: $data.params.options } -->
        <div class="border rounded p-1">
            <legend>Option #<span data-bind="text: $index()"></span></legend>
            <button class="btn btn-sm btn-outline-danger" data-bind="click: ()=>$parent.params.RemoveOption($data)"><i class="far fa-fw fa-trash"></i></button>
            <button class="btn btn-sm btn-outline-info" data-bind="click: ()=>$parent.params.MoveUp($data)"><i class="far fa-fw fa-arrow-up"></i></button>
            <button class="btn btn-sm btn-outline-info" data-bind="click: ()=>$parent.params.MoveDown($data)"><i class="far fa-fw fa-arrow-down"></i></button>
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">Value:</span>
                </div>
                <input class="form-control input-group-append" data-bind="textInput: $data.value">
            </div>
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">Desctiption:</span>
                </div>
                <input class="form-control input-group-append" data-bind="textInput: $data.description">
            </div>
        </div>
        <!-- /ko -->
        <button class="btn btn-sm btn-info" data-bind="click: ()=>$data.params.AddOption()"><i class="fa fa-fw fa-edit"></i></button>
    </fieldset>
</template>

<template id="TagTextarea">
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">ID</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.id">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Name</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.name">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Inner Text</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.innerText">
    </div>
    <div class="row">
        <div class="col-6">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">Rows</span>
                </div>
                <input class="form-control" type="number" min="0" data-bind="textInput: $data.params.rows">
            </div>
        </div>
        <div class="col-6">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">Cols</span>
                </div>
                <input class="form-control" type="number" min="0" data-bind="textInput: $data.params.cols">
            </div>
        </div>
    </div>
</template>

<template id="TagProgress">
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">ID</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.id">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Name</span>
        </div>
        <input class="form-control" data-bind="textInput: $data.params.name">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Max</span>
        </div>
        <input class="form-control" type="number" data-bind="textInput: $data.params.max">
    </div>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">Value</span>
        </div>
        <input type="number" class="form-control" data-bind="textInput: $data.params.value">
    </div>
</template>
<!-- TEMPLATES END -->

<script type="text/javascript" src="../../js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="../../js/knockout-3.5.0.js"></script>
<script type="text/javascript" src="../../js/extended.js"></script>
<script type="text/javascript" src="../../js/main.js"></script>
<script type="text/javascript" src="../../js/FileSaver.js"></script>
<script type="text/javascript" src="js/unicalc.js"></script>
<script>
    console.clear();
    let calculator = new Generator();
    ko.applyBindings(calculator);
</script>
</body>
</html>
