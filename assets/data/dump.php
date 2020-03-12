<?php

$executionStartTime = microtime(true);

$shipIds = [207, 206, 198, 150, 92, 139, 5, 200, 91, 14, 36, 72, 19, 247];
$tours_base = 'https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=id,ship-id&&filter[start][gte]=2020-04-15T00:00:00Z&per-page=10000&';
$tours_url = $tours_base;

foreach($shipIds as $id){
   $tours_url .= 'filter[ship-id][in][]='.$id.'&';
}

/*$tours_url = "https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=id,ship-id&filter[ship-id][in][]=207&filter[ship-id][in][]=200&filter[ship-id][in][]=14&filter[ship-id][in][]=139&filter[ship-id][in][]=36&filter[ship-id][in][]=72&filter[ship-id][in][]=206&filter[ship-id][in][]=19&filter[ship-id][in][]=198&filter[ship-id][in][]=92&filter[ship-id][in][]=247&filter[ship-id][in][]=150&filter[ship-id][in][]=5&filter[start][gte]=2020-04-15T00:00:00Z&per-page=10000";*/

$tours_list = json_decode(file_get_contents($tours_url), true);

$ships = [];
$staff = [];

foreach($tours_list['data'] as $key=>$tour){
    if(!in_array( $tour['attributes']['ship-id'], $ships)){
        $ships[] = $tour['attributes']['ship-id'];
    }
    if(!is_dir('ships/'.$tour['attributes']['ship-id'])){
        mkdir('ships/'.$tour['attributes']['ship-id']);
    }
    //$tour_url = 'https://api.mosturflot.ru/v3/rivercruises/tours/'.$tour['attributes']['id'].'/tour-points?include=excursions';
    $tour_url = 'https://api.mosturflot.ru/v3/rivercruises/tour-points?filter[tour-id]='.$tour['attributes']['id'].'&include=tour,tour.ship,excursions,title-image,tour-rates&fields[tours]=ship-id,days,start,finish,route,&fields[ships]=id,name&per-page=10000';
    $tour_json = file_get_contents($tour_url);
    file_put_contents('ships/'.$tour['attributes']['ship-id'].'/'.$tour['attributes']['id'].'.json', $tour_json);
    $tour_data = json_decode($tour_json, true);
    foreach($tour_data['included'] as $data){
        if($data['type'] == "point-images"){
            $im = file_get_contents($data['links']['image-url']);
            if($im && $data['id']){
                file_put_contents('cities/'.$data['id'].'.jpg', $im);
            }
        }
    }
}


foreach($ships as $ship){
    if(!is_dir('ships/'.$ship.'/staff')){
        mkdir('ships/'.$ship.'/staff');
    }
    if(!is_dir('ships/'.$ship.'/images')){
        mkdir('ships/'.$ship.'/images');
    }
    $deckplan = file_get_contents('https://api.mosturflot.ru/v3/rivercruises/ships/'.$ship.'/deckplan.svg');
    file_put_contents('ships/'.$ship.'/deckplan.svg', $deckplan);
    $ship_data = file_get_contents('https://api.mosturflot.ru/v3/rivercruises/ships/'.$ship.'?include=title-image,ship-class,services,cabin-categories,staff,deckplan,on-board-name');
    file_put_contents('ships/'.$ship.'/ship.json', $ship_data);

    $ship_img_url = 'https://api.mosturflot.ru/v3/rivercruises/ships/'.$ship.'/images';
    $ship_imgs = file_get_contents($ship_img_url);
    file_put_contents('ships/'.$ship.'/images.json', $ship_imgs);

    $shipToursURL = $tours_base.'filter[ship-id][in][]='.$ship;
    $shipTours = file_get_contents($shipToursURL);
    file_put_contents('ships/'.$ship.'/tours.json', $shipTours);

    $ship_json = json_decode($ship_data, true);
    $staff_list = [];
    foreach($ship_json['included'] as $item){
        if($item['type'] == "ship-images"){
            $img_src = $item['links']['image-url'];
            $basename =  basename($img_src);
            $img = file_get_contents($img_src);
            if($img){
                file_put_contents('ships/'.$ship.'/images/'.$basename, $img);
            }
        }
        if($item['type'] == "staff"){
            $id = $item['id'];
            $img_src = $item['relationships']['images']['links']['related'];
            $staff_img = json_decode(file_get_contents($img_src), true);
            if($staff_img['data']){
                $img_url = $staff_img['data'][0]['links']['image-url'];
            }
            if($img_url){
                $img = file_get_contents($img_url);
            }
            if($img){
                $ext = substr(basename($img_url), -3);
                file_put_contents('ships/'.$ship.'/staff/'.$id.'.'.$ext, $img);
                $staff[$id]['name'] = $item['attributes']['name'];
                $staff[$id]['position'] = $item['attributes']['position'];
                $staff[$id]['order'] = $item['attributes']['sort-order'];
                $staff[$id]['image'] = $id.'.'.$ext;

                $staff_list[$item['attributes']['sort-order']]['id'] = $id;
                $staff_list[$item['attributes']['sort-order']]['name'] = $item['attributes']['name'];
                $staff_list[$item['attributes']['sort-order']]['position'] = $item['attributes']['position'];
                $staff_list[$item['attributes']['sort-order']]['order'] = $item['attributes']['sort-order'];
                $staff_list[$item['attributes']['sort-order']]['image'] = $id.'.'.$ext;
                file_put_contents('ships/'.$ship.'/staff.json', json_encode($staff_list));
            }

        }
    }
}

file_put_contents('ships/staff.json', json_encode($staff));

$executionEndTime = microtime(true);

$seconds = $executionEndTime - $executionStartTime;
$sec = round($seconds);

echo "This script took $sec sec. to execute".PHP_EOL;


?>