var motto=1;
var skillsNode;var skillsNodeDesc;
$(document).ready(function(){

	$("#downIcon").click(function(){
		$('html,body').animate({scrollTop: $('#first').offset().top-25});
	});

	setInterval(function(){
		$('.motto').hide('slide',{direction:'up'},400);
		setTimeout(function(){
			if(motto==1){
				motto=2;
				$('.motto').html('ingeniare &nbsp; imaginationem &nbsp; ingenium');
			}else{
				motto=1;
				$('.motto').html('doing science with a slice of imagination and a pi of creativity');
			}
			$('.motto').show('slide',{direction:'down'},500);
		},500);
	},5000);

	// Graph Section
	var aboutMeGraphShown=0;
	var skillsGraphShown=0;
	drawGraphAboutMe();
	drawHistory();
	d3.json("skills.json", function(json) {
    	skillsNode=json.nodes;
    	skillsNodeDesc=json.nodesDescription;
    	drawGraphSkills(skillsNode,1);
    });
	$(window).resize(function(){
		drawGraphAboutMe();
		drawHistory();
		d3.json("skills.json", function(json) {
	    	skillsNode=json.nodes;
	    	drawGraphSkills(skillsNode);
	    });
	});
	$(window).on('scroll', function() {
		if($(window).scrollTop()+$(window).height()>$("#graphAboutMe").offset().top && aboutMeGraphShown==0){
			aboutMeGraphShown=1;
			drawGraphAboutMe();
		}
		if($(window).scrollTop()+$(window).height()>$("#graphSkills").offset().top && skillsGraphShown==0){
			skillsGraphShown=1;
			d3.json("skills.json", function(json) {
		    	skillsNode=json.nodes;
		    	drawGraphSkills(skillsNode);
		    });
		}
		$("#emailIcon").attr('title','hello'+' @ '+'joelcthomas.com');
		emailToolTip();
	});
});
function emailToolTip(){
	$("#emailIcon").tooltip({
		position: {
			my: "center bottom-20",
			at: "center top",
			using: function( position, feedback ) {
				$(this).css(position);
				$("<div>")
					.addClass( "arrow" )
					.addClass( feedback.vertical )
					.addClass( feedback.horizontal )
					.appendTo( this );
			}
		}
    });
}
function drawHistory(){
	var width = $("#graphHistory").width(),
		height = 600,
		historyData;
	var hoverarea=[];

	$("#graphHistoryD3").remove();
	var svg = d3.select("#graphHistory").append("svg")
		.attr("class", "image featured")
		.attr("id","graphHistoryD3")
		.attr("width", width)
		.attr("height", height)
		.on("mousemove", function(){
			var hoverCoord = [0, 0];
			hoverCoord = d3.mouse(this);
			controlHover(hoverCoord[0],hoverCoord[1]);
		});

	d3.json("historyData.json", function(error, json) {
		historyData = json;
		update();
	});

	var lineFunction = d3.svg.line()
					.x(function(d) { return d.x; })
					.y(function(d) { return d.y; })
					.interpolate("basis");

	function update(){
		var x,x1,x2,y,y1,y2;
		$.each(historyData, function(i,d) {
			// Main lines
			if(d.group!="anchor"&&d.group!="anchor2"&&d.group!="scale"){
				x1=(($("#graphHistory").width()/2)+(d.x1*$("#graphHistory").width()/16));
				y1=(($("#graphHistory").height()*(1/2))+d.y1);
				x2=(($("#graphHistory").width()/2)+(d.x2*$("#graphHistory").width()/16));
				y2=(($("#graphHistory").height()*(1/2))+d.y2);
				appendLine(x1,y1,x2,y2,d.id,d.width,d.strokestyle,d.color);
				if(d.group=="emphasis"||d.group=="learn"){
					hoverarea[d.id.split("_")[1]+'_x1']=x1;
					hoverarea[d.id.split("_")[1]+'_x2']=x2;
				}
			}

			//Scale
			if(d.group=="scale"){
				x1=(($("#graphHistory").width()/2)+(d.x1*$("#graphHistory").width()/16));
				y1=(($("#graphHistory").height()*(1/10))+d.y1);
				x2=(($("#graphHistory").width()/2)+(d.x2*$("#graphHistory").width()/16));
				y2=(($("#graphHistory").height()*(1/10))+d.y2);
				appendLine(x1,y1,x2,y2,"",d.width,d.strokestyle,d.color);
				var text=svg.append("text")
					.attr("dy", ".35em")
					.attr("x",x2+5)
					.attr("y",y2)
					.attr("class","anchortext")
					.attr("font-size",function(){
						if($( window ).width()>800){return "12px";}
						else{return "0.6em";}
					})
					.text(function() { return d.name; });
			}

			// Separating lines
			if(d.group=="mainaxis"){
				x1=(($("#graphHistory").width()/2)+(d.x1*$("#graphHistory").width()/16));
				y1=(($("#graphHistory").height()*(1/2))+d.y1-7);
				x2=(($("#graphHistory").width()/2)+(d.x1*$("#graphHistory").width()/16));
				y2=(($("#graphHistory").height()*(1/2))+d.y1+7);
				appendLine(x1,y1,x2,y2,"",2,"",d.color);

				x1=(($("#graphHistory").width()/2)+(d.x1*$("#graphHistory").width()/16));
				y1=(($("#graphHistory").height()*(1/2))+d.y1-7+180);
				x2=(($("#graphHistory").width()/2)+(d.x1*$("#graphHistory").width()/16));
				y2=(($("#graphHistory").height()*(1/2))+d.y1+7+180);
				appendLine(x1,y1,x2,y2,"",2,"",d.color);
			}

			//Add Main Axis Image
			if(d.group=="image"){
				x1=(($("#graphHistory").width()/2)+(d.x1*$("#graphHistory").width()/16));
				x2=(($("#graphHistory").width()/2)+(d.x2*$("#graphHistory").width()/16));
				x=x1+(x2-x1)/2;
				y=(($("#graphHistory").height()*(1/2))+d.y1+180);
				var textWidth=(x2-x1)*0.7;
				var image = svg.append("svg:image")
					.attr("xlink:href", "https://joelcthomas.com/images/history/"+d.name+".png")
					.attr("x", x)
					.attr("y", y)
					.attr("width", widthCalc(d.width)+"px")
					.attr("height", widthCalc(d.height)+"px")
					.attr("transform", "translate(" + (-widthCalc(d.width)/2) + "," + (-widthCalc(d.height)/2) + ")");
			}

			// Add pointing anchor lines
			if(d.group=="anchor"){
				//Vertical line
				x1=(($("#graphHistory").width()/2)+(d.x1*$("#graphHistory").width()/16));
				y1=(($("#graphHistory").height()*(1/2))+d.y1);
				x2=(($("#graphHistory").width()/2)+(d.x2*$("#graphHistory").width()/16));
				y2=(($("#graphHistory").height()*(1/2))+d.y2);
				appendLine(x1,y1,x2,y2,d.id,d.width,d.strokestyle,d.color);

				//horizontal line
				x1=x2;
				y1=y2;
				x2=x1+10;
				y2=y2;
				appendLine(x1,y1,x2,y2,d.id,d.width,d.strokestyle,d.color);

				//Arrow head
				x1=x2-4;
				y1=y2-4;
				appendLine(x1,y1,x2,y2,d.id,d.width,d.strokestyle,d.color);
				x1=x2-4;
				y1=y2+4;
				appendLine(x1,y1,x2,y2,d.id,d.width,d.strokestyle,d.color);

				//Anchor text
				x=x2+3;
				y=y2;
				var text=svg.append("text")
					.attr("dy", ".35em")
					.attr("x",x)
					.attr("y",y)
					.attr("class","anchortext")
					.attr("id",d.id)
					.attr("font-size",function(){
						if($( window ).width()>800){return "12px";}
						else{return "0.6em";}
					})
					.text(function() { return d.name; });

				var textWidth=($("#graphHistory").width()-x)*0.9;
				wrap(text,textWidth);
			}
			if(d.group=="anchor2"){
				//Vertical line
				x1=(($("#graphHistory").width()/2)+(d.x1*$("#graphHistory").width()/16));
				y1=(($("#graphHistory").height()*(1/2))+d.y1);
				x2=(($("#graphHistory").width()/2)+(d.x2*$("#graphHistory").width()/16));
				y2=(($("#graphHistory").height()*(1/2))+d.y2);

				//Arrow head
				var anchorclass="anchortext2";
				if(y2<y1){
					appendLine(x1,y1,x2,y2,d.id,d.width,d.strokestyle,d.color);
					x1=x2-4;
					y1=y2+4;
					appendLine(x1,y1,x2,y2,d.id,d.width,d.strokestyle,d.color);
					x1=x2+4;
					y1=y2+4;
					appendLine(x1,y1,x2,y2,d.id,d.width,d.strokestyle,d.color);
					anchorclass="anchortext2";
				}

				//Anchor text
				if(anchorclass=="anchortext2"){
					x=x1+((x2-x1)/2);
					y=y2-9;
				}
				var text=svg.append("text")
					.attr("dy", ".35em")
					.attr("x",x)
					.attr("y",y)
					.attr("class",anchorclass)
					.attr("id",d.id)
					.attr("font-size",function(){
						if($( window ).width()>800){return "12px";}
						else{return "0.6em";}
					})
					.text(function() { return d.name; });

				if(y2>=y1){
					var textWidth=(x2-x1)*0.9;
					wrap(text,textWidth);
				}
			}

		});

		controlHover(0,0);
	}

	function controlHover(posx,posy){
		var selectedArea='empty';
		if(posy<($("#graphHistory").height()/2)){
			if(posx>hoverarea['Infosys_x1']&&posx<=hoverarea['Infosys_x2']){
				selectedArea='Infosys';
			}else if(posx>hoverarea['StatisticalAnalyst_x1']&&posx<=hoverarea['StatisticalAnalyst_x2']){
				selectedArea='StatisticalAnalyst';
			}else if(posx>hoverarea['ResearchAssistant_x1']&&posx<=hoverarea['ResearchAssistant_x2']){
				selectedArea='ResearchAssistant';
			}else if(posx>hoverarea['MicronIntern_x1']&&posx<=hoverarea['MicronIntern_x2']){
				selectedArea='MicronIntern';
			}else if(posx>hoverarea['ProcessEngg_x1']&&posx<=hoverarea['ProcessEngg_x2']){
				selectedArea='ProcessEngg';
			}else if(posx>hoverarea['SystemsEngineer_x1']&&posx<=hoverarea['SystemsEngineer_x2']){
				selectedArea='SystemsEngineer';
			}else if(posx>hoverarea['DataScientist_x1']&&posx<=hoverarea['DataScientist_x2']){
				selectedArea='DataScientist';
			}
			var allTextElements=svg.selectAll("text[id=Infosys],text[id=StatisticalAnalyst],text[id=ResearchAssistant],text[id=MicronIntern],text[id=ProcessEngg],text[id=SystemsEngineer],text[id=DataScientist]");
			allTextElements.attr("class","anchortext");
			allTextElements=svg.selectAll("text[id=Sathyabama],text[id=UniversityOfHouston],text[id=ContinousLearn]");
			allTextElements.attr("class","anchortext2");

			var hoverTextElement=svg.selectAll("text[id="+selectedArea+"]");
			hoverTextElement.attr("class","anchortexthover")
		}else{
			if(posx>hoverarea['Sathyabama_x1']&&posx<=hoverarea['Sathyabama_x2']){
				selectedArea='Sathyabama';
			}else if(posx>hoverarea['UniversityOfHouston_x1']&&posx<=hoverarea['UniversityOfHouston_x2']){
				selectedArea='UniversityOfHouston';
			}else if(posx>hoverarea['ContinousLearn_x1']&&posx<=hoverarea['ContinousLearn_x2']){
				selectedArea='ContinousLearn';
			}
			var allTextElements=svg.selectAll("text[id=Infosys],text[id=StatisticalAnalyst],text[id=ResearchAssistant],text[id=MicronIntern],text[id=ProcessEngg],text[id=SystemsEngineer],text[id=DataScientist]");
			allTextElements.attr("class","anchortext");
			allTextElements=svg.selectAll("text[id=Sathyabama],text[id=UniversityOfHouston],text[id=ContinousLearn]");
			allTextElements.attr("class","anchortext2");

			var anchortexthover='anchortext2hover';
			var hoverTextElement=svg.selectAll("text[id="+selectedArea+"]");
			hoverTextElement.attr("class",anchortexthover);
		}

		var allLineElements=svg.selectAll("line[id=Infosys],line[id=StatisticalAnalyst],line[id=ResearchAssistant],line[id=MicronIntern],line[id=ProcessEngg],line[id=SystemsEngineer],line[id=DataScientist],line[id=Sathyabama],line[id=UniversityOfHouston],line[id=ContinousLearn]");
		allLineElements.attr("class","anchorline");

		var hoverLineElement=svg.selectAll("line[id="+selectedArea+"]");
		hoverLineElement.attr("class","anchorlinehover");

		allLineElements=svg.selectAll("line[id=ML_Infosys],line[id=ML_StatisticalAnalyst],line[id=ML_ResearchAssistant],line[id=ML_MicronIntern],line[id=ML_ProcessEngg],line[id=ML_SystemsEngineer],line[id=ML_DataScientist]");
		allLineElements.attr("class","workline");
		allLineElements=svg.selectAll("line[id=ML_Sathyabama],line[id=ML_UniversityOfHouston],line[id=ML_ContinousLearn]");
		allLineElements.attr("class","learnline");

		hoverLineElement=svg.selectAll("line[id=ML_"+selectedArea+"]");
		hoverLineElement.attr("class","anchorlinehover");

		svg.selectAll("path.bottomline").remove();

		var lineData1= [ { "x": 0,   "y": $("#graphHistory").height()*(1/2)+110},  { "x": posx-10,  "y": $("#graphHistory").height()*(1/2)+110},
						{ "x": posx,  "y": $("#graphHistory").height()*(1/2)+110-20}, { "x": posx+10,  "y": $("#graphHistory").height()*(1/2)+110},
						{ "x": $("#graphHistory").width(),  "y": $("#graphHistory").height()*(1/2)+110}];
		var lineData2 = [ { "x": $("#graphHistory").width(),  "y": $("#graphHistory").height()*(1/2)+110},
						{ "x": posx+10,  "y": $("#graphHistory").height()*(1/2)+110},
						{ "x": posx,  "y": $("#graphHistory").height()*(1/2)+110+20},
						{ "x": posx-10,  "y": $("#graphHistory").height()*(1/2)+110},
						{ "x": 0,   "y": $("#graphHistory").height()*(1/2)+110}];

		var lineGraph = svg.append("path")
						.attr("d", lineFunction(lineData1))
						.attr("class","bottomline");
		lineGraph = svg.append("path")
						.attr("d", lineFunction(lineData2))
						.attr("class","bottomline");
	}

	function appendLine(x1,y1,x2,y2,id,width,strokestyle,color){
		svg.append("svg:line")
				.attr("x1",x1)
				.attr("y1",y1)
				.attr("x2",x2)
				.attr("y2",y2)
				.attr("id", id)
				.attr("stroke-width", width)
				.attr("stroke-dasharray",strokestyle)
				.attr("stroke", color)
				.attr("fill", color);
	}
	function wrap(text, width) {
		text.each(function() {
			var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1, // ems
			x = text.attr("x"),
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width || word=='linebreak') {
					line.pop();
					tspan.text(line.join(" "));
					if(word!='linebreak'){
						line = [word];
					}else{
						line = [];
					}
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}
			}
		});
	}
	function widthCalc(val){
		if($( window ).width()>1024){return val;}
		else{return (val- (1024-$( window ).width())/10 );}
	}
}

function drawGraphAboutMe(){
	var smallCircleSize=0;
	var w = $('#graphAboutMe').width(), h = (function(){
			if($( window ).width()>700){return 600;}
			else{return 600-((700-$(window ).width())/2);}
		})();
    var jsonData;

    var force = d3.layout.force()
			.charge(
				function(d){
					if($( window ).width()>1024){return -4000;}
					else{return -$(window ).width();}
				})
			.distance(
				function(d){
					if($( window ).width()>700){return 150;}
					else{return $(window ).width()/10;}
				})
			.linkDistance(
				function(d){
					if($( window ).width()>700){return d.distance;}
					else{return d.distance*($(window ).width()/700);}
				})
			.gravity(0.00005)
			.size([w, h/2]);

    $("#graphAboutMeD3").remove();
    var svg = d3.select('#graphAboutMe')
		.append('svg')
		.attr("class", "image featured")
		.attr("id","graphAboutMeD3")
		.attr('width', w)
		.attr('height', h);

	svg.append("defs").selectAll("marker")
		.data(["math","artist","science","statistics"])
		.enter().append("marker")
		.attr("id", function(d) { return d; })
		.attr("viewBox", "0 -5 10 10")
		.attr("refX", 0)
		.attr("refY", -0.5)
		.attr("markerWidth", 7)
		.attr("markerHeight", 7)
		.attr("orient", "auto")
		.append("path")
		.attr("d", "M0,-5L10,0L0,5");

	var link = svg.selectAll(".link"),
	    node = svg.selectAll(".node");

    d3.json("aboutMe.json", function(json){
    	for(var i=json.nodes.length-1;i>=0;i--){
			if(json.nodes[i].name=="math"){
				json.nodes[i].x=$("#graphAboutMeD3").width()/2;
			}else if(json.nodes[i].name=="science"){
				json.nodes[i].x=($("#graphAboutMeD3").width()/2)-($("#graphAboutMeD3").width()/4);
			}else if(json.nodes[i].name=="artist"){
				json.nodes[i].x=($("#graphAboutMeD3").width()/2)+($("#graphAboutMeD3").width()/4);
			}else if(json.nodes[i].name=="data scientist"){
				json.nodes[i].x=($("#graphAboutMeD3").width()/2);
				json.nodes[i].y=($("#graphAboutMeD3").height())-100;
			}
    	};
    	jsonData=json;
    	update();
    });

    function update() {
		force
			.nodes(jsonData.nodes)
			.links(jsonData.links)
			.start();

		var path = svg.append("g").selectAll("path")
			.data(force.links())
			.enter().append("path")
			.attr("class", function(d) { return "link " + d.type; })
			.attr("marker-mid", function(d) { return "url(#" + d.type + ")"; });

		node = node
				.data(jsonData.nodes, function(d) { return d.id; });
		node.exit().remove();

		var nodeEnter = node.enter().append("g")
				.attr("class", "node")
				.on("click", click)
				.on("mouseover", function(d){
					d3.select(this).select("circle").transition()
						.duration(200)
						.attr("r", circleSizeMouseOver);
					path.style('stroke-width', function(l){
						if (d === l.source || d === l.target)
							return 2;
						else
							return 1;
					});
				})
				.on("mouseout", function(d){
					d3.select(this).select("circle").transition()
						.duration(800)
						.attr("r", circleSize);
					path.style('stroke-width', 1);
				})
				.call(force.drag);

		nodeEnter.append("svg:circle")
				.attr("r", circleSize)
				.style("fill", function(d) { return d.color; });

		var text = svg.append("svg:g")
				.selectAll("g")
				.data(force.nodes())
				.enter().append("svg:g")
				.attr("class", "nodeText");

		text.append("svg:text")
			.attr("x", 0)
			.attr("dy", ".35em")
			.attr("font-size",function(){
				if($( window ).width()>700){return "14px";}
				else{return "0.65em";}
			})
			.text(function(d) { return d.name; });

		text.select("text").call(wrap, smallCircleSize );

		force.on("tick", function() {
			path.attr("d", linkArc);
	        r=75;
	        node
	        .each(collide(.5))
	        .attr("cx", function(d) { return d.x = Math.max(r, Math.min(w - r, d.x)); })
	        .attr("cy", function(d) { return d.y = Math.max(r, Math.min(h - r, d.y)); });

	        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	        text.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		});

    };
    function linkArc(d) {
    	var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy)/1.5;
        if(d.target.x<w/2||d.source.x<w/2){
	    	return [
				"M",d.source.x,d.source.y,
				"A",dr,dr,0,0,0,d.target.x,d.target.y
			].join(" ");
		}else{
			return [
				"M",d.source.x,d.source.y,
				"A",dr,dr,0,0,1,d.target.x,d.target.y
			].join(" ");
		}
	}
    function circleSize(d){
		var circleSize=0;
		if($( window ).width()<700){circleSize=Math.sqrt(d.size) / (10+((700-$( window ).width())/60));}
		else{circleSize=Math.sqrt(d.size) / 9;}
		circleSize=circleSize || 4.5
		smallCircleSize=1.3*((smallCircleSize==0||smallCircleSize>circleSize)?circleSize:smallCircleSize);
		return circleSize;
    }
    function circleSizeMouseOver(d){
		var circleSize=0;
		if($( window ).width()<700){circleSize=Math.sqrt(d.size) / (10+((700-$( window ).width())/60));}
		else{circleSize=Math.sqrt(d.size) / 10;}
		circleSize=circleSize || 4.5
		smallCircleSize=1.3*((smallCircleSize==0||smallCircleSize>circleSize)?circleSize:smallCircleSize);
		return circleSize+10;
    }

    function tick() {
		r=75;
		node.attr("cx", function(d) { return d.x = Math.max(r, Math.min(w - r, d.x)); })
        	.attr("cy", function(d) { return d.y = Math.max(r, Math.min(h - r, d.y)); });

	  	link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}

	function click(d) {
	  if (d3.event.defaultPrevented) return; // ignore drag
	  force.start();
	}

	function collide(alpha) {
		var width = 960,
	    height = 500,
	    padding = 1.5, // separation between same-color circles
	    clusterPadding = 6, // separation between different-color circles
	    maxRadius = 12;
		var quadtree = d3.geom.quadtree(node);
		return function(d) {
			var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
			nx1 = d.x - r,
			nx2 = d.x + r,
			ny1 = d.y - r,
			ny2 = d.y + r;
			quadtree.visit(function(quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== d)) {
					var x = d.x - quad.point.x,
					y = d.y - quad.point.y,
					l = Math.sqrt(x * x + y * y),
					r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
					if (l < r) {
						l = (l - r) / l * alpha;
						d.x -= x *= l;
						d.y -= y *= l;
						quad.point.x += x;
						quad.point.y += y;
					}
				}
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			});
		};
	}
	function wrap(text, width) {
		text.each(function() {
			var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1, // ems
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
			if(words.length>1){
				dy=dy-((lineHeight*(words.length-1))/2);
				tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
			}

			while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
				}
			}
		});
	}

}

function drawGraphSkills(nodes){
	var width = $('#graphSkills').width(), height = (function(){
			if($( window ).width()>700){return 600;}
			else{return 600-((700-$(window ).width())/2);}
		})();

	var fill = d3.scale.category10();
	var groups = d3.nest().key(function(d) { return d.group; }).entries(nodes);
	var groupPath = function(d) {
		if(d3.geom.hull(d.values.map(function(i) { return [i.x, i.y]; })).join("L") !=""){
			return "M" +
			d3.geom.hull(d.values.map(function(i) { return [i.x, i.y]; }))
			.join("L")
			+ "Z";
		}
	};
	var groupFill = function(d, i) { return fill(i); };

	var padding = 3,
	    radius = d3.scale.sqrt().range([0, 12]);

	var forceSkills = d3.layout.force()
		.nodes(nodes)
		.size([width, height])
		.gravity(.02)
		.charge(0)
		.on("tick", tickSkills)
		.start();

	var timeoutID;

	$("#graphSkillsD3").remove();

	var svg = d3.select('#graphSkills').append("svg")
		.attr("class", "image featured")
		.attr("id","graphSkillsD3")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(0,0)");

	var circle = svg.selectAll("circle")
		.data(nodes)
		.enter().append("circle")
		.attr("class", "skillsCircle")
		.attr("r", function(d) {
			return circleRadCalc(d.radius);
		})
		.on("mouseover", function(d){
			cancelRestoreImgOpacity();
			for(var i=1;i<=groups.length;i++){
				if(i==d.group){
					$(".skillsImageGroup"+d.group).css('opacity','1');
					$("#graphSkillsDesc").html(skillsNodeDesc[d.group]+"<br>");
				}else{
					$(".skillsImageGroup"+i).css('opacity','0.1');
				}
			};
		})
		.on("mouseout", function(d){
			timeoutID = window.setTimeout(restoreImgOpacity,500);
		})
		.style("stroke", function(d) { return d.color; })
		.style("fill", function(d) { return d.color; })
		.style("fill-opacity","0.0")
		.style("stroke-opacity","0.0")
		.call(forceSkills.drag);

	var image = svg.append("svg:g")
			.selectAll("g")
			.data(forceSkills.nodes())
			.enter().append("svg:image")
			.attr("class", "skillsImage")
			.attr("class", function(d) { return "skillsImage skillsImageGroup"+d.group; })
			.attr("xlink:href", function(d) { return "https://joelcthomas.com/images/skills/"+d.name+".png"; })
			.attr("width", function(d) { return widthCalc(d.width)+"px";})
			.attr("height", function(d) { return widthCalc(d.height)+"px";});

	function tickSkills(e) {
        var r=75;
		circle
			.each(cluster(50 * e.alpha * e.alpha))
			.each(collide(0.75))
			.attr("cx", function(d) { return d.x = Math.max(r, Math.min(width - r, d.x)); })
        	.attr("cy", function(d) { return d.y = Math.max(r, Math.min(height - r, d.y)); });
		image.attr("transform", function(d) { return "translate(" + (d.x-widthCalc(d.width)/2) + "," + (d.y-widthCalc(d.height)/2) + ")"; });

		svg.selectAll("path")
		.data(groups)
			.attr("d", groupPath)
		.enter().insert("path", "circle")
			.style("fill", groupFill)
			.style("stroke", groupFill)
			.style("stroke-width", 40)
			.style("stroke-linejoin", "round")
			.style("opacity", 0.08)
			.attr("d", groupPath);
	}

	function restoreImgOpacity(){
		$("#graphSkillsDesc").html("<br>");
		for(var i=1;i<=groups.length;i++){
			$(".skillsImageGroup"+i).css('opacity','1');
		};
	}
	function cancelRestoreImgOpacity(){
		window.clearTimeout(timeoutID);
	}

	// Move d to be adjacent to the cluster node.
	function cluster(alpha) {
	  var max = {};

	  // Find the largest node for each cluster.
	  nodes.forEach(function(d) {
	    if (!(d.color in max) || (d.radius > max[d.color].radius)) {
	      max[d.color] = d;
	    }
	  });

	  return function(d) {
	    var node = max[d.color],
	        l,
	        r,
	        x,
	        y,
	        i = -1;

	    if (node == d) return;

	    x = d.x - node.x;
	    y = d.y - node.y;
	    l = Math.sqrt(x * x + y * y);
	    r = d.radius + node.radius;
	    if (l != r) {
	      l = (l - r) / l * alpha;
	      d.x -= x *= l;
	      d.y -= y *= l;
	      node.x += x;
	      node.y += y;
	    }
	  };
	}

	// Resolves collisions between d and all other circles.
	function collide(alpha) {
	  var quadtree = d3.geom.quadtree(nodes);
	  return function(d) {
	    var r = circleRadCalc(d.radius) + circleRadCalc(radius.domain()[1]) + Math.max(padding, 105),
	        nx1 = d.x - r,
	        nx2 = d.x + r,
	        ny1 = d.y - r,
	        ny2 = d.y + r;
	    quadtree.visit(function(quad, x1, y1, x2, y2) {
	      if (quad.point && (quad.point !== d)) {
	        var x = d.x - quad.point.x,
	            y = d.y - quad.point.y,
	            l = Math.sqrt(x * x + y * y),
	            r = circleRadCalc(d.radius) + circleRadCalc(quad.point.radius) + (d.cluster === quad.point.cluster ? padding : 105);
	        if (l < r) {
	          l = (l - r) / l * alpha;
	          d.x -= x *= l;
	          d.y -= y *= l;
	          quad.point.x += x;
	          quad.point.y += y;
	        }
	      }
	      return x1 > nx2
	          || x2 < nx1
	          || y1 > ny2
	          || y2 < ny1;
	    });
	  };
	}

	function widthCalc(val){
		if($( window ).width()>1024){return val;}
		else{return (val- (1024-$( window ).width())/19 );}
	}

	function circleRadCalc(dRadius){
		if($( window ).width()>1024){return dRadius;}
		else{
			return (dRadius- ((1024-$( window ).width())/19) );
		}
	}

}
