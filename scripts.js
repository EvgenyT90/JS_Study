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
            })
        }
    })
    .catch(function(){
        console.log(error)
    })


