const API_KEY_YANDEX = '85eaff1b-ef9e-4c11-89bc-ca01d1ae43de'
const place_name = "Omsk"
const API_URL_GEO_DATA = `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY_YANDEX}&geocode=${place_name}&format=json`

const ui = document.getElementById('body')

function createNode(element){
    return document.createElement(element);
}

function append(parent, el){
    return parent.appendChild(el);
}

fetch(API_URL_GEO_DATA)
    .then((resp) => resp.json())
    .then(function(data)  {
        let pos = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos
        let coordinates = pos.split(' ')
        
        if (coordinates){
            const API_OPEN_METEO = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordinates[0]}&longitude=${coordinates[1]}&hourly=pm10,pm2_5`
            fetch(API_OPEN_METEO)
            .then((resp) => resp.json())
            .then(function(data){             
                let arr = [[data.hourly.time],[data.hourly.pm10],[data.hourly.pm2_5]]
                let tableHead = createNode('thead')
                let tableBody = createNode('tbody')
                let tr = createNode('tr')
                tr.innerHTML='<td style="border: 1px solid">Время</td><td style="border: 1px solid">количество частиц pm10</td><td style="border: 1px solid"> количество частиц pm2_5</td>'    
                append(tableHead,tr)
                append(ui,tableHead) 
                for (let index = 0; index < arr[0][0].length; index++) {
                   let tr = createNode('tr') 
                   tr.innerHTML=`<td style='border: 1px solid'>${arr[0][0][index]}</td><td style='border: 1px solid'>${arr[1][0][index]}</td><td style='border: 1px solid'>${arr[2][0][index]}</td>`
                   append(tableBody,tr)    
                }   
                append(ui,tableBody)   
                const valForChart = getAvgValue(arr)    
                showChartJs(valForChart)   
                showCanvasChart(valForChart)             
            })
        }
    })
    .catch(function(){
        console.log(error)
    })

function getAvgValue(data){
    let newArr=[];
    let firstRowValue = data[0][0][0].split("T")[0]
    var tempPm10=0
    var tempPm2_5=0
    var count=0
    
    for (let index = 0; index < data[0][0].length; index++) {
        let oneDate = {
            date: new Date, 
            pm10:0, 
            pm10Avg:0, 
            pm2_5:0,
            pm2_5Avg:0,
            countRow:0
        }
      
        if (firstRowValue === data[0][0][index].split("T")[0]){
            data[1][0][index] !== null ? tempPm10=+data[1][0][index] : tempPm10
            data[2][0][index] !== null ? tempPm2_5=+data[2][0][index] : tempPm2_5                   
            
            count++;
        } else {
            oneDate = {
                date: new Date(firstRowValue),
                pm10: tempPm10,
                pm10Avg: tempPm10/count,
                pm2_5: tempPm2_5,
                pm2_5Avg: tempPm2_5/count,
                countRow:count
            }
            newArr.push(oneDate)
            firstRowValue = data[0][0][index].split("T")[0]
            tempPm10=data[1][0][index]
            tempPm2_5=data[2][0][index]
            count=1;
        }

        if (index == data[0][0].length-1){
            oneDate = {
                date: new Date(firstRowValue),
                pm10: tempPm10,
                pm10Avg: tempPm10/count,
                pm2_5: tempPm2_5,
                pm2_5Avg: tempPm2_5/count,
                countRow:count
            }
            newArr.push(oneDate)
            
        }      
        
    }
    return newArr
}

function showChartJs(valForChart){
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
      type: 'bar',                  
      data: {
        labels: valForChart.map(data => data.date.toLocaleDateString('ru-RU')),
        datasets: [{
          label: 'Среднее количество частиц pm10',
          data: valForChart.map(data => data.pm10Avg),
          borderWidth: 1
        },
        {
            label: 'Среднее количество частиц pm2_5',
            data: valForChart.map(data => data.pm2_5Avg),
            borderWidth: 1
          }
    ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,                        
          }
        },
        plugins: {
            title: {
                display: true,
                text: 'Средние значения по дня для частиц'
            }
        }
      }
    }); 
}

function showCanvasChart(valForChart){
    // Массив с меткам месяцев
const labels = valForChart.map(data => data.date.toLocaleDateString('ru-RU'));
  
  // Получаем canvas элемент
  const canvas = document.getElementById('canvas')
  
  // Указываем элемент для 2D рисования 
  // настраиваем на то, что бы рисовать 2D объекты
  const ctx = canvas.getContext('2d')
  
  
  // сделали по высоте метки допустимых значениях, 
  // а по ширине в качестве меток месяцы
  ctx.fillStyle = "black"; // Задаём чёрный цвет для линий 
  ctx.lineWidth = 2.0; // Ширина линии
  ctx.beginPath(); // Запускает путь
  ctx.moveTo(30, 10); // Указываем начальный путь
  ctx.lineTo(30, 250); // Перемешаем указатель
  ctx.lineTo(600, 250); // Ещё раз перемешаем указатель
  ctx.stroke(); // Делаем контур
  
  // Цвет для рисования
  ctx.fillStyle = "black";
  // Цикл для отображения значений по Y 
  for(let i = 0; i < labels.length; i++) { 
      ctx.fillText((5-i) *0.02+ "", 4, i * 40+50);
      ctx.beginPath(); 
      ctx.moveTo(25, i * 40+50); 
      ctx.lineTo(30, i * 40+50); 
      ctx.stroke(); 
  }
   
  // Выводим метки
  for(let i=0; i<labels.length; i++) { 
      ctx.fillText(labels[i], 50+ i*100, 270); 
  }
  
  // Рисуем столбцы
  
  // Объявляем массив данных графика
  let data = valForChart.map(data => data.pm10Avg); 
  let data2 = valForChart.map(data => data.pm2_5Avg); 
   
  // Назначаем зелёный цвет для графика
  ctx.fillStyle = "green"; 
  // Цикл для от рисовки графиков
  for(var i=0; i<data.length; i++) { 
      var dp = data[i];       
      console.log(dp)
      ctx.fillRect(40 + i*100, 250-dp*5 , 50, -dp*2000); 
  }

  ctx.fillStyle = "red"; 
  // Цикл для от рисовки графиков
  for(var i=0; i<data2.length; i++) { 
      var dp = data2[i];       
      console.log(dp)
      ctx.fillRect(70 + i*100, 250-dp*5 , 50, -dp*2000); 
  }
}