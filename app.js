console.log("Script loaded once");

var items = [];

let currentColor = null;
let currentTool = null; // "fill", "erase", or null

const monthNames = ["Ocak", "Subat", "Mart", "Nisan", "Mayis", "Haziran",
  "Temmuz", "Agustos", "Eylul", "Ekim", "Kasim", "Aralik"];



  function getColorByStatus(status) {
    switch (status) {
      case 1: return '#FF6B6B'; // kırmızı
      case 2: return '#4ECDC4'; // mavi
      case 3: return '#FFD93D'; // sarı
      case 4: return '#B19CD9'; // gri
      default: return '';
    }
  }

  function getStatusByColor(color) {
    switch (color) {
      case 'rgb(255, 107, 107)': return 1;
      case 'rgb(78, 205, 196)': return 2;
      case 'rgb(255, 217, 61)': return 3;
      case 'rgb(177, 156, 217)': return 4;
      default: return null;
    }
  }


function getDisplayedMonths() {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-based

  // Calculate 2 months before and 4 months after current month
  let months = [];
  for (let i = -2; i <= 4; i++) {
    // Use modulo to loop months around year end
    let monthIndex = (currentMonth + i + 12) % 12;
    months.push(monthNames[monthIndex]);
  }
  return months;
}


const today = new Date();
const currentWeek = getWeekNumber(today);


const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
const startWeek = getWeekNumber(twoMonthsAgo);

function getWeekNumber(date){
const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
const pastDays = Math.floor((date-firstDayOfYear) / (24 * 60 * 60 * 1000));
return Math.ceil((pastDays + firstDayOfYear.getDay() + 1)/7)

}


 



  const months = getDisplayedMonths();

  // Assuming you have a container for months in your HTML with id="monthHeaders"
  const monthHeaders = $('#monthHeaders');
  monthHeaders.empty(); // Clear existing months

  months.forEach(month => {
    // Append each month as a div (adjust tag and class as needed)
    monthHeaders.append(`<div class="gantt-month">${month}</div>`);
  });


  function saveTasks() {
    var tasks = [];
    $('.gantt-table tbody .tr').each(function () {
      const title = $(this).find('.gantt-task').text();
      const id = $(this).attr('id')?.replace('proje-', '') || Date.now();
      const dates = [];

      $(this).find('.gantt-cell').each(function (index) {
        const color = $(this).css('background-color');
        const status = getStatusByColor(color);
        const week = startWeek + index;

        if (status !== null) {
          dates.push({ week, status });
        }
      });

      if(title!=""){
        tasks.push({
          id: parseInt(id),
          title,
          dates,
        });
      }
    });
    console.log(tasks);
    items = tasks;
    save();
  }


  function save(){
      localStorage.setItem('ganttTasks', JSON.stringify(items));
  }


  function addTaskRow(task = {}) {
    const $tbody = $('.gantt-table tbody').first();
    const safeTask = {
      id: task?.id || Date.now(),
      title: task?.title || 'Click to name task',
      dates: Array.isArray(task?.dates) ? task.dates : []
    };

    var counter = $('.tr').length;

    const $row = $('<tr class="tr">').attr('id', `proje-${safeTask.id}`).attr('data', counter);
    const $taskCell = $('<td>')
      .addClass('gantt-task')
      .attr('contenteditable', 'true')
      .text(safeTask.title);

    $taskCell.on('focus', function () {
      if ($(this).text() === 'Click to name task') {
        $(this).text('');
      }
    });

    $taskCell.unbind('keydown');
    $taskCell.bind('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        $(this).attr('contenteditable', 'false').blur();

        //hangi proje -> title ne...
        //saveDB(proje_id, title);
        saveTasks();
      }
    });

    $row.append($taskCell);

    for (let i = 0; i < 24; i++) {
      
      const realWeek = startWeek + i;
      
      const $cell = $('<td>')
        .addClass('gantt-cell')
        .attr('id', 'week-' + realWeek)
        .attr('data-week', realWeek);
        

      const match = safeTask.dates.find((d) => d.week === realWeek);
      if (match) {
        $cell.css('background-color', getColorByStatus(match.status));
      }

      $row.append($cell);
    }

    const $deleteBtn = $('<button>')
  .addClass('delete-btn')
  .html('🗑️');

    $row.append($('<td>').append($deleteBtn));
    $tbody.append($row);

    saveTasks();


  }


function highlightCurrentWeek() {
  const currentWeek = getWeekNumber(new Date()); // şimdiki hafta numarası

  // Önce önceki vurguyu kaldır
  $('.gantt-cell.current-week').removeClass('current-week');

  // Güncel haftanın hücresini seç
  const $currentCell = $(`.gantt-cell[data-week="${currentWeek}"]`).css('border', '3px solid black');

  if ($currentCell.length) {
    $currentCell.addClass('current-week');
  }
}




$(document).ready(function () {


  const savedTasks = JSON.parse(localStorage.getItem('ganttTasks')) || [];
  console.log('Yüklenen görevler:', savedTasks);
  savedTasks.forEach(task => addTaskRow(task));
  

 
  $(document).on('click', '.delete-btn', function () {
  const confirmed = confirm("Bu görevi silmek istediğinize emin misiniz?");
  if (!confirmed) return;

    $(this).closest('tr').remove();
    setTimeout(function(){
      saveTasks();  
    },100)
    
    console.log('Silindi ve kayıt edildi:', JSON.parse(localStorage.getItem('ganttTasks')));
  });


  $('#addTaskBtn').on('click', function () {
    console.log('Add Task button clicked');
    addTaskRow();
    highlightCurrentWeek(); 
    //saveTasks();
  });


  // Color button click
  $('#colorPicker').on('click', '.color-btn', function () {
    currentColor = $(this).data('color');
    currentTool = null; // reset tool if color is selected

    $('.color-btn, .tool-btn').css('outline', 'none');
    $(this).css('outline', '3px solid black');
  });

  // Tool button click (+ and -)
  $('#colorPicker').on('click', '.tool-btn', function () {
    currentTool = $(this).data('tool'); // "fill" or "erase"
    currentColor = null; // reset color if tool is selected

    $('.color-btn, .tool-btn').css('outline', 'none');
    $(this).css('outline', '3px solid black');
  });

  // When clicking a gantt cell
  $(document).on('click', '.gantt-cell', function () {

const idStr = $(this).attr('id');  // id'yi al

  if (idStr) {
    const week_id = idStr.substring(5); // 'week-' kısmını at, sadece sayı kalsın
    console.log('Week id:', week_id);
  } else {
    console.log('Bu hücrenin idsi yok');
  }




    if (currentColor) {
      $(this).css('background-color', currentColor);
    } else if (currentTool === 'fill') {
      $(this).css('background-color', '#B19CD9');
    } else if (currentTool === 'erase') {
      $(this).css('background-color', '');
    }



    var project_id = $(this).parent().attr("data");
    var week_id = $(this).attr("data-week");

    saveTasks();


    //console.log(week_id);
    //console.log(project_id);


  });


  highlightCurrentWeek();

});


function saveDB(proje_id, title){
  //$.ajax({
  //  type: "POST",
  //  url: "https://....",
  //  data: {proje_id: proje_id, title:title},
  //  datatype: "json",
  //  success: function(data){
  //    if(data == 'done'){
  //
  //    }
  //  }, failure: function(err){
  //    alert('error: ' + error);
  //  }
  //});
}

