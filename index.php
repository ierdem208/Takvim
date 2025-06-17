<?php

echo "merhaba";
$label = "➕ Add Task";

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Takvim"; // buraya kendi veritabanı adını yaz

// Bağlantı oluştur
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantı kontrolü
if ($conn->connect_error) {
    die("Bağlantı başarısız: " . $conn->connect_error);
}
echo "Bağlantı başarılı!";

$sql = "SELECT * FROM project";
$result = $conn->query($sql);

// Sonuçları diziye aktar
$titles = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $titles[] = $row['title'];
    }
} else {
    echo "Kayıt bulunamadı.";
}

// foreach ile yazdır
foreach ($titles as $title) {
    echo $title . "<br>";
}

$conn->close();

?>




<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Takvim</title>
  <link rel="stylesheet" href="https://bootswatch.com/5/brite/bootstrap.css">
  <link rel="stylesheet" href="style.css">

  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

</head>
<body>
<div class="gantt-container">

    <!---BUTTONS AT THE TOP-->


<div id="colorPicker" style="margin-bottom: 10px;">
  <button class="color-btn" data-color="#FF6B6B" style="background: #FF6B6B; width: 30px; height: 30px; border: none; cursor: pointer;"></button>
  <button class="color-btn" data-color="#4ECDC4" style="background: #4ECDC4; width: 30px; height: 30px; border: none; cursor: pointer;"></button>
  <button class="color-btn" data-color="#FFD93D" style="background: #FFD93D; width: 30px; height: 30px; border: none; cursor: pointer;"></button>
  <button class="tool-btn" data-tool="fill">➕</button>
  <button class="tool-btn" data-tool="erase">➖</button>
</div>

    <button id="addTaskBtn" class="btn"> <?php echo $label;?></button>
  <table class="gantt-table">
    <!-- First Row: Months -->
    <tr>
      <th rowspan="2" class="task-header">Tasks</th>
      <th colspan="4">Nisan</th>
      <th colspan="4">Mayis</th>
      <th colspan="4">Haziran</th>
      <th colspan="4">Temmuz</th>
      <th colspan="4">Agustos</th>
      <th colspan="4">Eylul</th>
    </tr>

    <!-- Second Row: Weeks -->
    <tr>
      <!-- 6 months x 4 weeks = 24 weeks -->
      <th>H1</th><th>H2</th><th>H3</th><th>H4</th>
      <th>H5</th><th>H6</th><th>H7</th><th>H8</th>
      <th>H9</th><th>H10</th><th>H11</th><th>H12</th>
      <th>H13</th><th>H14</th><th>H15</th><th>H16</th>
      <th>H17</th><th>H18</th><th>H19</th><th>H20</th>
      <th>H21</th><th>H22</th><th>H23</th><th>H24</th>
    </tr>

    <!-- Task Rows -->
    

    <tbody>
      
    </tbody>

  </table>

  
</div>






<script src="app.js"></script>
</body>
</html>