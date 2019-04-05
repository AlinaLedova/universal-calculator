<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>UNIversal CALCulator v.0.1.</title>
    <script type="text/javascript" src="../../js/extended.js"></script>
    <script type="text/javascript" src="../../js/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="../../js/bootstrap.min.js"></script>
    <script type="text/javascript" src="../../js/main.js"></script>
    <script type="text/javascript" src="js/unicalc.js"></script>
    <link rel="stylesheet" type="text/css" href="../../style/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="style/style.css">
</head>
<body class="bg-dark">
<?php
/**
 * User: Alina Ledova
 * Date: 05.03.2019
 * Time: 23:01
 */

require_once '../../functions.php';


?>
<div class="container">
    <div class="row">
        <header class="col-12">
            <h2 class="text-warning">UNIversal CALCulator v.0.3.</h2>
        </header>
        <div id ="test"></div>
    </div>
    <div id="calc-1">
    </div>
    <div id="test-calc">
        <form id="test-form">
            <input type="text" name="name" id="name" value="50">
            <input type="checkbox" name="price" id="price" value="1000">Checkbox
        </form>
    </div>
</div>
<script type="text/javascript">
    console.clear();

    let calc;
    initCalculator(calc, "calc-1");

    /******************************/

    let json = {
        formula: [
            {
                type: "operator",
                name: "OpenBracket"
            },
            {
                type: "argument",
                id: "name"
            },
            {
                type: "operator",
                name: "Add"
            },
            {
                type: "argument",
                id: "price"
            },
            {
                type: "operator",
                name: "CloseBracket"
            }
        ]
    };

    function getFormulaParams(params) {
        let args = [];

        for (let i = 0; i < params.length; i++)
        {

            switch (params[i].type)
            {
                case "operator":
                    let ClassName = `${params[i].name}FormulaOperator`;
                    args[i] = new FormulaOperatorProxy[ClassName]().toString();
                    break;
                case "argument":
                    let arg = new FormulaArgument(params[i].id);
                    args[i] = arg.toString();
                    break;
            }
        }

        return args;
    }

    let args = [
        "(",
        "10",
        "+",
        "5",
        ")",
        "*",
        "2",
        "/",
        "5"
    ];

    /******************************/
    let fQueue = new FormulaQueue(args);
    //let fOperator = new OpenBracketFormulaOperator();

    logDebug("HERE >>>>", getFormulaParams(json.formula));
</script>
</body>
</html>