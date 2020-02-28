import {intersection, difference, reverse, concat} from 'lodash';
const itinerary = (tree, start, end) => {
    const iter = (n, search, p, acc) => {
        const [city, children] = n;
        if (city === search) {
            return [...p, city];
        }
        if (!children) {
            return acc;
        }
        return children.reduce((cAcc, nn) => iter(nn, search, [...p, city], cAcc), acc);
    };
    const arr1 = iter(tree, start, [], []);
    const arr2 = iter(tree, end, [], []);
    const interArr = intersection(arr1, arr2);
    const interStation = interArr[interArr.length - 1];
    const arr1DifRev = reverse(difference(arr1, arr2));
    const arr2Dif = difference(arr2, arr1);
    return concat(arr1DifRev, [interStation], arr2Dif);
};

const cities_data = [
    {name: "Тверь", latitude: 56.7830290, longitude: 35.72360530},
    {name: "Дубна", latitude: 56.744002, longitude: 37.173203},
    {name: "Калязин", latitude: 57.240412, longitude: 37.855078},
    {name: "Коприно", latitude: 58.065349, longitude: 38.324569},
    {name: "Ахтуба", latitude: 48.2746, longitude: 46.193},
    {name: "Великий Новгород", latitude: 58.536742, longitude: 31.271227},
    {name: "Валаам", latitude: 61.366667, longitude: 30.933333},
    {name: "Старая Ладога", latitude: 59.995076, longitude: 32.294347},
    //{name: "Москва", latitude: 55.850701, longitude: 37.465197},//55.851930, 37.464376
    {name: "Москва (СРВ)", latitude: 55.850701, longitude: 37.465197},//55.851930, 37.464376
    {name: "Москва (ЮРВ)", latitude: 55.850701, longitude: 37.465197},//55.851930, 37.464376
    {name: "Мышкин", latitude: 57.784019, longitude: 38.45456},
    {name: "Рыбинск", latitude: 58.043047, longitude: 38.85719},
    {name: "Ярославль", latitude: 57.633568, longitude: 39.879512},
    {name: "Кострома", latitude: 57.771284, longitude: 40.950603},
    {name: "Череповец", latitude: 59.129209, longitude: 37.907906},
    {name: "Горицы", latitude: 59.869734, longitude: 38.260342},
    {name: "Кижи", latitude: 62.066667, longitude: 35.238056},
    {name: "Соловецкие острова", latitude: 65.1, longitude: 35.683333},
    {name: "Петрозаводск", latitude: 61.788863, longitude: 34.359724},
    {name: "Мандроги", latitude: 60.897704, longitude: 33.817788},
    {name: "Н.Новгород", latitude: 56.29274, longitude: 43.926745},
    {name: "Нижний Новгород", latitude: 56.29274, longitude: 43.926745},
    {name: "Казань", latitude: 55.824874, longitude: 49.086087},
    {name: "Самара", latitude: 53.260908, longitude: 50.198077},
    {name: "Саратов", latitude: 51.534272, longitude: 46.01014},
    {name: "Волгоград", latitude: 48.711923, longitude: 44.491084},
    {name: "Астрахань", latitude: 46.333818, longitude: 48.021857},
    {name: "Ростов-на-Дону", latitude: 47.261008, longitude: 39.628},
    {name: "Пермь", latitude: 58.001985, longitude: 56.257287},
    {name: "Санкт-Петербург", latitude: 59.90802, longitude: 30.409998},
    {name: "Углич", latitude: 57.52234, longitude: 38.30391},
    {name: "Плёс", latitude: 57.453764, longitude: 41.507726},
    {name: "Лодейное поле", latitude: 60.734267, longitude: 33.555964},
    {name: "Вытегра", latitude: 61.010869, longitude: 36.434714},
    {name: "Чебоксары", latitude: 56.104219, longitude: 47.259418},
    {name: "Козьмодемьянск", latitude: 56.332705, longitude: 46.547541},
    {name: "Уфа", latitude: 54.809866, longitude: 56.093911},
    {name: "Повенец", latitude: 62.848879, longitude: 34.829407},
    {name: "Тольятти", latitude: 53.521911, longitude: 49.435092},
    {name: "Коломна", latitude: 55.095240, longitude: 38.765224},
    {name: "Константиново", latitude: 55.487887, longitude: 37.982154},
    {name: "Рязань", latitude: 54.629148, longitude: 39.734928},
    {name: "Болгары", latitude: 54.996159, longitude: 49.016942},
    {name: "Ялта", latitude: 44.495275, longitude: 34.177566},
    {name: "Севастополь", latitude: 44.616604,  longitude: 33.525369},
    {name: "Сочи", latitude: 43.585525,  longitude: 39.723062},
    {name: "Новороссийск", latitude: 44.723912,  longitude: 37.768974},//51.859990, 104.863182
    {name: "Листвянка", latitude: 51.859990,  longitude: 104.863182},//53.167844, 107.373614
    {name: "Хужир", latitude: 53.193450,  longitude: 107.343646},//53.323701, 107.741842
    {name: "Узуры", latitude: 53.323701,  longitude: 107.741842},//53.128608, 106.998926
    {name: "Огой", latitude: 53.128608,  longitude: 106.998926}
];

const mapTree = ['Москва (СРВ)', [
    ['Дубна', [
        ['Тверь'],
        ['Калязин', [
            ['Углич'],
            ['Мышкин'],
            ['Коприно', [
                ['Горицы', [
                    ['Вытегра', [
                        ['Кижи'],
                        ['Петрозаводск'],
                        ['Повенец', [
                            ['Сосновец'],
                            ['Соловецкие острова']
                        ]],
                        ['Мандроги', [
                            ['Лодейное поле', [
                                ['Старая Ладога', [
                                    ['Великий Новгород']
                                ]],
                                ['Валаам'],
                                ['Санкт-Петербург']
                            ]],
                        ]],
                    ]],
                ]],
                ['Рыбинск', [
                    ['Тутаев'],
                    ['Ярославль'],
                    ['Кострома'],
                    ['Плёс'],
                    ['Кинешма'],
                    ['Чкаловск'],
                    ['Городец'],
                    ['Н.Новгород', [
                        ['Макарьево',[
                            ['Козьмодемьянск'],
                            ['Чебоксары'],
                            ['Казань', [
                                ['Пермь'],
                                ['Самара', [
                                    ['Саратов'],
                                    ['Волгоград', [
                                        ['Астрахань'],
                                        ['Ростов-на-Дону']
                                    ]]
                                ]]
                            ]],
                        ]],
                        ['Муром', [
                            ['Касимов'],
                            ['Рязань'],
                            ['Константиново'],
                            ['Коломна'],
                            ['Москва (ЮРВ)']
                        ]]
                    ]],
                ]
                ]],
            ]],
        ]],
    ]]
];

export {cities_data, mapTree, itinerary};