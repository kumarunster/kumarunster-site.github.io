/*

<style>

#chart svg {
  height: 400px;
}

</style>

<div>
    <input id="workDone" value="" placeholder="Work done, in SP"/>
    <input id="addedToBacklog" placeholder="Added to Backlog, in SP"/>
    <button id="addBtn" onClick="addIteration();" >Add</button>
    <button id="removeBtn" onClick="removeLastIteration();" >Remove</button>
    
</div>
<div id="chart">
  <svg></svg>
</div>



*/





//see http://mnogosdelal.ru/slidecasts/project-estimation/

//http://jsfiddle.net/3F8h4/
//http://jsfiddle.net/3F8h4/2/
//http://jsfiddle.net/3F8h4/17/

function cdf(to, mean, sigma) {
    var z = (to-mean)/Math.sqrt(2*sigma*sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}



var backlog = [
    {task: "Create architecture concept", storyPoints: "8"},
    {task: "Create prototype", storyPoints: "8"},
    {task: "Implement User Story 1", storyPoints: "2"},
    {task: "Implement User Story 2", storyPoints: "4"},
    {task: "Implement User Story 3", storyPoints: "8"},
    {task: "Implement User Story 4", storyPoints: "16"},
    {task: "Implement User Story 5", storyPoints: "2"},
    {task: "Implement User Story 6", storyPoints: "4"},
    {task: "Implement User Story 7", storyPoints: "8"},
    {task: "Implement User Story 8", storyPoints: "16"},
    {task: "Implement User Story 9", storyPoints: "2"},
    {task: "Implement User Story 10", storyPoints: "4"},
    {task: "Documentation development", storyPoints: "16"},
    {task: "Release", storyPoints: "16"}
];

var WorkToDo = 0;
$.each(backlog, function() {
	WorkToDo= WorkToDo + parseInt(this.storyPoints);
});

console.log("WorkToDo: " + WorkToDo);

var resultTable = new Array();

var MeanVelocity = 15;
var MeanInflow = 5;
var VelocityDev = 5;
var InflowDev = 10;

var mean = 0;
var sigma = 0;

var probability = 0;
var cumulative = 0;

var ConfidenceLevel = 0.8; //80 percent

var cumulative = 0;
var cumulativeLastIteration = 0;

var cumalitiveValues = [];
var confidenceValues = [];
var resultIterationCoord = [];

var maxIterations = 20;



var calculateProbability = function(backlog, startIteration) {

    mean = 0;
    sigma = 0;
    
    cumulative = 0;
    cumulativeLastIteration = 0;
    
    cumalitiveValues = [];
    confidenceValues = [];
    resultIterationCoord = [];
    
    confidenceValues.push({x: 0, y: ConfidenceLevel});
    confidenceValues.push({x: maxIterations, y: ConfidenceLevel});

for(var iterationFill = 0; iterationFill<startIteration; iterationFill++)
    cumalitiveValues.push({x: iterationFill, y: 0});
    
for(var iteration=startIteration; iteration<=maxIterations; iteration++) {
    console.log('iterate: ' + iteration);
    mean = (iteration-currentIteration)*(MeanVelocity-MeanInflow);
    sigma =Math.sqrt((iteration-currentIteration))*Math.sqrt(VelocityDev*VelocityDev + InflowDev*InflowDev);
    
    cumulative = 1 - cdf(backlog,mean,sigma);
    
    cumalitiveValues.push({x: iteration, y: cumulative});
    
    
    if(cumulative>ConfidenceLevel && cumulativeLastIteration<=ConfidenceLevel) {
        console.log("all work probably done in iteration: " + iteration );
        resultIterationCoord.push({x: iteration, y: cumulative});
        resultIterationCoord.push({x: iteration, y: 0.0});
    }
    else {
    }
        
        
    cumulativeLastIteration = cumulative;    
};

console.log("last cumulative result: " + cumulativeLastIteration );

}
/*
var progress = [
{todo: 144, done: 0, added: 0}, 
{todo: 130, done: 14, added: 5},
{todo: 120, done: 15, added: 5},
{todo: 115, done: 10, added: 15},
{todo: 110, done: 20, added: 5},
{todo: 100, done: 15, added: 0},
{todo: 80, done: 20, added: 5},
{todo: 65, done: 20, added: 0},
{todo: 50, done: 15, added: 5},
{todo: 40, done: 10, added: 0},
{todo: 25, done: 15, added: 15},
{todo: 30, done: 10, added: 0},
{todo: 20, done: 10, added: 30},
{todo: 40, done: 10, added: 10},
{todo: 30, done: 20, added: 5},
{todo: 10, done: 25, added: 0},
{todo: 0, done: 0, added: 0},
    {todo: 0, done: 0, added: 0},
    {todo: 0, done: 0, added: 0},
    {todo: 0, done: 0, added: 0},
    {todo: 0, done: 0, added: 0}
];

*/



var progress = [
{todo: WorkToDo, done: 0, added: 0}
];


for(var iteration=1; iteration<=maxIterations; iteration++) {
    progress.push({todo: 0, done: 0, added: 0});
}


chartData = [];

var createChartData = function() {
    
    calculateProbability(progress[currentIteration].todo + progress[currentIteration].added, currentIteration);
    
var filler = [];
var lastFillerValue = 0;
for (var idx=progress.length-1; idx>=0; idx--) {

   filler.unshift({x:idx, y: lastFillerValue});    
    lastFillerValue+=parseInt(progress[idx].added);
}


var addedToBacklog = [];
for(var idx =0; idx<progress.length; idx++) {
    addedToBacklog.push({ x: idx, y: progress[idx].added});
}


var todo = [];
for(var idx =0; idx<progress.length; idx++) {
    todo.push({ x: idx, y: progress[idx].todo});
}    
    chartData = [
      {
        values:filler,
      key: "",
      showLegend: false,
      bar: true,
      color: 'none'
     },
      
      {
        values: addedToBacklog,
      key: "Work added to Backlog",
      bar: true,
      color: '#298bde'
     },
      {
      values: todo,
      key: "Backlog",
      bar: true,
      color: '#56a700'
     },
    {
      values: cumalitiveValues,
      key: 'Probability',
      color: '#ff7f0e'
    },
    {
      values: confidenceValues,
      key: 'Confidence',
      color: 'rgba(0, 0, 0, 0.5)'
    },      
    {
      values: resultIterationCoord,
      key: 'Target Iteration',
      color: '#f00'
    }
    ];
    
}


var filler = [];


var d3selection = d3.select('#chart svg');
var chart = CustomLinePlusBarChart();

  chart.xAxis
      .axisLabel('Iteration');
    
   chart.y1Axis
         .axisLabel('SP')
        .tickFormat(d3.format(',f'));
  
  chart.y2Axis
      .axisLabel('Probability')
      .tickFormat(d3.format('.02f'));
    
    
window.d3selectionG = d3selection;
window.chartG = chart;   

var showChart = function() {

   
nv.addGraph(function() {
  
  chart.bars.forceY([0]);
    
   d3selection 
  .datum(window.chartData)
    .transition().duration(800)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});
}

var currentIteration = 0;

createChartData();

showChart();


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

window.addIteration = function() {
    
    var checkAndCleanValue = function(value) {
    	return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    }
    
    var workDone = checkAndCleanValue(document.querySelector('#workDone').value);
    var workAdded = checkAndCleanValue(document.querySelector('#addedToBacklog').value);
    
    
    //other parameter
    MeanVelocity = checkAndCleanValue(document.querySelector('#meanVelocity').value);
    MeanInflow = checkAndCleanValue(document.querySelector('#meanInflow').value);
    VelocityDev = checkAndCleanValue(document.querySelector('#velocityDev').value);
    InflowDev = checkAndCleanValue(document.querySelector('#inflowDev').value);
    ConfidenceLevel = checkAndCleanValue(document.querySelector('#confidenceLevel').value)/100;
    
    
    
    var workFromPrevious = progress[currentIteration].todo + progress[currentIteration].added;
    
    currentIteration++;
    
    var toDo = workFromPrevious-workDone;
    
    progress[currentIteration] = {todo: toDo < 0 ? 0 : toDo,
    							 done: workDone,
    							 added: workAdded};
    
    console.log('new values: ' + JSON.stringify(progress[currentIteration]));
    
/*    
    var chartDiv = document.querySelector('#chart');
    console.log('chartDiv: ' + chartDiv);
    chartDiv.innerHTML = '';
    var svg = 
    document.createElementNS("http://www.w3.org/2000/svg", "svg");
chartDiv.appendChild(svg);
  */  
    createChartData();
    
    showChart();
    
    /*
  .datum(chartData, function( d) {
   return data.indexOf( d);
}).call(window.chartG);
*/
    //showChart(progress);
}


window.removeLastIteration = function() {
    if(currentIteration>0) {
        
        document.querySelector('#workDone').value = progress[currentIteration].done;
        document.querySelector('#addedToBacklog').value = progress[currentIteration].added;
        
        progress[currentIteration] = {todo: 0, done: 0, added: 0};
        currentIteration--;
        
        
        createChartData();
    
        showChart();
    }
    
}
    