// list of autocompletable cities
var cities = ['Bedford','Bedford Heights','Berea', 'Bratenahl','Brookpark','Cleveland','Cleveland Heights','East Cleveland','Euclid','Lakewood','North Olmstead','Parma','Rocky River','Shaker Heights','University Heights','Warrensville Heights'];

$(".typeahead").typeahead({
      source: cities,
      minLength: 2
  });