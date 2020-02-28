<?php

$executionStartTime = microtime(true);

$tours_url = "https://api.mosturflot.ru/v3/rivercruises/tours?fields[tours]=id,ship-id&filter[ship-id][in][]=207&filter[ship-id][in][]=200&filter[ship-id][in][]=14&filter[ship-id][in][]=139&filter[ship-id][in][]=36&filter[ship-id][in][]=72&filter[ship-id][in][]=206&filter[ship-id][in][]=19&filter[ship-id][in][]=198&filter[ship-id][in][]=92&filter[ship-id][in][]=247&filter[ship-id][in][]=150&filter[ship-id][in][]=5&filter[start][gte]=2019-04-15T00:00:00Z&per-page=10000";

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
    $tour_url = 'https://api.mosturflot.ru/v3/rivercruises/tours/'.$tour['attributes']['id'].'/tour-points?include=excursions';
    $tour_json = file_get_contents($tour_url);
    file_put_contents('ships/'.$tour['attributes']['ship-id'].'/'.$tour['attributes']['id'].'.json', $tour_json);
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
    $ship_data = file_get_contents('https://api.mosturflot.ru/v3/rivercruises/ships/'.$ship.'?include=ship-class,images,services,staff');
    file_put_contents('ships/'.$ship.'/ship.json', $ship_data);
    $ship_json = json_decode($ship_data, true);
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
