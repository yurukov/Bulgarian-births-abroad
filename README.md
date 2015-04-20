# Bulgarian births abroad
Скриптове и данни за създаване на карта на рабжданията в чужбина.

Описание на картата и изготвянето ѝ ще намерите в блога ми:
http://yurukov.net/blog/2015/04/20/balgarcheta-rodeni-v-chujbina/

Самата карта ще намерите в CartoDB:
https://yurukov.cartodb.com/viz/d128c2dc-e62b-11e4-9ed5-0e853d047bba/public_map

### Входни данни
* borders.json - geojson с границите на почти всички държави
* glasuvam_coords.csv - координатите на регистрациите в Glasuvam.org
* births_abroad.csv - данни за ражданията на българчета в чужбина по държави и години

### Алгоритми
* inside.js - изчислява в коя държава са коодинатите от регистрациите в Glasuvam.org. Записах ги в dotmap.csv
* dots.js - изчислява случайни точки на база границите и кооринатите на българи в съответните държави. Записах ги в dots.json
* final.js - изчислява датите на ражданията и ги комбинира с координати от предишния скрипт. Записах ги в birth_abroad_geo.csv

Скриптовете използват PiP модул за nodejs: https://github.com/substack/point-in-polygon
