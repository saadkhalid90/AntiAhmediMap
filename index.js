let mapLocs;
let uniqueLocs;
let testRoad;
let multiplier = .5

let timeTrans = 1500;
let timeDelay = 0;

let dateSelect = '6/3/53';

let dateFocus;

async function readAndDraw(){
  mapLocs = await d3.tsv('Loc.tsv');
  testRoad = await d3.csv('Road_points 1953.csv');
  console.log(mapLocs);

  console.log(testRoad);

  let uniqueLocs = mapLocs.filter((v, i, s) => {
      let locIDs = s.map(d => d['Location ID']);
      return locIDs.indexOf(v['Location ID']) === i;
  });

  //let mapLocDate = mapLocs.filter(d => d.Date == dateSelect);
  mapLocDate = mapLocs;

  d3.select('svg.mapLocs')
    .selectAll('circle.pulsating')
    .data(mapLocDate)
    .enter()
    .append('circle')
    .attr('class', 'pulsating')
    .attr('cx', d => multiplier * d.X)
    .attr('cy', d => multiplier * d.Y)
    //.attr('r', '0px')
    .style('fill', 'teal')
    .style('stroke', '#212121')
    .style('stroke-width', '2px')
    .call(pulseTrans, timeTrans, timeDelay, "all");


  let roadPath = d3.select('svg.mapLocs')
    .selectAll('path.road')
    .data(testRoad)
    .enter()
    .append("path")
    .attr('class', 'road')
    .attr('d', d => makePathString(d.Points, multiplier))
    .style('fill', 'none')
    .style('stroke', 'purple')
    .style('stroke-linejoin', 'round')
    .style('stroke-linecap', 'round')
    .style('stroke-width', '4px')
    //.attr("stroke-dasharray", 502)
    //.attr("stroke-dashoffset", 0);

  let totalLength = roadPath.node().getTotalLength();

  // console.log(totalLength)
  //
  roadPath.style('stroke-opacity', 0.75)
    .attr("stroke-dasharray", totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
          .duration(3000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);

  d3.select('svg.mapLocs')
    .selectAll('circle.static')
    .data(uniqueLocs)
    .enter()
    .append('circle')
    .attr('class', 'static')
    .attr('cx', d => multiplier * d.X)
    .attr('cy', d => multiplier * d.Y)
    .attr('r', '5px')
    .style('fill', 'teal')
    .style('stroke', '#212121')
    .style('stroke-width', '2px')

  dateFocus = function(Date) {

    d3.select('svg.mapLocs')
      .selectAll('circle.pulsating')
      .remove();

    let mapFilt = Date == "all" ? mapLocDate : mapLocDate.filter(d => d.Date == Date);

    d3.select('svg.mapLocs')
      .selectAll('circle.pulsating')
      .data(mapFilt)
      .enter()
      .append('circle')
      .attr('class', 'pulsating')
      .attr('cx', d => multiplier * d.X)
      .attr('cy', d => multiplier * d.Y)
      //.attr('r', '0px')
      .style('fill', 'teal')
      .style('stroke', '#212121')
      .style('stroke-width', '2px')
      .call(pulseTrans, timeTrans, timeDelay, Date);

    let StatBub = d3.select('svg.mapLocs')
      .selectAll('circle.static')
      .raise();

    StatBub
      .filter(d => {
        let dateArr = d.DateList.split(' ');
        return dateArr.includes(Date);
      })
      .transition()
      .duration(500)
      .style('fill', 'yellow')

    StatBub
    .filter(d => {
      let dateArr = d.DateList.split(' ');
      return !dateArr.includes(Date);
      })
      .transition()
      .duration(500)
      .style('fill', 'teal')


  }


  function pulseTrans(selection, transDur, transDelay, date) {
    selection
      // .filter(d => {
      //   if (date == "all"){
      //     return true;
      //   } else {
      //     return (d.Date == date);
      //   }
      // })
      .attr('r', '0px')
      .style('stroke-opacity', 1)
      .style('fill-opacity', 1)

      .transition('pulse')
      .delay((d, i) => i * transDelay)
      .duration(transDur)
      .attr('r', '20px')
      .style('stroke-width', '3px')
      .style('stroke-opacity', 0)
      .style('fill-opacity', 0)
      // .each(function(d, i){
      //   let elem = this;
      //   d3.select(this)
      //     .transition()
      //     .on('end', function(){
      //       d3.select(elem)
      //         //.selectAll('circle.pulsating')
      //         .call(pulseTrans, 2500, 0);
      //     });
      // })
      .on('end', function(d, i){
        //console.log(this)
        if (date == "all"){
          d3//.select(this)
            .selectAll('circle.pulsating')
            .call(pulseTrans, timeTrans, 0, "all");
        }
        else {
          d3//.select(this)
            .selectAll('circle.pulsating')
            .filter(d => d.Date == date)
            .call(pulseTrans, timeTrans, 0, date);
        }

      });
      // .end()
      // .then()

  }

  d3.selectAll('circle.static')
    .on('mouseover', function(d, i){
      //console.log(this);
      d3.select(this).append('title')
        .text(d['Location Name'])
    })
}

readAndDraw();

function zoomInOut(selection, scale, translateArr, transDur){
    selection.transition()
            .duration(transDur)
            .style('transform', `translate(${translateArr[0]}px, ${translateArr[1]}px) scale(${scale})`)
}

// d3.select('img.mapBG').call(zoomIn, 1.1, 1000);
// d3.select('svg.mapLocs').call(zoomIn, 1.1, 1000);

function pictSVGZoom(scale, translateArr, transDur){
  // select both the image and the svg and apply transform to it
  return d3.selectAll('.zoomable')//.call(zoomInOut, scale, translateArr, transDur).end();
          .transition()
          .duration(transDur)
          .style('transform', `translate(${translateArr[0]}px, ${translateArr[1]}px) scale(${scale})`)
          .end();
}

function pictSVGZoomDate(scale, transDur, date, mapData, multiplier){
  // select both the image and the svg and apply transform to it

  //console.log(d3.select('img').node())


  let mapDataDate = mapData.filter(d => d.Date == date);

  //console.log(mapDataDate)
  //console.log(mapDataDate.map(d => d.X));
  let xAvg = average(mapDataDate.map(d => +d.X));
  let yAvg = average(mapDataDate.map(d => +d.Y));

  let xAvgScaled = xAvg * multiplier;
  let yAvgScaled = yAvg * multiplier;

  let xNorm = 923;
  let yNorm = 1025;

  let xExt = (xNorm/2) - xAvgScaled;
  let yExt = (yNorm/2) - yAvgScaled;

  let xScaled = xNorm * scale;
  let yScaled = yNorm * scale;

  let xLim = (xScaled - xNorm)/2;
  let yLim = (yScaled - yNorm)/2;

  xLim = (xExt >= 0) ? xLim : -xLim;
  yLim = (yExt >= 0) ? yLim : -yLim;

  let xTrans = Math.abs(xExt) > Math.abs(xLim) ? xLim : xExt;
  let yTrans = Math.abs(yExt) > Math.abs(yLim) ? yLim : yExt;

  let transArr = [xTrans, yTrans];

  // console.log("XY Lim", xLim, yLim);
  // console.log("XYExt", xExt, yExt);
  // console.log("Trans", transArr);

  // d3.select('img.mapBG').call(zoomInOut, scale, transArr, transDur);
  // d3.select('svg.mapLocs').call(zoomInOut, scale, transArr, transDur);

  //await pictSVGZoom(1, [0, 0], transDur);
  return pictSVGZoom(scale, transArr, transDur);

}

async function seqEvents(zoomfactor, dur){
  await pictSVGZoomDate(zoomfactor, dur, '28/2/53', mapLocs, 0.5);
  await pictSVGZoomDate(zoomfactor, dur, '1/3/53', mapLocs, 0.5);
  await pictSVGZoomDate(zoomfactor, dur, '2/3/53', mapLocs, 0.5);
  await pictSVGZoomDate(zoomfactor, dur, '3/3/53', mapLocs, 0.5);
  await pictSVGZoomDate(zoomfactor, dur, '4/3/53', mapLocs, 0.5);
  await pictSVGZoomDate(zoomfactor, dur, '5/3/53', mapLocs, 0.5);
  await pictSVGZoomDate(zoomfactor, dur, '6/3/53', mapLocs, 0.5);
}



function average(values) {
  let sum = values.reduce((previous, current) => current += previous);
  let avg = sum / values.length;

  return avg;
}


function makePathString(pointsString, multiplier){
  let pointsArr = pointsString.split(" ");
  pointsArr = pointsArr.map(d => +d * multiplier);
  console.log(pointsArr);
  pointsArr = pointsArr.map((d, i) => (i%2)==0 ? d : `,${d}L`);
  let pathStr = pointsArr.join("");
  pathStr = pathStr.substring(0, pathStr.length - 1);

  return `M${pathStr}`;
}

d3.selectAll('p.dateP')
  .on('click', function(d, i){
    let date= d3.select(this).html();
    let dataDate;
    let zoomVal;
    let dateMonth;
    let dateDay;

    d3.selectAll('p.dateP')
      .classed('clicked', false)
      //.style('color', 'white')
      .style('transform', 'scale(1.0)');

    // d3.selectAll('p.dateP:hover')
    //   .style('color', '#FFEB3B')

    d3.select(this)
      .classed('clicked', true)
      //.style('color', '#FFEB3B')
      .transition()
      //.duration(500)
      .style('transform', 'scale(1.2)');

    function dateHTMLToData(Date){
      switch (date) {
        case "Feb 28":
          dataDate = '28/2/53';
          zoomVal = 1.6;
          break;
        case "March 1":
          dataDate = '1/3/53';
          zoomVal = 1.4;
          break;
        case "March 2":
          dataDate = '2/3/53';
          zoomVal = 1.3;
          break;
        case "March 3":
          dataDate = '3/3/53';
          zoomVal = 1.65;
          break;
        case "March 4":
          dataDate = '4/3/53';
          zoomVal = 1.5;
          break;
        case "March 5":
          dataDate = '5/3/53';
          zoomVal = 1.1;
          break;
        case "March 6":
          dataDate = '6/3/53';
          zoomVal = 1.4;
          break;
        default:
      }
      dateMonth = date.split(" ")[0];
      dateDay = date.split(" ")[1];
      return dataDate;
    }

    console.log(dateHTMLToData(date));

    let dateText = dateHTMLToData(date);
    dateFocus(dateText);
    pictSVGZoomDate(zoomVal, 1500, dateText, mapLocs, 0.5)

    d3.select('p.date.month').html(dateMonth);
    d3.select('p.date.day').html(dateDay);
  })

d3.selectAll('p.dateP').on('mouseover', function(d, i){
  d3.select(this).classed('hovered', true);
})
d3.selectAll('p.dateP').on('mouseout', function(d, i){
  d3.select(this).classed('hovered', false);
})
