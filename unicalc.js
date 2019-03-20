/************************
*   FORM-Constructor
************************/

let SendFunctionName = 'SendToServer';

function createForm(jsonStr)
{
    let json = JSON.parse(jsonStr);

    let container = document.getElementById(json.id);
    let form = document.createElement('form');
    let formParams = json.params;

    if (!formParams.isEmpty())
    {
        for (let key in formParams)
        {
            if (formParams.hasOwnProperty(key))
                form.setAttribute(key, formParams[key]);
        }
    }

    let formId;
    if (form.hasAttribute("id"))
        formId = form.getAttribute("id");
    else
        formId = 'unicalc';

    let columns = json.columns;
    if (typeof columns === "number" && columns > 0)
    {
        let i;
        for (i = 0; i<columns; i++)
        {
            let col = json[`col${i}`];
            let columnWrap = document.createElement('div');
            columnWrap.setAttribute('class', `column col${i}`)

            if (!col.isEmpty())
            {
                for (let key in col)
                {
                    let tag;
                    if (col.hasOwnProperty(key))
                    {
                        tag = createTag(col[key].tagname, col[key].params, formId);
                        columnWrap.appendChild(tag);
                    }
                }
            }
            form.appendChild(columnWrap);
        }
    }

    container.appendChild(form);
}

function createTag(tagname, params, id)
{
    logDebug("In CreateTag func: ", tagname, params)
    let tag = document.createElement(tagname);

    for (let param in params)
    {
        if (params.hasOwnProperty(param))
        {
            tag.setAttribute(param, params[param], id);

            if (param === "role" && params[param] === "send")
                tag = addBtnFunction(tag, id);
        }
    }
    return tag;
}

function addBtnFunction(tag, id)
{
    tag.setAttribute('onclick', `${SendFunctionName}("${id}")`);
    return tag;
}


/******************************************
*   JSON-generator (KnockOut 3.5.0. used)
******************************************/

/*** Definitions ***/

const AllowedFormSubmissionMethods = {
    get GET() {return 'get'},
    get POST() {return 'post'}
};

const AllowedTagNames = {
    get INPUT() {return "input"},
    get BUTTON() {return "button"},
    get SELECT() {return "select"},
    get TEXTAREA() {return "textarea"},
    get PROGRESS() {return "progress"}
};

const AllowedInputTypes = {
    get TEXT() {return "text"},
    get PASSWORD() {return "password"},
    get BUTTON() {return "button"},
    get SUBMIT() {return "submit"},
    get CHECKBOX() {return "checkbox"},
    get RADIO() {return "radio"},
    get RESET() {return "reset"}
};

const AllowedButtonTypes = {
    get BUTTON() {return "button"},
    get SUBMIT() {return "submit"},
    get RESET() {return "reset"}
};

const AllowedButtonRoles = {
    get NONE() {return String.Empty},
    get SEND() {return "send"}
};

/*** Configuration ***/

const DefaultFormSubmissionMethod = AllowedFormSubmissionMethods.POST;
const DefaultInputType = AllowedInputTypes.TEXT;
const DefaultButtonType = AllowedButtonTypes.BUTTON;
const DefaultAction = "#";
const DefaultRole = AllowedButtonRoles.NONE;

/*** Tag Parameters ***/

class TagParams
{
    constructor()
    {
        this.id = ko.observable(String.Empty);
        this.name = ko.observable(String.Empty);
    }
}

class TagInputParams extends TagParams
{
    constructor()
    {
        super();
        this.type = ko.observable(DefaultInputType);
        this.value = ko.observable(String.Empty);
    }
}

class TagButtonParams extends TagParams
{
    constructor()
    {
        super();
        this.type = ko.observable(DefaultButtonType);
        this.innerText = ko.observable(String.Empty);
        this.role = ko.observable(DefaultRole);
    }
}

class TagSelectParams extends TagParams
{
    constructor()
    {
        super();
        this.options = ko.observableArray([]);
    }

    AddOption()
    {
        this.options.push(new OptionParams());
    }

    RemoveOption(optionInstance)
    {
        this.options.remove(optionInstance);
    }

    MoveUp(optionInstance)
    {
        let index = this.options.indexOf(optionInstance);
        let newIndex;
        if (index !== 0)
        {
            newIndex = index - 1;
            this.options.splice(index, 1);
            this.options.splice(newIndex, 0, optionInstance);
        }
    }

    MoveDown(optionInstance)
    {
        let index = this.options.indexOf(optionInstance);
        let newIndex;
        if (index !== this.options().length - 1)
        {
            newIndex = index + 1;
            this.options.splice(index, 1);
            this.options.splice(newIndex, 0, optionInstance);
        }
    }
}

class OptionParams
{
    constructor()
    {
        this.value = ko.observable(String.Empty);
        this.description = ko.observable(String.Empty);
    }
}

class TagTextareaParams extends TagParams
{
    constructor()
    {
        super();
        this.innerText = ko.observable(String.Empty);
        this.rows = ko.observable(1);
        this.cols = ko.observable(1);
    }
}

class TagProgressParams extends TagParams
{
    constructor()
    {
        super();
        this.value = ko.observable(0);
        this.max = ko.observable(0);
    }
}

const TagParamsProxy = {TagInputParams,TagButtonParams, TagSelectParams, TagTextareaParams, TagProgressParams};

/*** End Tag Parameters ***/

class TagElement
{
    constructor(tagname)
    {
        this.tagname = tagname;
        this.params = this.getParams(tagname);
    }

    getParams(tagname)
    {
        let ClassName = `Tag${tagname.toUCFirst()}Params`;
        return new TagParamsProxy[ClassName]();
    }
}

class FormParameters
{
    constructor()
    {
        this.id = ko.observable(String.Empty);
        this.method = ko.observable(DefaultFormSubmissionMethod);
        this.action = ko.observable(DefaultAction);
        this.other = ko.observableArray([]);
    }

    toJSON()
    {
        let json = {
            id: this.id(),
            method: this.method(),
            action: this.action()
        };

        if (this.other().length > 0)
        {
            for (let prop in this.other())
            {
                if (this.other().hasOwnProperty(prop))
                    Object.defineProperty(json, Object.keys(this.other()[prop]), {value: Object.values(this.other()[prop]).toString(), enumerable: true});
            }
        }

        return json;
    }
}

class FormColumn {
    constructor() {
        this.tags = ko.observableArray([]);
    }

    AddTag(tagname) {
        this.tags.push(new TagElement(tagname));
    }

    RemoveTag(tagInstance) {
        this.tags.remove(tagInstance);
    }

    MoveTagUp(tagInstance) {
        let index = this.tags.indexOf(tagInstance);
        let newIndex;
        if (index !== 0 && index < this.tags().length)
        {
            newIndex = index - 1;
            this.tags.splice(index, 1);
            this.tags.splice(newIndex, 0, tagInstance);
        }
    }

    MoveTagDown(tagInstance)
    {
        let index = this.tags.indexOf(tagInstance);
        let newIndex;
        if (index !== this.tags().length - 1 && index < this.tags().length)
        {
            newIndex = index + 1;
            this.tags.splice(index, 1);
            this.tags.splice(newIndex, 0, tagInstance);
        }
    }

    MoveTagToTop(tagInstance)
    {
        let index = this.tags.indexOf(tagInstance);
        let newIndex = 0;
        if (index !== 0 && index < this.tags().length)
        {
            this.tags.splice(index, 1);
            this.tags.splice(newIndex, 0, tagInstance);
        }
    }

    MoveTagToBottom(tagInstance)
    {
        let index = this.tags.indexOf(tagInstance);
        let newIndex = this.tags().length - 1;
        if (index !== newIndex && index < this.tags().length)
        {
            this.tags.splice(index, 1);
            this.tags.splice(newIndex, 0, tagInstance);
        }
    }

    toJSON()
    {
        let json = {};

        if (this.tags().length > 0)
        {
            let tag = 1;
            for (let i = 0; i < this.tags().length; i++)
            {
                json[tag] = ko.toJS(this.tags()[i]);
                tag++;
            }
        }

        return json;
    }
}

class Generator
{
    constructor()
    {
        this.id = ko.observable(String.Empty);
        this.params = new FormParameters();
        this.columns = ko.observableArray([]);
        this.DownloadData = ko.observable();
        this.AddColumn();
    }

    getData(filename, json)
    {

        let obj = {
            Data: JSON.stringify(json),
            Mime: "text/json",
            FileName: filename
        };

        logDebug(obj);
        return obj;
    }

    AddColumn()
    {
        this.columns.push(new FormColumn());
    }

    RemoveColumn(columnInstance)
    {
        this.columns.remove(columnInstance);
    }

    MoveColumnUp(columnInstance)
    {
        let index = this.columns.indexOf(columnInstance);
        let newIndex;
        if (index !== 0)
        {
            newIndex = index - 1;
            this.columns.splice(index, 1);
            this.columns.splice(newIndex, 0, columnInstance);
        }
    }

    MoveColumnDown(columnInstance)
    {
        let index = this.columns.indexOf(columnInstance);
        let newIndex;
        if (index !== this.columns().length - 1)
        {
            newIndex = index + 1;
            this.columns.splice(index, 1);
            this.columns.splice(newIndex, 0, columnInstance);
        }
    }

    MoveColumnToTop(columnInstance)
    {
        let index = this.columns.indexOf(columnInstance);
        let newIndex = 0;
        if (index !== 0 && index < this.columns().length)
        {
            this.columns.splice(index, 1);
            this.columns.splice(newIndex, 0, columnInstance);
        }
    }

    MoveColumnToBottom(columnInstance)
    {
        let index = this.columns.indexOf(columnInstance);
        let newIndex = this.columns().length - 1;
        if (index !== this.columns().length - 1 && index < this.columns().length)
        {
            this.columns.splice(index, 1);
            this.columns.splice(newIndex, 0, columnInstance);
        }
    }

    toJSON()
    {
        let json = {
            id: this.id(),
            params: this.params,
            columns: {}
        };

        if (this.columns().length > 0)
        {
            for (let i = 0; i < this.columns().length; i++)
                json.columns[i + 1] = this.columns()[i];
        }

        let filename = (this.id().IsEmpty) ? "calc" : this.id();
        this.DownloadData(this.getData(filename, json));

        return json;
    }
}

/*ko.bindingHandlers.InlineDownload = {
    update: function(element,
                     valueAccessor) {
        let value = ko.unwrap(valueAccessor());
        if (typeof value.FileName === "string" && !value.FileName.IsEmpty)
            element.setAttribute("download", value.FileName);

        let href = "data:";

        if (typeof value.Mime === "string" && !value.Mime.IsEmpty)
            href += value.Mime + ";";

        if (typeof value.Charset === "string" && !value.Charset.IsEmpty)
            href += value.Charset + ";";


        if (typeof value.Base64 === "boolean" && value.Base64) {
            href += "base64,"+btoa(value.Data);
        } else {
            href += "," + encodeURIComponent(value.Data);
        }

        element.setAttribute("href", href);
    }
};*/

ko.bindingHandlers.BlobDownload = {
    update: function(element, valueAccessor)
    {
        let value = ko.unwrap(valueAccessor());
        if (typeof value.FileName === "string" && !value.FileName.IsEmpty)
            element.setAttribute("download", value.FileName);

        if (typeof value.Mime === "string" && !value.Mime.IsEmpty)
            element.setAttribute("type", value.Mime);

        element.setAttribute("href", URL.createObjectURL(new Blob([value.Data])));
    }
};