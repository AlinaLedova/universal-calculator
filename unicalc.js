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
    get NUMBER() {return "number"},
    get PASSWORD() {return "password"},
    get BUTTON() {return "button"},
    get SUBMIT() {return "submit"},
    get CHECKBOX() {return "checkbox"},
    get RADIO() {return "radio"},
    get RESET() {return "reset"},
    get HIDDEN() {return "hidden"}
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

const SendFunctionName = "SendToServer";
const DefaultFormId = "unicalc";
const JsonPath = "json/";

/********************************
*   HTML Tag Parameters
********************************/

class HtmlTag
{
    constructor(tagName, data)
    {
        this.tagName = tagName;
        this.data = data;
        this.id = String.Empty;
        this.name = String.Empty;
    }

    fillParams(data)
    {
        for (let param in data)
        {
            if (this.hasOwnProperty(param))
                this[param] = data[param];
        }
    }
}

const HtmlInputTypes = {
    text: "setAttributes",
    password: "setAttributes",
    button: "setAttributes",
    submit: "setAttributes",
    reset: "setAttributes",
    radio: "setAttributesWithLabel",
    checkbox: "setAttributesWithLabel"
};

class HtmlTagInput extends HtmlTag
{
    constructor(tagName, data)
    {
        super(tagName, data);
        this.type = DefaultInputType;
        this.placeholder = String.Empty;
        this.value = String.Empty;
        this.fillParams(this.data);
    }

    toHtml(tagName, data)
    {
        let tag = document.createElement(tagName);

        let method = HtmlInputTypes[data.type];
        tag = this[method](tag, data);

        return tag;
    }

    /**
     * Create input with types:
     * text, password, submit, button, reset
     *
     * @param {HTMLElement} tag
     * @param {object} params
     * @returns {HTMLElement}
     */
    setAttributes(tag, params)
    {
        for (let param in params)
            tag.setAttribute(param, params[param]);
        return tag;
    }

    /**
     * Create input with types:
     * radio, checkbox
     *
     * @param {HTMLElement} tag
     * @param {object} params
     * @returns {HTMLSpanElement}
     */
    setAttributesWithLabel(tag, params)
    {
        let wrap = document.createElement("span");

        let label = document.createElement("label");
        let text = document.createTextNode(params["value"]);
        label.setAttribute("for", params["id"]);
        label.appendChild(text);

        for (let param in params)
            tag.setAttribute(param, params[param]);

        wrap.appendChild(tag);
        wrap.appendChild(label);

        return wrap;
    }
}

class HtmlTagButton extends HtmlTag
{
    constructor(tagName, data)
    {
        super(tagName, data);
        this.type = DefaultButtonType;
        this.value = String.Empty;
        this.innerText = String.Empty;
        this.role = DefaultRole;
        this.fillParams(this.data);
    }

    toHtml(tagName, data, id="unicalc")
    {
        let tag = document.createElement(tagName);

        for (let param in data) {
            if (param !== "innerText")
                tag.setAttribute(param, data[param]);
            else
            {
                let text = document.createTextNode(data[param]);
                tag.appendChild(text);
            }

            if (param === "role" && data[param] === "send")
                tag = this.addBtnFunction(tag, id);
        }

        return tag;
    }

    addBtnFunction(tag, id)
    {
        tag.setAttribute('onclick', `${SendFunctionName}("${id}")`);
        return tag;
    }
}

class HtmlTagTextarea extends HtmlTag
{
    constructor(tagName, data)
    {
        super(tagName, data);
        this.value = String.Empty;
        this.innerText = String.Empty;
        this.cols = String.Empty;
        this.rows = String.Empty;
        this.fillParams(this.data);
    }

    toHtml(tagName, data)
    {
        let tag = document.createElement(tagName);

        for (let param in data) {
            if (param !== "innerText")
                tag.setAttribute(param, data[param]);
            else
            {
                let text = document.createTextNode(data[param]);
                tag.appendChild(text);
            }
        }

        return tag;
    }
}

class HtmlTagProgress extends HtmlTag {
    constructor(tagName, data)
    {
        super(tagName, data);
        this.value = String.Empty;
        this.max = String.Empty;
        this.fillParams(this.data);
    }

    toHtml(tagName, data)
    {
        let tag = document.createElement(tagName);

        for (let param in data)
            tag.setAttribute(param, data[param]);

        return tag;
    }
}

class HtmlTagSelect extends HtmlTag
{
    constructor(tagName, data)
    {
        super(tagName, data);

    }

    toHtml(tagName, data)
    {
        let tag = document.createElement(tagName);

        for (let param in data)
        {
            if (param !== "options")
                tag.setAttribute(param, data[param]);
            else
            {
                for (let i = 0; i < data[param].length; i++)
                {
                    let option = document.createElement("option");
                    option.setAttribute("value", data[param][i].value);

                    let text = document.createTextNode(data[param][i].description);
                    option.appendChild(text);

                    tag.appendChild(option);
                }
            }
        }

        return tag;
    }
}

const HtmlTagsProxy = {
    HtmlTagInput,
    HtmlTagButton,
    HtmlTagTextarea,
    HtmlTagProgress,
    HtmlTagSelect
};


class HtmlTagFactory
{
    constructor(tagName, tagData, formId)
    {
        this.tagName = tagName;
        this.htmlTag = this.getParams(tagName, tagData);
        this.htmlElement = this.htmlTag.toHtml(tagName, this.htmlTag.data, formId);
    }

    getParams(tagName, tagData)
    {
        let ClassName = `HtmlTag${tagName.toUCFirst()}`;
        return new HtmlTagsProxy[ClassName](tagName, tagData);
    }
}

class HtmlColumn
{
    constructor(json, formId)
    {
        this.formId = formId;
        this.tags = this.fillColumn(json);
    }

    fillColumn(json, formId)
    {
        let column = document.createElement("div");

        if (!json.IsEmpty)
        {
            for (let item in json)
            {
                let tag = new HtmlTagFactory(json[item]["tagname"], json[item]["params"], formId);
                column.appendChild(tag.htmlElement);
            }
        }
        logDebug(json);
        return column;
    }
}

class Calculator
{
    constructor(calcId, json)
    {
        this.id = calcId;
        this.json = json;
        this.form = this.generateForm(this.json);
        this.formId = this.getFormId(this.json);
        this.getColumns(this.json.columns, this.form, this.formId);
        this.printForm(this.form);
    }

    generateForm(json)
    {
        let form = document.createElement("form");

        if (!json.params.IsEmpty)
            for (let param in json.params)
                form.setAttribute(param, json.params[param]);

        return form;
    }

    getColumns(json, form, formId)
    {
        if (!json.IsEmpty)
        {
            for (let col in json)
            {
                let htmlColumn = new HtmlColumn(json[col], formId);

                let column = htmlColumn.tags;
                column.setAttribute("id", `column-${col}`);
                column.setAttribute("class", "column");

                form.appendChild(column);
            }
        }
    }

    getFormId(json)
    {
        if (json.params.id.IsEmpty || !json.params.id)
            return DefaultFormId;
        else
            return json.params.id;
    }

    printForm(form)
    {
        let block = document.getElementById(this.id);
        block.appendChild(form);
    }
}

function initCalculator(calculator, calcId)
{
    fetch(`${JsonPath}${calcId}.json`).then(async (response) => {
            if (!response.ok) throw ("Response");
            let parsedJson = await response.json();
            calculator = new Calculator(calcId, parsedJson);
        }
    );
}

/******************************************
*   Logical Part
******************************************/

class FormulaArgument
{
    constructor(elementId)
    {
        this.id = elementId;
    }

    toString()
    {
        return document.getElementById(this.id).value;
    }
}

class FormulaOperator {
    constructor(operator) {
        this.operator = operator;
    }

    toString()
    {
        return this.operator;
    }
}

class DivideFormulaOperator extends FormulaOperator
{
    constructor()
    {
        super("/");
    }
}

class MultiplyFormulaOperator extends FormulaOperator
{
    constructor()
    {
        super("*");
    }
}

class SubtractFormulaOperator extends FormulaOperator
{
    constructor()
    {
        super("-");
    }
}

class AddFormulaOperator extends FormulaOperator
{
    constructor()
    {
        super("+");
    }
}

class OpenBracketFormulaOperator extends FormulaOperator
{
    constructor()
    {
        super("(");
    }
}

class CloseBracketFormulaOperator extends FormulaOperator
{
    constructor()
    {
        super(")");
    }
}

const FormulaOperatorProxy = {
    DivideFormulaOperator,
    MultiplyFormulaOperator,
    AddFormulaOperator,
    SubtractFormulaOperator,
    OpenBracketFormulaOperator,
    CloseBracketFormulaOperator
};

class FormulaQueue
{
    constructor(array)
    {
        this.json = {
            formula:[
                {
                    type: "operator",
                    name: "OpenBracket"
                },
                {
                    type: "argument",
                    id: "price"
                }
            ]
        };
        this.queue = array;
    }

    getFormulaParams(json)
    {
        let params = [];


    }

    toString()
    {
        let str = String.Empty;

        for (let i = 0; i < this.queue.length; i++)
            str += this.queue[i];

        return str;
    }
}

/******************************************
*   JSON-generator (KnockOut 3.5.0. used)
******************************************/

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
        this.placeholder = ko.observable(String.Empty);
        this.dataCount = ko.observable(String.Empty);
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

const TagParamsProxy = {
    TagInputParams,
    TagButtonParams,
    TagSelectParams,
    TagTextareaParams,
    TagProgressParams
};

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
            for (let i = 0; i < this.tags().length; i++)
                json[i + 1] = ko.toJS(this.tags()[i]);
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
        this.logical = ko.observableArray([]);
        this.AddColumn();
    }

    getData(filename, json)
    {

        let obj = {
            Data: JSON.stringify(json),
            Mime: "text/json",
            FileName: filename
        };

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