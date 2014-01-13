

/***************************************************************
*
*
****************************************************************/

CustomModelMultiBarStacked = function () {
	//============================================================
	// Public Variables with Default Settings
	//------------------------------------------------------------
	var margin = {
		top : 0,
		right : 0,
		bottom : 0,
		left : 0
	},
	width = 960,
	height = 500,
	x = d3.scale.linear(),
	y = d3.scale.linear(),
	id = Math.floor(Math.random() * 10000) //Create semi-unique ID in case user doesn't select one
,
	getX = function (d) {
		return d.x
	},
	getY = function (d) {
		return d.y
	}, 
    forceX = []
    ,
	forceY = [0]// 0 is forced by default.. this makes sense for the majority of bar graphs... user can always do chart.forceY([]) to remove
,
	clipEdge = true,
	stacked = true,
	color = nv.utils.defaultColor(),
	delay = 1200,
	xDomain,
	yDomain,
	dispatch = d3.dispatch('chartClick', 'elementClick', 'elementDblClick', 'elementMouseover', 'elementMouseout');
	//============================================================
	//============================================================
	// Private Variables
	//------------------------------------------------------------
	var x0,
	y0 //used to store previous scales
;
	//============================================================
	function chart(selection) {
        
		selection.each(function (data) {
			var availableWidth = width - margin.left - margin.right,
			availableHeight = height - margin.top - margin.bottom,
			container = d3.select(this);
			
			if (stacked)
				data = d3.layout.stack()
						.offset('zero')
						.values(function (d) {
							return d.values
						})
						.y(getY)
						(data);
            
			//add series index to each data point for reference
			data = data.map(function (series, i) {
					series.values = series.values.map(function (point) {
							point.series = i;
							return point;
						});
					return series;
				});
			//------------------------------------------------------------
			// Setup Scales
			// remap and flatten the data for use in calculating the scales' domains
			var seriesData = (xDomain && yDomain) ? [] : // if we know xDomain and yDomain, no need to calculate
			data.map(function (d) {
				return d.values.map(function (d, i) {
					return {
						x : getX(d, i),
						y : getY(d, i),
						y0 : d.y0
					}
				})
			});
			/*
            x.domain(d3.merge(seriesData).map(function (d) {
					return d.x
				}))
			.rangeBands([0, availableWidth], .1);
            */
            x .domain(xDomain || d3.extent(data[0].values.map(getX).concat(forceX) ))
                  .range([0, availableWidth]);
            
            
			y.domain(yDomain || d3.extent(d3.merge(seriesData).map(function (d) {
						return d.y + (stacked ? d.y0 : 0)
					}).concat(forceY)))
			.range([availableHeight, 0]);
			// If scale's domain don't have a range, slightly adjust to make one... so a chart can show a single data point
			if (x.domain()[0] === x.domain()[1] || y.domain()[0] === y.domain()[1])
				singlePoint = true;
			if (x.domain()[0] === x.domain()[1])
				x.domain()[0] ?
				x.domain([x.domain()[0] - x.domain()[0] * 0.01, x.domain()[1] + x.domain()[1] * 0.01])
				 : x.domain([-1, 1]);
			if (y.domain()[0] === y.domain()[1])
				y.domain()[0] ?
				y.domain([y.domain()[0] + y.domain()[0] * 0.01, y.domain()[1] - y.domain()[1] * 0.01])
				 : y.domain([-1, 1]);
			x0 = x0 || x;
			y0 = y0 || y;
            
			//------------------------------------------------------------
			//------------------------------------------------------------
			// Setup containers and skeleton of chart
			var wrap = container.selectAll('g.nv-wrap.nv-multibar').data([data]);
			var wrapEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-multibar');
			var defsEnter = wrapEnter.append('defs');
			var gEnter = wrapEnter.append('g');
			var g = wrap.select('g')
				gEnter.append('g').attr('class', 'nv-groups');
			wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
			//------------------------------------------------------------
			defsEnter.append('clipPath')
			.attr('id', 'nv-edge-clip-' + id)
			.append('rect');
			wrap.select('#nv-edge-clip-' + id + ' rect')
			.attr('width', availableWidth)
			.attr('height', availableHeight);
			g.attr('clip-path', clipEdge ? 'url(#nv-edge-clip-' + id + ')' : '');
			var groups = wrap.select('.nv-groups').selectAll('.nv-group')
				.data(function (d) {
					return d
				}, function (d) {
					return d.key
				});
			groups.enter().append('g')
			.style('stroke-opacity', 1e-6)
			.style('fill-opacity', 1e-6);
			d3.transition(groups.exit())
			//.style('stroke-opacity', 1e-6)
			//.style('fill-opacity', 1e-6)
			.selectAll('rect.nv-bar')
			.delay(function (d, i) {
				return i * delay / data[0].values.length
			})
			.attr('y', function (d) {
				return stacked ? y0(d.y0) : y0(0)
			})
			.attr('height', 0)
			.remove();
			groups
			.attr('class', function (d, i) {
				return 'nv-group nv-series-' + i
			})
			.classed('hover', function (d) {
				return d.hover
			})
			.style('fill', function (d, i) {
				return color(d, i)
			})
			.style('stroke', function (d, i) {
				return color(d, i)
			});
			d3.transition(groups)
			.style('stroke-opacity', 1)
			.style('fill-opacity', .75);
			var bars = groups.selectAll('rect.nv-bar')
				.data(function (d) {
					return d.values
				});
			bars.exit().remove();
			var barsEnter = bars.enter().append('rect')
				.attr('class', function (d, i) {
					return getY(d, i) < 0 ? 'nv-bar negative' : 'nv-bar positive'
				})
				.attr('x', 0 )
				.attr('y', function (d) {
					return y0(stacked ? d.y0 : 0)
				})
				.attr('height', 0)
				;
			bars
			.style('fill', function (d, i, j) {
				return color(d, j, i);
			})
			.style('stroke', function (d, i, j) {
				return color(d, j, i);
			})
			.on('mouseover', function (d, i) { //TODO: figure out why j works above, but not here
				d3.select(this).classed('hover', true);
				dispatch.elementMouseover({
					value : getY(d, i),
					point : d,
					series : data[d.series],
					pos : [x(getX(d, i)) + ((availableWidth / data[0].values.length) * .9 / data.length), y(getY(d, i) + (stacked ? d.y0 : 0))], // TODO: Figure out why the value appears to be shifted
					pointIndex : i,
					seriesIndex : d.series,
					e : d3.event
				});
			})
			.on('mouseout', function (d, i) {
				d3.select(this).classed('hover', false);
				dispatch.elementMouseout({
					value : getY(d, i),
					point : d,
					series : data[d.series],
					pointIndex : i,
					seriesIndex : d.series,
					e : d3.event
				});
			})
			.on('click', function (d, i) {
				dispatch.elementClick({
					value : getY(d, i),
					point : d,
					series : data[d.series],
					pos : [x(getX(d, i)) + ((availableWidth / data[0].values.length) * .9 / data.length), y(getY(d, i) + (stacked ? d.y0 : 0))], // TODO: Figure out why the value appears to be shifted
					pointIndex : i,
					seriesIndex : d.series,
					e : d3.event
				});
				d3.event.stopPropagation();
			})
			.on('dblclick', function (d, i) {
				dispatch.elementDblClick({
					value : getY(d, i),
					point : d,
					series : data[d.series],
					pos : [x(getX(d, i)) + ((availableWidth / data[0].values.length) * .9 / data.length), y(getY(d, i) + (stacked ? d.y0 : 0))], // TODO: Figure out why the value appears to be shifted
					pointIndex : i,
					seriesIndex : d.series,
					e : d3.event
				});
				d3.event.stopPropagation();
			});
			bars
			.attr('class', function (d, i) {
				return getY(d, i) < 0 ? 'nv-bar negative' : 'nv-bar positive'
			})
			.attr('transform', function (d, i) {
				return 'translate(' + x(getX(d, i)) + ',0)';
			})
            
			if (stacked)
				d3.transition(bars)
				.delay(function (d, i) {
					return i * delay / data[0].values.length
				})
				.attr('y', function (d, i) {
					return y(getY(d, i) + (stacked ? d.y0 : 0));
				})
				.attr('height', function (d, i) {
					return Math.abs(y(d.y + (stacked ? d.y0 : 0)) - y((stacked ? d.y0 : 0)))
				})
                .attr('transform', function(d,i) { return 'translate(' + (x(getX(d,i)) - ((availableWidth / data[0].values.length) * .5)) + ',0)'; })
                .attr('width', (availableWidth / data[0].values.length) * .9)
				.each('end', function () {
					d3.transition(d3.select(this))
					.attr('x', function (d, i) {
						return stacked ? 0 : (d.series * (availableWidth / data[0].values.length) * .9)
					})
					;
				})
			else
					d3.transition(bars)
					.delay(function (d, i) {
						return i * delay / data[0].values.length
					})
					.attr('x', function (d, i) {
						return d.series * (availableWidth / data[0].values.length) * .1
					})
					.attr('width',(availableWidth / data[0].values.length) * .2 )
					.each('end', function () {
						d3.transition(d3.select(this))
						.attr('y', function (d, i) {
							return getY(d, i) < 0 ?
							y(0) :
							y(getY(d, i))
						})
						.attr('height', function (d, i) {
							return Math.abs(y(getY(d, i)) - y(0))
						});
					})
					//store old scales for use in transitions on update
					x0 = x.copy();
			y0 = y.copy();
		});
		return chart;
	}
	//============================================================
	// Expose Public Variables
	//------------------------------------------------------------
	chart.dispatch = dispatch;
	chart.x = function (_) {
		if (!arguments.length)
			return getX;
		getX = _;
		return chart;
	};
	chart.y = function (_) {
		if (!arguments.length)
			return getY;
		getY = _;
		return chart;
	};
	chart.margin = function (_) {
		if (!arguments.length)
			return margin;
		margin.top = typeof _.top != 'undefined' ? _.top : margin.top;
		margin.right = typeof _.right != 'undefined' ? _.right : margin.right;
		margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
		margin.left = typeof _.left != 'undefined' ? _.left : margin.left;
		return chart;
	};
	chart.width = function (_) {
		if (!arguments.length)
			return width;
		width = _;
		return chart;
	};
	chart.height = function (_) {
		if (!arguments.length)
			return height;
		height = _;
		return chart;
	};
	chart.xScale = function (_) {
		if (!arguments.length)
			return x;
		x = _;
		return chart;
	};
	chart.yScale = function (_) {
		if (!arguments.length)
			return y;
		y = _;
		return chart;
	};
	chart.xDomain = function (_) {
		if (!arguments.length)
			return xDomain;
		xDomain = _;
		return chart;
	};
	chart.yDomain = function (_) {
		if (!arguments.length)
			return yDomain;
		yDomain = _;
		return chart;
	};
      chart.forceX = function(_) {
    if (!arguments.length) return forceX;
    forceX = _;
    return chart;
  };

	chart.forceY = function (_) {
		if (!arguments.length)
			return forceY;
		forceY = _;
		return chart;
	};
	chart.stacked = function (_) {
		if (!arguments.length)
			return stacked;
		stacked = _;
		return chart;
	};
	chart.clipEdge = function (_) {
		if (!arguments.length)
			return clipEdge;
		clipEdge = _;
		return chart;
	};
	chart.color = function (_) {
		if (!arguments.length)
			return color;
		color = nv.utils.getColor(_);
		return chart;
	};
	chart.id = function (_) {
		if (!arguments.length)
			return id;
		id = _;
		return chart;
	};
	chart.delay = function (_) {
		if (!arguments.length)
			return delay;
		delay = _;
		return chart;
	};
	//============================================================
	return chart;
}


/***************************************************************
*
*
****************************************************************/

CustomLinePlusBarChart = function () {
	//============================================================
	// Public Variables with Default Settings
	//------------------------------------------------------------
	var lines = nv.models.line(),
	bars = CustomModelMultiBarStacked(),
	xAxis = nv.models.axis(),
	y1Axis = nv.models.axis(),
	y2Axis = nv.models.axis(),
	legend = nv.models.legend();
	var margin = {
		top : 30,
		right : 60,
		bottom : 50,
		left : 60
	},
	width = null,
	height = null,
	getX = function (d) {
		return d.x
	},
	getY = function (d) {
		return d.y
	},
	color = nv.utils.defaultColor(),
	showLegend = true,
	tooltips = true,
	tooltip = function (key, x, y, e, graph) {
		return '<h3>' + key + '</h3>' +
		'<p>' + y + ' at ' + x + '</p>';
	},
	x,
	y1,
	y2,
	noData = "No Data Available.",
	dispatch = d3.dispatch('tooltipShow', 'tooltipHide');
	lines
	.clipEdge(false);
	xAxis
	.orient('bottom')
	.tickPadding(5);
	y1Axis
	.orient('left');
	y2Axis
	.orient('right');
	//============================================================
	//============================================================
	// Private Variables
	//------------------------------------------------------------
	var showTooltip = function (e, offsetElement) {
		var left = e.pos[0] + (offsetElement.offsetLeft || 0),
		top = e.pos[1] + (offsetElement.offsetTop || 0),
		x = xAxis.tickFormat()(lines.x()(e.point, e.pointIndex)),
		y = (e.series.bar ? y1Axis : y2Axis).tickFormat()(lines.y()(e.point, e.pointIndex)),
		content = tooltip(e.series.key, x, y, e, chart);
		nv.tooltip.show([left, top], content, e.value < 0 ? 'n' : 's', null, offsetElement);
	};
	//------------------------------------------------------------
	function chart(selection) {
		selection.each(function (data) {
			var container = d3.select(this),
			that = this;
			var availableWidth = (width || parseInt(container.style('width')) || 960)
			 - margin.left - margin.right,
			availableHeight = (height || parseInt(container.style('height')) || 400)
			 - margin.top - margin.bottom;
			chart.update = function () {
				chart(selection)
			};
			chart.container = this;
			//------------------------------------------------------------
			// Display No Data message if there's nothing to show.
			if (!data || !data.length || !data.filter(function (d) {
					return d.values.length
				}).length) {
				var noDataText = container.selectAll('.nv-noData').data([noData]);
				noDataText.enter().append('text')
				.attr('class', 'nvd3 nv-noData')
				.attr('dy', '-.7em')
				.style('text-anchor', 'middle');
				noDataText
				.attr('x', margin.left + availableWidth / 2)
				.attr('y', margin.top + availableHeight / 2)
				.text(function (d) {
					return d
				});
				return chart;
			} else {
				container.selectAll('.nv-noData').remove();
			}
			//------------------------------------------------------------
			//------------------------------------------------------------
			// Setup Scales
			x = xAxis.scale();
			y1 = bars.yScale();
			y2 = lines.yScale();
			var dataBars = data.filter(function (d) {
					return !d.disabled && d.bar
				});
			var dataLines = data.filter(function (d) {
					return !d.bar
				}); 
			// removed the !d.disabled clause here to fix Issue #240
			//TODO: try to remove x scale computation from this layer
			var series1 = data.filter(function (d) {
					return !d.disabled && d.bar
				})
				.map(function (d) {
					return d.values.map(function (d, i) {
						return {
							x : getX(d, i),
							y : getY(d, i)
						}
					})
				});
			var series2 = data.filter(function (d) {
					return !d.disabled && !d.bar
				})
				.map(function (d) {
					return d.values.map(function (d, i) {
						return {
							x : getX(d, i),
							y : getY(d, i)
						}
					})
				});
			x.domain(d3.extent(d3.merge(series1.concat(series2)), function (d) {
					return d.x
				}))
			.range([0, availableWidth]);
			/*
			x .domain(d3.extent(d3.merge(data.map(function(d) { return d.values })), getX ))
			.range([0, availableWidth]);
			y1 .domain(d3.extent(d3.merge(dataBars), function(d) { return d.y } ))
			.range([availableHeight, 0]);
			y2 .domain(d3.extent(d3.merge(dataLines), function(d) { return d.y } ))
			.range([availableHeight, 0]);
			 */
			//------------------------------------------------------------
			//------------------------------------------------------------
			// Setup containers and skeleton of chart
			var wrap = d3.select(this).selectAll('g.nv-wrap.nv-linePlusBar').data([data]);
			var gEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-linePlusBar').append('g');
			var g = wrap.select('g');
			gEnter.append('g').attr('class', 'nv-x nv-axis');
			gEnter.append('g').attr('class', 'nv-y1 nv-axis');
			gEnter.append('g').attr('class', 'nv-y2 nv-axis');
			gEnter.append('g').attr('class', 'nv-barsWrap');
			gEnter.append('g').attr('class', 'nv-linesWrap');
			gEnter.append('g').attr('class', 'nv-legendWrap');
			//------------------------------------------------------------
			//------------------------------------------------------------
			// Legend
			if (showLegend) {
				legend.width(availableWidth / 2);
				g.select('.nv-legendWrap')
				.datum(data.map(function (series) {
                    
                    if(series.showLegend != false) {
						series.originalKey = series.originalKey === undefined ? series.key : series.originalKey;
						series.key = series.originalKey + (series.bar ? ' (left axis)' : ' (right axis)');
						
                    }
                    else
                        series.key = ''
                    
                    return series;
					}))
				.call(legend);
				if (margin.top != legend.height()) {
					margin.top = legend.height();
					availableHeight = (height || parseInt(container.style('height')) || 400)
					 - margin.top - margin.bottom;
				}
				g.select('.nv-legendWrap')
				.attr('transform', 'translate(' + (availableWidth / 2) + ',' + (-margin.top) + ')');
			}
			//------------------------------------------------------------
			wrap.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
			//------------------------------------------------------------
			// Main Chart Component(s)
			lines
			.width(availableWidth)
			.height(availableHeight)
			.color(data.map(function (d, i) {
					return d.color || color(d, i);
				}).filter(function (d, i) {
					return !data[i].disabled && !data[i].bar
				}))
			bars
			.width(availableWidth)
			.height(availableHeight)
			.color(data.map(function (d, i) {
					return d.color || color(d, i);
				}).filter(function (d, i) {
					return !data[i].disabled && data[i].bar
				}))
			var barsWrap = g.select('.nv-barsWrap')
				.datum(dataBars.length ? dataBars : [{
							values : []
						}
					])
				var linesWrap = g.select('.nv-linesWrap')
				.datum(!dataLines[0].disabled ? dataLines : [{
							values : []
						}
					]);
			//.datum(!dataLines[0].disabled ? dataLines : [{values:dataLines[0].values.map(function(d) { return [d[0], null] }) }] );
			d3.transition(barsWrap).call(bars);
			d3.transition(linesWrap).call(lines);
			//------------------------------------------------------------
			//------------------------------------------------------------
			// Setup Axes
			xAxis
			.ticks(availableWidth / 100)
			.tickSize(-availableHeight, 0);
			g.select('.nv-x.nv-axis')
			.attr('transform', 'translate(0,' + y1.range()[0] + ')');
			d3.transition(g.select('.nv-x.nv-axis'))
			.call(xAxis);
			y1Axis
			.scale(y1)
			.ticks(availableHeight / 36)
			.tickSize(-availableWidth, 0);
			d3.transition(g.select('.nv-y1.nv-axis'))
			.style('opacity', dataBars.length ? 1 : 0)
			.call(y1Axis);
			y2Axis
			.scale(y2)
			.ticks(availableHeight / 36)
			.tickSize(dataBars.length ? 0 : -availableWidth, 0); // Show the y2 rules only if y1 has none
			g.select('.nv-y2.nv-axis')
			.style('opacity', dataLines.length ? 1 : 0)
			.attr('transform', 'translate(' + x.range()[1] + ',0)');
			d3.transition(g.select('.nv-y2.nv-axis'))
			.call(y2Axis);
			//------------------------------------------------------------
			//============================================================
			// Event Handling/Dispatching (in chart's scope)
			//------------------------------------------------------------
			legend.dispatch.on('legendClick', function (d, i) {
				d.disabled = !d.disabled;
				if (!data.filter(function (d) {
						return !d.disabled
					}).length) 
				{
					data.map(function (d) {
						d.disabled = false;
						wrap.selectAll('.nv-series').classed('disabled', false);
						return d;
					});
				}
				selection.transition().call(chart);
			});
			dispatch.on('tooltipShow', function (e) {
				if (tooltips)
					showTooltip(e, that.parentNode);
			});
			//============================================================
		});
		return chart;
	}
	//============================================================
	// Event Handling/Dispatching (out of chart's scope)
	//------------------------------------------------------------
	lines.dispatch.on('elementMouseover.tooltip', function (e) {
		e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top];
		dispatch.tooltipShow(e);
	});
	lines.dispatch.on('elementMouseout.tooltip', function (e) {
		dispatch.tooltipHide(e);
	});
	bars.dispatch.on('elementMouseover.tooltip', function (e) {
		e.pos = [e.pos[0] + margin.left, e.pos[1] + margin.top];
		dispatch.tooltipShow(e);
	});
	bars.dispatch.on('elementMouseout.tooltip', function (e) {
		dispatch.tooltipHide(e);
	});
	dispatch.on('tooltipHide', function () {
		if (tooltips)
			nv.tooltip.cleanup();
	});
	//============================================================
	//============================================================
	// Expose Public Variables
	//------------------------------------------------------------
	// expose chart's sub-components
	chart.dispatch = dispatch;
	chart.legend = legend;
	chart.lines = lines;
	chart.bars = bars;
	chart.xAxis = xAxis;
	chart.y1Axis = y1Axis;
	chart.y2Axis = y2Axis;
	d3.rebind(chart, lines, 'defined', 'size', 'clipVoronoi', 'interpolate');
	//TODO: consider rebinding x, y and some other stuff, and simply do soemthign lile bars.x(lines.x()), etc.
	//d3.rebind(chart, lines, 'x', 'y', 'size', 'xDomain', 'yDomain', 'forceX', 'forceY', 'interactive', 'clipEdge', 'clipVoronoi', 'id');
	chart.x = function (_) {
		if (!arguments.length)
			return getX;
		getX = _;
		lines.x(_);
		bars.x(_);
		return chart;
	};
	chart.y = function (_) {
		if (!arguments.length)
			return getY;
		getY = _;
		lines.y(_);
		bars.y(_);
		return chart;
	};
	chart.margin = function (_) {
		if (!arguments.length)
			return margin;
		margin.top = typeof _.top != 'undefined' ? _.top : margin.top;
		margin.right = typeof _.right != 'undefined' ? _.right : margin.right;
		margin.bottom = typeof _.bottom != 'undefined' ? _.bottom : margin.bottom;
		margin.left = typeof _.left != 'undefined' ? _.left : margin.left;
		return chart;
	};
	chart.width = function (_) {
		if (!arguments.length)
			return width;
		width = _;
		return chart;
	};
	chart.height = function (_) {
		if (!arguments.length)
			return height;
		height = _;
		return chart;
	};
	chart.color = function (_) {
		if (!arguments.length)
			return color;
		color = nv.utils.getColor(_);
		legend.color(color);
		return chart;
	};
	chart.showLegend = function (_) {
		if (!arguments.length)
			return showLegend;
		showLegend = _;
		return chart;
	};
	chart.tooltips = function (_) {
		if (!arguments.length)
			return tooltips;
		tooltips = _;
		return chart;
	};
	chart.tooltipContent = function (_) {
		if (!arguments.length)
			return tooltip;
		tooltip = _;
		return chart;
	};
	chart.noData = function (_) {
		if (!arguments.length)
			return noData;
		noData = _;
		return chart;
	};
	//============================================================
	return chart;
}
