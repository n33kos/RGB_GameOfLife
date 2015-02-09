jQuery(document).ready(function(){

	//var decs
	var 
	isStarted = false,
	updateInterval = 50,
	CellDensity = 100,
	expandPixels2x = true,
	expandPixels4x = true,
	expandFactor = 4,
	positiveIncrement = 1,
	negativeIncrement = 0,
	positiveInfluenceIncrement = 50,
	negativeInfluenceDecrement = 0,
	diseasePercentage = 1,
	mutationPercentage = 0.0,
	redRandomSeedRange = 255,
	greenRandomSeedRange = 255,
	blueRandomSeedRange = 255,
	cyclicalEnergy = true,
	cyclicalEnergyDirection = false
	;

	//grab the GET data
	var $_GET = {};
	document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
	    function decode(s) {
	        return decodeURIComponent(s.split("+").join(" "));
	    }
	    $_GET[decode(arguments[1])] = decode(arguments[2]);
	});

	//_GET our variables and set them before simulation
	if($_GET["isStarted"] == '1'){

		window.isStarted = true;

		if($_GET["updateInterval"]){
			updateInterval = parseInt($_GET["updateInterval"]);
			$("input[name='updateInterval']").val($_GET["updateInterval"]);
		}

		if($_GET["expandPixels2x"] != 'on'){
			expandPixels2x = false;
			$("input[name='expandPixels2x']").attr('checked', false);
		}else{
			expandPixels2x = true;
			$("input[name='expandPixels2x']").attr('checked', true);
		}
		if($_GET["expandPixels4x"] != 'on'){
			expandPixels4x = false;
			$("input[name='expandPixels4x']").attr('checked', false);
		}else{
			expandPixels4x = true;
			$("input[name='expandPixels4x']").attr('checked', true);
		}

		if($_GET["cyclicalEnergy"] != 'on'){
			cyclicalEnergy = false;
			$("input[name='cyclicalEnergy']").attr('checked', false);
		}else{
			cyclicalEnergy = true;
			$("input[name='cyclicalEnergy']").attr('checked', true);
		}
		if($_GET["cyclicalEnergyDirection"] != 'on'){
			cyclicalEnergyDirection = false;
			$("input[name='cyclicalEnergyDirection']").attr('checked', false);
		}else{
			cyclicalEnergyDirection = true;
			$("input[name='cyclicalEnergyDirection']").attr('checked', true);
		}

		if($_GET["CellDensity"]){
			CellDensity = parseInt($_GET["CellDensity"]);
			$("input[name='CellDensity']").val($_GET["CellDensity"]);
		}
		if($_GET["expandFactor"]){
			expandFactor = parseInt($_GET["expandFactor"]);
			$("input[name='expandFactor']").val($_GET["expandFactor"]);
		}

		if($_GET["redRandomSeedRange"]){
			redRandomSeedRange = parseInt($_GET["redRandomSeedRange"]);
			$("input[name='redRandomSeedRange']").val($_GET["redRandomSeedRange"]);
		}
		if($_GET["greenRandomSeedRange"]){
			greenRandomSeedRange = parseInt($_GET["greenRandomSeedRange"]);
			$("input[name='greenRandomSeedRange']").val($_GET["greenRandomSeedRange"]);
		}
		if($_GET["blueRandomSeedRange"]){
			blueRandomSeedRange = parseInt($_GET["blueRandomSeedRange"]);
			$("input[name='blueRandomSeedRange']").val($_GET["blueRandomSeedRange"]);
		}

		if($_GET["positiveIncrement"]){
			positiveIncrement = parseInt($_GET["positiveIncrement"]);
			$("input[name='positiveIncrement']").val($_GET["positiveIncrement"]);
		}
		if($_GET["negativeIncrement"]){
			negativeIncrement = parseInt($_GET["negativeIncrement"]);
			$("input[name='negativeIncrement']").val($_GET["negativeIncrement"]);
		}
		if($_GET["positiveInfluenceIncrement"]){
			positiveInfluenceIncrement = parseInt($_GET["positiveInfluenceIncrement"]);
			$("input[name='positiveInfluenceIncrement']").val($_GET["positiveInfluenceIncrement"]);
		}
		if($_GET["negativeInfluenceDecrement"]){
			negativeInfluenceDecrement = parseInt($_GET["negativeInfluenceDecrement"]);
			$("input[name='negativeInfluenceDecrement']").val($_GET["negativeInfluenceDecrement"]);
		}
		if($_GET["diseasePercentage"]){
			diseasePercentage = parseInt($_GET["diseasePercentage"]);
			$("input[name='diseasePercentage']").val($_GET["diseasePercentage"]);
		}
		if($_GET["mutationPercentage"]){
			mutationPercentage = parseInt($_GET["mutationPercentage"]);
			$("input[name='mutationPercentage']").val($_GET["mutationPercentage"]);
		}
	}

	//Init the canvas
	element = document.getElementById("canvas1");
	c = element.getContext("2d");
	//Set the width and heith of the canvas
	element.width = CellDensity*expandFactor;
	element.height = CellDensity*expandFactor;
	// create a new imagedata holder
	imageData = c.createImageData(CellDensity*expandFactor, CellDensity*expandFactor);
	var parentChildOffset = Math.floor(element.width/expandFactor);


	//-------Start with an image instead of random colors--------
	//var myImg = new Image();
	//myImg.src = 'test.jpg';
	//myImg.onload = function () {
	//	c.drawImage(myImg, 0, 0);
	//}
	//imgData = c.getImageData(300,300,500, 500); // get the image array
	//-----------------------------------------------------------

	var colorArray = [];
	//initialize random colors in pixel array
	for(var i=0;i<CellDensity*CellDensity;i++){

		var r = Math.floor(Math.random()*redRandomSeedRange);
		var g = Math.floor(Math.random()*greenRandomSeedRange);
		var b = Math.floor(Math.random()*blueRandomSeedRange);

		//-------Start with an image instead of random colors--------
		//var r = imgData.data[i];
		//var g = imgData.data[i+1];
		//var b = imgData.data[i+2];
		//-----------------------------------------------------------

		colorArray.push([r,g,b]);
	}

	function setPixel(imageData, x, y, r, g, b, a) {
		if(expandPixels2x){
		    index = (x + y * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = ((x+1) + y * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = ((x+1) + (y+1) * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = (x + (y+1) * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;
		}else if(expandPixels4x){
		    index = (x + y * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = ((x+1) + y * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = ((x+1) + (y+1) * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = ((x+2) + (y+1) * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = ((x+1) + (y+2) * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = (x + (y+1) * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = ((x+2) + y * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = ((x+2) + (y+2) * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;

		    index = (x + (y+2) * imageData.width) * 4;
		    imageData.data[index] = r;
		    imageData.data[index+1] = g;
		    imageData.data[index+2] = b;
		    imageData.data[index+3] = a;
		}else{
			index = (x + y * imageData.width) * 4;
			imageData.data[index] = r;
			imageData.data[index+1] = g;
			imageData.data[index+2] = b;
			imageData.data[index+3] = a;
		}

	}

	//setInterval for Update
	var myVar=setInterval(function () { 
		//Are we paused?
		if(!window.isStarted){return;}
		Update();
	}
	, updateInterval);

	//Update function
	function Update() {
			
		for(var i=0;i<CellDensity*CellDensity;i++){

			var 
			nextColor,
			prevColor,
			parentColor,
			childColor,
			redIncrement = 0,
			greenIncrement = 0,
			blueIncrement = 0
			oldRGB = colorArray[i],
			parentChildOffset = CellDensity
			;

			//Get prev/next pixel
			if(i+1 <= CellDensity*CellDensity)var nextRGB = colorArray[i+1];
			if(i-1 >= 0)var prevRGB = colorArray[i-1];
			
			//Get parent/child pixel
			if(i+parentChildOffset <= CellDensity*CellDensity)var parentRGB = colorArray[i+parentChildOffset];
			if(i-parentChildOffset >= 0)var childRGB = colorArray[i-parentChildOffset];

			//Neighbor Increments
			if(nextRGB)nextRGB[0] > oldRGB[0] ? redIncrement += positiveIncrement : redIncrement -= negativeIncrement;
			if(nextRGB)nextRGB[1] > oldRGB[1] ? greenIncrement += positiveIncrement : greenIncrement -= negativeIncrement;
			if(nextRGB)nextRGB[2] > oldRGB[2] ? blueIncrement += positiveIncrement : blueIncrement -= negativeIncrement;
			if(prevRGB)prevRGB[0] > oldRGB[0] ? redIncrement += positiveIncrement : redIncrement -= negativeIncrement;
			if(prevRGB)prevRGB[1] > oldRGB[1] ? greenIncrement += positiveIncrement : greenIncrement -= negativeIncrement;
			if(prevRGB)prevRGB[2] > oldRGB[2] ? blueIncrement += positiveIncrement : blueIncrement -= negativeIncrement;
			if(parentRGB)parentRGB[0] > oldRGB[0] ? redIncrement += positiveIncrement : redIncrement -= negativeIncrement;
			if(parentRGB)parentRGB[1] > oldRGB[1] ? greenIncrement += positiveIncrement : greenIncrement -= negativeIncrement;
			if(parentRGB)parentRGB[2] > oldRGB[2] ? blueIncrement += positiveIncrement : blueIncrement -= negativeIncrement;
			if(childRGB)childRGB[0] > oldRGB[0] ? redIncrement += positiveIncrement : redIncrement -= negativeIncrement;
			if(childRGB)childRGB[1] > oldRGB[1] ? greenIncrement += positiveIncrement : greenIncrement -= negativeIncrement;
			if(childRGB)childRGB[2] > oldRGB[2] ? blueIncrement += positiveIncrement : blueIncrement -= negativeIncrement;

			//Good Begets Good
			if(oldRGB[0] >= 225)greenIncrement += positiveInfluenceIncrement;
			if(oldRGB[1] >= 225)blueIncrement += positiveInfluenceIncrement;
			if(oldRGB[2] >= 225)redIncrement += positiveInfluenceIncrement;

			//Evil Begets Evil
			if(oldRGB[0] <= 35)greenIncrement -= negativeInfluenceDecrement;
			if(oldRGB[1] <= 35)blueIncrement -= negativeInfluenceDecrement;
			if(oldRGB[2] <= 35)redIncrement -= negativeInfluenceDecrement;
			
			//Clamp color values and cycle pixel values if desired.
			if(cyclicalEnergy){
				if(!cyclicalEnergyDirection){
					var r = parseInt(oldRGB[0]) > 0 ? oldRGB[0]+(redIncrement/10) : 255;
					var g = parseInt(oldRGB[1]) > 0 ? oldRGB[1]+(greenIncrement/10) : 255;
					var b = parseInt(oldRGB[2]) > 0 ? oldRGB[2]+(blueIncrement/10) : 255;
				}else{
					var r = parseInt(oldRGB[0]) <= 254 ? oldRGB[0]+(redIncrement/10) : 0;
					var g = parseInt(oldRGB[1]) <= 254 ? oldRGB[1]+(greenIncrement/10) : 0;
					var b = parseInt(oldRGB[2]) <= 254 ? oldRGB[2]+(blueIncrement/10) : 0;
				}
			}else{				
				var r = parseInt(oldRGB[0]) <= 254 ? oldRGB[0]+(redIncrement/10) : 255;
				var g = parseInt(oldRGB[1]) <= 254 ? oldRGB[1]+(greenIncrement/10) : 255;
				var b = parseInt(oldRGB[2]) <= 254 ? oldRGB[2]+(blueIncrement/10) : 255;
			}

			//Thus, disease ravages the land.
			var rando = Math.random()*100;
			if(rando < diseasePercentage){
				if(nextRGB && prevRGB && parentRGB && childRGB)r = (nextRGB[0] + prevRGB[0] + parentRGB[0] + childRGB[0])/4;
			}else if(rando > diseasePercentage && rando < (diseasePercentage*2)){
				if(nextRGB && prevRGB && parentRGB && childRGB)g = (nextRGB[1] + prevRGB[1] + parentRGB[1] + childRGB[1])/4;
			}else if(rando > (diseasePercentage*2) && rando < (diseasePercentage*3)){
				if(nextRGB && prevRGB && parentRGB && childRGB)b = (nextRGB[2] + prevRGB[2] + parentRGB[2] + childRGB[2])/4;
			}
			
			//Sun Beams Cause Mutations Bruh
			if(rando < mutationPercentage){
				var rOLD = r;
				var gOLD = g;
				var bOLD = b;
				r = gOLD;
				g = bOLD;
				b = rOLD;
			}

			//set the value in the pixel array
			colorArray[i] = [r,g,b];

			//Establish xy position of pixel
			var x = Math.floor((i%parentChildOffset)) * expandFactor;
			var y = Math.floor((i/parentChildOffset)) * expandFactor;

			//Set the pixel
			setPixel(imageData, x, y, r, g, b, 255);
		}
		// copy the image data back onto the canvas
		c.putImageData(imageData, 0, 0); // at coords 0,0
	}

	//Show original image size on click
	$('canvas').click(function(){
		if ($('canvas').attr("style") == "width: 100%;"){
			$('canvas').css("width", CellDensity+'px');
		}else{
			$('canvas').css("width","100%");
		}
	});

});