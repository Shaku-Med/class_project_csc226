<?php

function bookOut($books, $isAll, $id){ 
    if($isAll){
        foreach($books as $index => $book){
            echo "
                <tr class=''>
                    <td>".($index + 1)."</td>
                    <td>".$book['title']."</td>
                    <td>".$book['author']."</td>
                    <td>".$book['year']."</td>
                    <td onclick='window.open(window.location.origin + `/~amara/H4/bk.php?id=` + `".$book['id']."`)' class='link link-underline link-[skyblue] hover:bg-[var(--basebg)] cursor-pointer bi bi-box-arrow-up-right flex items-center justify-center h-full w-full'></td>
                </tr>
            ";
        }
    }
    else {
       foreach($books as $obj){
        if($obj['id'] === $id){
            echo "<title>".$obj['title']." ~ ".$obj['author']."</title>";
            
            echo "
                <div class='bojInaodidata fixed top-0 left-0 w-full h-full flex items-center justify-center p-2'>
                    <div class='dataCenterst bg-[var(--basebg)] brd rounded-lg shadow-md p-2 max-w-[400px]'>
                        <div class='titleH uppercase text-center line-clamp-2 text-2xl p-1'>
                            ".$obj['title']."
                        </div>
                        <div class='authorName text-sm text-center p-1 opacity-[.8]'>
                            ".$obj['author']."
                        </div>
                        <div class='yearHere text-xs text-center p-1 opacity-[.7]'>
                            ".$obj['year']."
                        </div>
                    </div>
                </div>
            ";
        }
       }
    }
}

?>