/*!
 * Tool box js contains all basic functions and interfaces
 *
 * by Ayola Jayamaha
 * Date: 2016-04-10
 */


var canvas = document.getElementById('canvas1');
var context1 = canvas.getContext('2d');
var canvasx2 = document.getElementById('measurementlayer');
var contextx2 = canvasx2.getContext('2d');
var selectedItem = '';
var selectedMethod = '';
var rulers = new Array();
var compasses = new Array();
var labels = new Array();
var drawing = [rulers, compasses, labels];
var drawid = 0;
var radius1 = 0;
var lock = false;
var mousePos1,mousePos2 =null;
var samecentre = false;
var circle = false;
var centerx,centery=0;
var ctx = new C2S(500,500);
var i =0;

$('#ir').click(function() {
    selectedMethod = 'r';
    selectedItem = 'a';

	$('#ruler').show();
    $('#ir').css("opacity", "1");
    $('#compass').hide();
    $('#ic').css("opacity", "0.4");
    $('#label').hide();
    $('#il').css("opacity", "0.4");
    $('#pickA').hide();
    $('#pickB').hide();
    $('#im').css("opacity", "0.4");
	$('#extension').show();
    measurementlayerDown();
	$('#textlabel').text('Click on starting point');
	
});

$('#ic').click(function() {
    selectedMethod = 'c';
    selectedItem = 'c';
    clearvalues();
	$('#compass').show();
    $('#ic').css("opacity", "1");
    $('#ruler').hide();
    $('#ir').css("opacity", "0.4");
    $('#label').hide();
    $('#il').css("opacity", "0.4");
    $('#pickC').hide();
    $('#im').css("opacity", "0.4");
    measurementlayerDown();
	$('#textlabel').text('Click on center');
});

$('#il').click(function() {
    selectedMethod = 'l';
    selectedItem = 'l';
    clearvalues();
	$('#label').show();
    $('#il').css("opacity", "1");
    $('#ruler').hide();
    $('#ir').css("opacity", "0.4");
    $('#compass').hide();
    $('#ic').css("opacity", "0.4");
    $('#pickL').hide();
    $('#im').css("opacity", "0.4");
    measurementlayerDown();
	$('#textlabel').text('Click on label position');
});

$('#im').click(function() {
    selectedMethod = 'm';
    selectedItem = 'a';
    clearvalues();
	$('#label').hide();
    $('#il').css("opacity", "0.4");
    $('#ruler').hide();
    $('#ir').css("opacity", "0.4");
    $('#compass').hide();
    $('#ic').css("opacity", "0.4");
    $('#pickL').hide();
    $('#im').css("opacity", "1");
	$('#extension').hide();
    measurementlayerUp();
	$('#textlabel').text('Click on measurement starting point');
});


function setL(evt) {
    var mousePos = getMousePos(canvas, evt);
    $('#xx').val(mousePos.x / 50);
    $('#yy').val(mousePos.y / 50);
	var result =prompt("Enter Label","");
	if( result!=null ){
		$('#txt').val(result);
		label();
	}
}

function setA(evt) {
    var mousePos = getMousePos(canvas, evt);
    $('#x1').val((mousePos.x / 50).toFixed(1));
    $('#y1').val((mousePos.y / 50).toFixed(1));
	$('#textlabel').text('Click on ending point');
}

function setB(evt) {
    var mousePos = getMousePos(canvas, evt);
    $('#x2').val((mousePos.x / 50).toFixed(1));
    $('#y2').val((mousePos.y / 50).toFixed(1));
	$('#textlabel').text('Click on starting point');
}

function setX(evt) {
    var mousePos = getMousePos(canvasx2, evt);
    $('#x1').val((mousePos.x / 50).toFixed(1));
    $('#y1').val((mousePos.y / 50).toFixed(1));
	$('#textlabel').text('Click on measurement ending point');
}

function setY(evt) {
    var mousePos = getMousePos(canvasx2, evt);
    $('#x2').val((mousePos.x / 50).toFixed(1));
    $('#y2').val((mousePos.y / 50).toFixed(1));
	$('#textlabel').text('Click on measurement starting point');
}

function setC(evt) {
    var mousePos = getMousePos(canvas, evt);
    $('#x').val((mousePos.x / 50).toFixed(1));
    $('#y').val((mousePos.y / 50).toFixed(1));
	$('#textlabel').text('Click on circumference');
}

function clearvalues() {
    $('#x').val("");
    $('#y').val("");
    $('#x1').val("");
    $('#y1').val("");
    $('#x2').val("");
    $('#y2').val("");
    $('#ea').val("");
    $('#sa').val("");
    $('#xx').val("");
    $('#yy').val("");
    $('#e1').val("");
    $('#e2').val("");
    $('#radius').val("");
    $('#txt').val("");
}

function setR(evt) {
    var mousePos = getMousePos(canvas, evt);
	
	if(samecentre==true){
		$('#x').val(centerx);
		$('#y').val(centery);
	}

    if (document.getElementById('rad1').checked) {
        lock = true;
    }
	else if(document.getElementById('rad2').checked)
	{
		lock=false;
	}
	else if(document.getElementById('rad3').checked)
	{
		lock=true;
		samecentre = true;
		centerx=$('#x').val();
		centery=$('#y').val();
	}
	else if(document.getElementById('rad4').checked)
	{
		lock=false;
		$('#radius').val(Math.sqrt(($('#x').val() - (mousePos.x / 50)) * ($('#x').val() - (mousePos.x / 50)) + ($('#y').val() - (mousePos.y / 50)) * ($('#y').val() - (mousePos.y / 50))).toFixed(1));
		functioncircle();
		circle=true;
	}
    

    if (lock == true) {
        if (radius1 > 0)
            $('#radius').val(radius1);
    } else {
        $('#radius').val(Math.sqrt(($('#x').val() - (mousePos.x / 50)) * ($('#x').val() - (mousePos.x / 50)) + ($('#y').val() - (mousePos.y / 50)) * ($('#y').val() - (mousePos.y / 50))).toFixed(1));
        radius1 = $('#radius').val();
    }
	
	
	
	if(circle==true)
	{
		$('#sa').val(0);
	}
	else{

    if (Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) >= 0) {
        if (mousePos.y / 50 <= $('#y').val()) {
            //2nd quadrant
            $('#sa').val((270 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(0));
        } else {
            //4th quadrant
            $('#sa').val((90 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(0));
        }
    } else {
        if (mousePos.y / 50 <= $('#y').val()) {
            //1st quadrant
            $('#sa').val((270 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * (180)).toFixed(0));
        } else {
            //3rd quadrant
            $('#sa').val((90 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * (180)).toFixed(0));
        }
    }
	
	
	}
	$('#textlabel').text('Click on ending point on arc');
	
}

//set ending ending angle
function setAngle(evt) {
    var mousePos = getMousePos(canvas, evt);
	
	if(circle==true){
		$('#ea').val(360);
	}
	else{
		
    if (Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) >= 0) {
        if (mousePos.y / 50 <= $('#y').val()) {
            $('#ea').val((270 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(0));
        } else {
            $('#ea').val((90 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(0));
        }
    } else {
        if (mousePos.y / 50 <= $('#y').val()) {
            $('#ea').val((270 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(0));
        } else {
            $('#ea').val((90 - Math.atan((mousePos.x / 50 - $('#x').val()) / (mousePos.y / 50 - $('#y').val())) / Math.PI * 180).toFixed(0));
        }
    }
	
	}
	
	if(samecentre==true){
		setR(evt);
		
	}
	else{
		centerx=centery=0;
	}
	
}

//padding around grid

function init() {

    $('#ruler').hide();
	$('#pickA').hide();
    $('#pickB').hide();
    $('#compass').hide();
    $('#label').hide();
   
}


function compass() {

    //arc(center coordinates,radius,start angle,end angle,anticlockwise)
    var x = document.getElementById('x').value * 50;
    var y = document.getElementById('y').value * 50;
    var radius = document.getElementById('radius').value * 50;
    var startAngle = document.getElementById('sa').value;
    var endAngle = document.getElementById('ea').value;
    var counterClockwise = false;
    if (document.getElementById('rotation1').checked) {
        var counterClockwise = document.getElementById('rotation1').value;
    }
	if(circle==true)
	{
		counterClockwise=true;
		circle =false;
	}

    var clc = document.getElementById('clc').value;
    context1.beginPath();
    startAngle = startAngle * Math.PI / 180;
    endAngle = endAngle * Math.PI / 180;
    context1.strokeStyle = clc;
    context1.arc(x, y, radius, startAngle, endAngle, counterClockwise);
    context1.stroke();

    var arc = {
        index: drawid,
        x: (x / 50).toFixed(1),
        y: (y / 50).toFixed(1),
        radius: (radius / 50).toFixed(1),
        starta: (startAngle * 180 / Math.PI).toFixed(0),
        enda: (endAngle * 180 / Math.PI).toFixed(0),
        rotation: counterClockwise
    };
    compasses.push(arc);
    drawid++;
	loaddrawing();
}

function drawingAPIcompass(x0, y0, r, sa, ea, c) {
    context1.beginPath();
    context1.arc(x0 * 50, y0 * 50, r * 50, sa * Math.PI / 180, ea * Math.PI / 180, c);
    context1.strokeStyle = 'black';
    context1.stroke();
}

function drawsvgcompass(x0, y0, r, sa, ea, c) {
    ctx.beginPath();
    ctx.arc(x0 * 50, y0 * 50, r * 50, sa * Math.PI / 180, ea * Math.PI / 180, c);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}



function ruler() {

    var x1 = document.getElementById('x1').value * 50;
    var y1 = document.getElementById('y1').value * 50;
    var x2 = document.getElementById('x2').value * 50;
    var y2 = document.getElementById('y2').value * 50;
    var e1 = document.getElementById('e1').value * 50;
    var e2 = document.getElementById('e2').value * 50;

    var rcolor = document.getElementById('clr').value;
    context1.strokeStyle = rcolor;
    if (e1 > 0) {
        var m0 = (y1 - y2) / (x1 - x2);

        var x0 = x1 - (e1 / Math.sqrt(m0 * m0 + 1));

        //line parallel to y axis
        if (x1 == x2) {
            y0 = y1 - e1;
        } else {
            var test = (y1 - y2) / (x1 - x2) * (x0 - x1);
            if (test < 0)
                var y0 = y1 - Math.abs(test);
            else
                var y0 = y1 + Math.abs(test);
        }

        x1 = x0;
        y1 = y0;

    }

    if (e2 > 0) {
        var m1 = (y1 - y2) / (x1 - x2);
        var x3 = x2 + (e2 / Math.sqrt(m1 * m1 + 1));

        //line parallel to y axis
        if (x1 == x2) {
            y0 = y1 - e1;

        } else {
            var ext = m1 * (x3 - x2);

            if (ext > 0)
                var y3 = y2 + Math.abs(ext);
            else
                var y3 = y2 - Math.abs(ext);
        }

        x2 = x3;
        y2 = y3;

    }
    context1.beginPath();
    context1.moveTo(x1, y1);
    context1.lineTo(x2, y2);
    context1.stroke();

    var line = {
        index: drawid,
        xs: x1 / 50,
        ys: y1 / 50,
        xe: x2 / 50,
        ye: y2 / 50
    };
    rulers.push(line);
    drawid++;
	loaddrawing();
}

function drawingAPIruler(x0, y0, x1, y1) {
    context1.beginPath();
    context1.moveTo(x0 * 50, y0 * 50);
    context1.lineTo(x1 * 50, y1 * 50);
    context1.strokeStyle = 'black';
    context1.stroke();
}

function drawsvgruler(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0 * 50, y0 * 50);
    ctx.lineTo(x1 * 50, y1 * 50);
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function label() {

    var context1 = canvas.getContext("2d");
    var x = document.getElementById('xx').value * 50;
    var y = document.getElementById('yy').value * 50;
    var text = document.getElementById('txt').value;
    context1.font = "15px Arial";
    context1.fillText(text, x, y);

    var label = {
        index: drawid,
        xp: (x / 50).toFixed(2),
        yp: (y / 50).toFixed(2),
        message: text
    };
    labels.push(label);
    drawid++;
	loaddrawing();
}

function drawingAPIlabel(x0, y0, text) {
    context1.font = "15px Arial";
    context1.strokeStyle = 'black';
    context1.fillText(text, x0 * 50, y0 * 50);
}

function drawsvglabel(x0, y0, text) {
    ctx.font = "15px Arial";
    ctx.strokeStyle = 'black';
    ctx.fillText(text, x0 * 50, y0 * 50);
}

function measurelength() {
    $('#im').css("opacity", "1");
    $('#ruler').hide();
    $('#ir').css("opacity", "0.4");
    $('#compass').hide();
    $('#ic').css("opacity", "0.4");
    $('#label').hide();
    $('#il').css("opacity", "0.4");
    $('pickA').hide();
    $('pickB').hide();
    measurementlayerUp();
    //clearing text box

    var x1 = document.getElementById('x1').value * 50;
    var y1 = document.getElementById('y1').value * 50;
    var x2 = document.getElementById('x2').value * 50;
    var y2 = document.getElementById('y2').value * 50;
    var e1 = document.getElementById('e1').value * 50;
    var e2 = document.getElementById('e2').value * 50;


    if (e1 > 0) {
        var m0 = (y1 - y2) / (x1 - x2);

        var x0 = x1 - (e1 / Math.sqrt(m0 * m0 + 1));

        //line parallel to y axis
        if (x1 == x2) {
            y0 = y1 - e1;
        } else {
            var test = (y1 - y2) / (x1 - x2) * (x0 - x1);
            if (test < 0)
                var y0 = y1 - Math.abs(test);
            else
                var y0 = y1 + Math.abs(test);
        }

        x1 = x0;
        y1 = y0;

    }

    if (e2 > 0) {
        var m1 = (y1 - y2) / (x1 - x2);
        var x3 = x2 + (e2 / Math.sqrt(m1 * m1 + 1));

        //line parallel to y axis
        if (x1 == x2) {
            y0 = y1 - e1;

        } else {
            var ext = m1 * (x3 - x2);

            if (ext > 0)
                var y3 = y2 + Math.abs(ext);
            else
                var y3 = y2 - Math.abs(ext);

        }

        x2 = x3;
        y2 = y3;

    }
    contextx2.beginPath();
    contextx2.moveTo(x1, y1);
    contextx2.lineTo(x2, y2);
    contextx2.stroke();

    y1 = y1 / 50;
    y2 = y2 / 50;
    x1 = x1 / 50;
    x2 = x2 / 50;

    writeMessage(canvasx2, "Length :" + Math.sqrt((y1 - y2) * (y1 - y2) + (x1 - x2) * (x1 - x2)).toFixed(1));
    //print length

    contextx2.font = "15px Arial";
    var linelength = Math.sqrt((y1 - y2) * (y1 - y2) + (x1 - x2) * (x1 - x2));
    contextx2.fillText((Math.round(linelength * 10)) / 10 + 'cm', ((x1 + x2) / 2) * 50, (y1 + y2) / 2 * 50);
}

function draw(id) {
    for (var i = 0; i < rulers.length; i++) {
        if (id < rulers[i].index)
            break;
        drawingAPIruler(rulers[i].xs, rulers[i].ys, rulers[i].xe, rulers[i].ye);
    }
    for (var i = 0; i < compasses.length; i++) {
        if (id < compasses[i].index)
            break;
        drawingAPIcompass(compasses[i].x, compasses[i].y, compasses[i].radius, compasses[i].starta, compasses[i].enda, compasses[i].rotation);
    }
    for (var i = 0; i < labels.length; i++) {
        if (id < labels[i].index)
            break;
        drawingAPIlabel(labels[i].xp, labels[i].yp, labels[i].message);
    }

}

function drawsvg()
{
	 for (var i = 0; i < rulers.length; i++) {
        drawsvgruler(rulers[i].xs, rulers[i].ys, rulers[i].xe, rulers[i].ye);
    }
    for (var i = 0; i < compasses.length; i++) {
        drawsvgcompass(compasses[i].x, compasses[i].y, compasses[i].radius, compasses[i].starta, compasses[i].enda, compasses[i].rotation);
    }
    for (var i = 0; i < labels.length; i++) {
        drawsvglabel(labels[i].xp, labels[i].yp, labels[i].message);
    }

	var myRectangle = ctx.getSerializedSvg(true);
	$("#inputTextToSave").val(myRectangle);
}

function loaddrawing() {
    clearCanvas();
    draw(drawid);
}

function undodrawing() {
    clearCanvas();
	drawid = drawid-1;
	undoruler(drawid);
	undocompass(drawid);
	undolabel(drawid);
	
    draw(drawid);
}

function undoruler(i)
{
	try{
		if(rulers[rulers.length-1].index==i)
			rulers.pop();
	}
	catch(e){}
}
function undocompass(i)
{
	try{
		if(compasses[compasses.length-1].index==i)
			compasses.pop();
	}
	catch(e){}
}
function undolabel(i)
{
	try{
		if(labels[labels.length-1].index==i)
			labels.pop();
	}
	catch(e){}
}
function clearAll()
{
	clearCanvas();
	clearvalues();
	compasses =new Array();
	rulers = new Array();
	labels = new Array();
	drawid =0;
}

function clear() {
    context1.clearRect(0, 0, canvas.width, canvas.height);	
}

function clearCanvas() {
    context1.clearRect(0, 0, canvas.width, canvas.height);
    contextx2.clearRect(0, 0, canvasx2.width, canvasx2.height);
}

function writeMessage(canvas, message) {
    context1.clearRect(canvas.width - 198, 0, canvas.width, canvas.height - 451);
    context1.font = '12pt Calibri';
    context1.fillStyle = 'black';
    context1.fillText(message, canvas.width - 190, 25);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function measurementlayerUp() {
    $('#measurementlayer').attr('style', 'z-index: 1; position:absolute; left:10px;top:10px; border:1px solid #d3d3d3;');
    $('#canvas1').attr('style', 'z-index: 0; position:absolute; left:10px;top:10px; border:1px solid #d3d3d3;');
	console.log("canvas down");
}

function measurementlayerDown() {
    $('#measurementlayer').attr('style', 'z-index: 0; position:absolute; left:10px;top:10px; border:1px solid #d3d3d3;');
    $('#canvas1').attr('style', 'z-index: 1; position:absolute; left:10px;top:10px; border:1px solid #d3d3d3;');
	console.log("canvas up");
}


function functioncircle()
{
	var x = document.getElementById('x').value * 50;
    var y = document.getElementById('y').value * 50;
	var radius = document.getElementById('radius').value * 50;
	var clc = document.getElementById('clc').value;
	context1.beginPath();
    context1.strokeStyle = clc;
    context1.arc(x, y, radius,0,2*Math.PI,true);
    context1.stroke();

}





