document.addEventListener('DOMContentLoaded', function() {

  class Map {
    constructor(_list) {
      this.list = _list;
      this.addListerners = this.addListerners.bind(this);
      this.findMostCity = this.findMostCity.bind(this);
      this.findClosestCity = this.findClosestCity.bind(this);
      this.showStateAbbr = this.showStateAbbr.bind(this);
    }
    
    //Метод отрисовывает список городов, в задании про это не указано, но так удобнее
    showCities() {
      document.body.innerHTML += 'Cities: <br>';
      for (let i=0; i<this.list.length; i++) {
        document.body.innerHTML += `${JSON.stringify(this.list[i])} <br>`;
      }
      
    }

    //Собственно, метод поиска и вывода "самых" городов.
    //Был на уме неплохой вариант отсортировать массив по координатам и выводить первый или последний элемент, так меньше кода,
    //но при большом количестве городов это скажется на производительности.
    findMostCity(_id) {
      let n = 0;
      switch(_id) {
        case 'theNorthernmost':
        for (let i=1; i<this.list.length; i++) {
           if (Object.values(this.list[i])[0][0] > Object.values(this.list[n])[0][0]) {n=i};
        }
        break;

        case 'theSouthernmost':
        for (let i=1; i<this.list.length; i++) {
           if (Object.values(this.list[i])[0][0] < Object.values(this.list[n])[0][0]) {n=i};
        }
        break;

        case 'theEasternmost':
        for (let i=1; i<this.list.length; i++) {
           if (Object.values(this.list[i])[0][1] > Object.values(this.list[n])[0][1]) {n=i};
        }
        break;

        case 'theWesternmost':
        for (let i=1; i<this.list.length; i++) {
           if (Object.values(this.list[i])[0][1] < Object.values(this.list[n])[0][1]) {n=i};
        }
        break;

      }
      alert(`The ${_id.substr(3).toLowerCase()} city is ${Object.keys( this.list[n])[0].match(/^[^,]+/i)}`); //Регулярка выбирает всё до запятой, т.е. отсекает штат
    }

    findClosestCity(_lat, _long) {
      let closestCity = 0;
      let minDistance = +Infinity;
      const earthRadius = 6372795;

      this.list.forEach( (_el, _i) => {
      //Перевод координат в радианы
      let lat1 = _lat * Math.PI / 180;
      let lat2 = Object.values(_el)[0][0] * Math.PI / 180;
      let long1 = _long * Math.PI / 180;
      let long2 = Object.values(_el)[0][1] * Math.PI / 180;
      //Косинусы и синусы широт и разницы долгот
      let cl1 = Math.cos(lat1);
      let cl2 = Math.cos(lat2);
      let sl1 = Math.sin(lat1);
      let sl2 = Math.sin(lat2);
      let delta = long2 - long1;
      let cdelta = Math.cos(delta);
      let sdelta = Math.sin(delta);
      //Вычисления длины большого круга
      let y = Math.sqrt( Math.pow(cl2*sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
      let x = sl1 * sl2 + cl1 * cl2 * cdelta;
      let ad = Math.atan2(y, x);
      let distance = ad * earthRadius;
        if (distance < minDistance) {
          minDistance = distance;
          closestCity = _i;
        }
      });
      alert(`Nearest city to ${_lat}, ${_long} is ${Object.keys( this.list[closestCity])[0].match(/^[^,]+/i)}`); //Регулярка выбирает всё до запятой, т.е. отсекает штат
    }

    showStateAbbr() {
      let abbrArr = this.list.map( _el => {
        let k = Object.keys(_el)[0];
        return k.match(/[^,]+$/i)[0].trim();
      }); 
      let statesSet = new Set(abbrArr);
      let statesStr = [...statesSet].join(' ');
      alert(`States list string is: \n${statesStr}`);
    }

    addListerners() {
      document.getElementById('mostButtons').addEventListener('click', _event => {
        this.findMostCity(_event.target.id);
      })

      document.getElementById('closest').addEventListener('click', _event => {
        let lat = +document.getElementById('lat').value;
        let long = +document.getElementById('long').value;
        //Проверка на корректный ввод
        if (isNaN(long) || isNaN(lat) || Math.abs(long)>180 || Math.abs(lat)>180) {
          alert('Enter correct coords, please');
          return;
        }
        this.findClosestCity(lat, long);
      })

      document.getElementById('showStates').addEventListener('click', () => {
        this.showStateAbbr();
      })

    }
  }
  
  //Создаем объект 
  let map = new Map(
    [
      {'Nashville, TN': [36.17, -86.78]},
      {'New York, NY': [40.71, -74.00]},
      {'Atlanta, GA': [33.75, -84.39]},
      {'Denver, CO': [39.74, -104.98]},
      {'Seattle, WA': [47.61, -122.33]},
      {'Los Angeles, CA': [34.05, -118.24]},
      {'Memphis, TN': [35.15, -90.05]},
    ]
  );
  //Вывод на экран исходных данных
  map.showCities();
  //Добавляем обработчики на кнопки
  map.addListerners();
});
