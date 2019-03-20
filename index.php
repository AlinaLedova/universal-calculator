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
</head>
<body class="bg-dark">
<?php
/**
 * User: Alina Ledova
 * Date: 05.03.2019
 * Time: 23:01
 */

require_once '../../functions.php';

$form = array(
    "id" => "calc-1",
    "params" => array(
            "id" => "unique_form",
            "method" => "post",
            "action" => "#"
    ),
    "columns" => 2,
    "col0" => array(
        1 => array(
            "tagname" =>"input",
            "params" => array(
            "id" => "name",
            "type" => "text",
            "name" => "username"
            )
        ),
        2 => array(
            "tagname" =>"input",
            "params" => array(
            "id" => "pass",
            "type" => "password",
            "name" => "password"
            )
            )
        ),
        "col1" => array(
            1 => array(
                "tagname" => "input",
                "params" => array(
                "id" => "phone",
                "type" => "text",
                "name" => "phone"
                )
            ),
            2 => array(
                "tagname" => "input",
                "params" => array(
                "id" => "country",
                "type" => "text",
                "name" => "country"
                )
            ),
            3 => array(
                "tagname" => "input",
                "params" => array(
                    "id" => "btn",
                    "type" => "button",
                    "name" => "button",
                    "value" => "Send",
                    "role" => "send"
                )
            )
        )
);

//print_array($form);
$jsonForm = json_encode($form);

/*echo $jsonForm;*/

?>
<div class="container">
    <div class="row">
        <header class="col-12">
            <h2 class="text-warning">UNIversal CALCulator v.0.1.</h2>
        </header>
    </div>
    <div id="calc-1">
    </div>
</div>
<script type="text/javascript">
    console.clear();

    let form = createForm('<?php echo $jsonForm; ?>');

</script>
</body>
</html>