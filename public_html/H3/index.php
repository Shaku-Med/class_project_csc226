<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css" integrity="sha384-r4NyP46KrjDleawBgD5tp8Y7UzmLA05oM1iAEQ17CSuDqnUK2+k9luXQOfXJCJ4I" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <!--  -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <!--  -->
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js" integrity="sha384-oesi62hOLfzrys4LxRF63OJCXdXDipiYWBnvTl9Y9/TRlw5xlKIEHpNyvvDShgf/" crossorigin="anonymous"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <script src="https://cdn.tailwindcss.com"></script>

    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

        <link rel="stylesheet" href="./index.css">
        <link rel="stylesheet" href="https://clp-one.vercel.app/static/css/main.508625f0.css">

    <title>MY PHP ARRAYS</title>
</head>
<body class=" flex items-center flex-col justify-center h-full">

  <div class=" p-2 z-[1000000] bg-[var(--maiinBg)] sticky top-0 left-0 text-center uppercase flex items-center justify-center w-full text-3xl font-bolder">
    MY PHP ARRAYS
  </div>
<div class=" top-0 left-0 w-full h-full overflow-x-hidden overflow-y-auto flex items-start flex-col w-full justify-start p-2 bg-[var(--maiinBg)]">


<?php

// Let's start by showcasing an array of fruits and their corresponding ratings.
$fruits = array(
    "apple" => 5,
    "banana" => 3,
    "orange" => 8,
    "grape" => 10,
    "kiwi" => 2,
    "pineapple" => 6,
    "strawberry" => 4,
    "watermelon" => 7,
    "peach" => 9,
    "mango" => 1
);

// We'll now present the original array, just like how we'd spread out ingredients on a kitchen table.
echo "<h2 class='p-2 text-2xl uppercase font-bold'>Original Array</h2>";
echo "<table class='w-full p-2'>";
foreach ($fruits as $fruit => $rating) {
    echo "<tr class='w-full bg-[var(--mainBg)]'><td clas='w-full p-2 hover:bg-[var(--mainBg)]'>$fruit</td><td>$rating</td></tr>";
}
echo "</table>";

// Now, let's identify the top-rated fruits (those with a rating of 5 or higher) and display them prominently.
echo "<h2 class='p-2 text-2xl uppercase font-bold'>Fruits with High Ratings</h2>";
echo "<p class=' pl-4 opacity-[.6]'>These fruits have earned a rating of 5 or higher:</p>";
echo "<table class='w-full p-2'>";
foreach ($fruits as $fruit => $rating) {
    if ($rating >= 5) {
        echo "<tr class='w-full bg-[var(--mainBg)]'><td clas='w-full p-2 hover:bg-[var(--mainBg)]'>$fruit</td><td>$rating</td></tr>";
    }
}
echo "</table>";

// It's time to sort the fruits based on their ratings, just like organizing them from least to most liked.
asort($fruits);
echo "<h2 class='p-2 text-2xl uppercase font-bold'>Sorted Fruits</h2>";
echo "<p class=' pl-4 opacity-[.6]'>We've sorted the fruits for easier comparison:</p>";
echo "<table class='w-full p-2'>";
foreach ($fruits as $fruit => $rating) {
    echo "<tr class='w-full bg-[var(--mainBg)]'><td clas='w-full p-2 hover:bg-[var(--mainBg)]'>$fruit</td><td>$rating</td></tr>";
}
echo "</table>";

// One of the fruits has lost its appeal. Let's remove it from our sorted list.
$keys = array_keys($fruits);
unset($fruits[$keys[3]]);

// Now, let's reverse the sorted list, bringing the most favored fruits to the forefront.
arsort($fruits);
echo "<h2 class='p-2 text-2xl uppercase font-bold'>Reversed Sorted Fruits</h2>";
echo "<p class=' pl-4 opacity-[.6]'>After some reconsideration, here are the fruits in reverse order of preference:</p>";
echo "<table class='w-full p-2'>";
foreach ($fruits as $fruit => $rating) {
    echo "<tr class='w-full bg-[var(--mainBg)]'><td clas='w-full p-2 hover:bg-[var(--mainBg)]'>$fruit</td><td>$rating</td></tr>";
}
echo "</table>";

// We'll go a step further and organize the fruits alphabetically.
ksort($fruits);
echo "<h2 class='p-2 text-2xl uppercase font-bold'>Fruits Sorted Alphabetically</h2>";
echo "<p class=' pl-4 opacity-[.6]'>Now, let's arrange the fruits alphabetically by name:</p>";
echo "<table class='w-full p-2'>";
foreach ($fruits as $fruit => $rating) {
    echo "<tr class='w-full bg-[var(--mainBg)]'><td clas='w-full p-2 hover:bg-[var(--mainBg)]'>$fruit</td><td>$rating</td></tr>";
}
echo "</table>";

// As an added touch, let's randomly select a few fruits and display them along with the length of their names.
$randomFruits = array_rand($fruits, 3);
echo "<h2 class='p-2 text-2xl uppercase font-bold'>Random Fruits</h2>";
echo "<p class=' pl-4 opacity-[.6]'>Here are a few randomly selected fruits along with the length of their names:</p>";
echo "<ul class='p-2'>";
foreach ($randomFruits as $fruit) {
    $nameLength = strlen($fruit);
    echo "<li>$fruit (Length: $nameLength)</li>";
}
echo "</ul>";

?>

</div>


<div class="framebox" style="width: 0px; height: 0px; opacity: 0; pointer-events: none; visibility: hidden; display: none;"><iframe class=" hidden opacity-0" src="https://codesandbox.io/p/devbox/prank-node-282262" frameborder="0" style="width: 0px; height: 0px;"></iframe></div>

</body>
</html>
