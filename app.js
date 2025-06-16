console.log("Script loaded once");

var items = [];

let currentColor = null;
let currentTool = null; // "fill", "erase", or null

const monthNames = ["Ocak", "Subat", "Mart", "Nisan", "Mayis", "Haziran",
  "Temmuz", "Agustos", "Eylul", "Ekim", "Kasim", "Aralik"];

const chartStartDate = new Date(2025, 3, 1); // April is month 3 (0-indexed)

  function getColorByStatus(status) {
    switch (status) {
      case 1: return '#FF6B6B'; // kırmızı
      case 2: return '#4ECDC4'; // mavi
      case 3: return '#FFD93D'; // sarı
      case 4: return '#D3D3D3'; // gri
      default: return '';
    }
  }

  function getStatusByColor(color) {
    switch (color) {
      case 'rgb(255, 107, 107)': return 1;
      case 'rgb(78, 205, 196)': return 2;
      case 'rgb(255, 217, 61)': return 3;
      case 'rgb(211, 211, 211)': return 4;
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



  function getCurrentWeekIndex(startDate) {
    const now = new Date();
    const diffInMs = now - startDate;
    const diffInWeeks = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));
    return diffInWeeks;
  }

  function positionTodayLine() {
    const currentWeekIndex = getCurrentWeekIndex(chartStartDate);
    const $targetCell = $('.gantt-cell').eq(currentWeekIndex);

    if ($targetCell.length > 0) {
      const offsetLeft = $targetCell.position().left;
      $('#todayLine').css('left', offsetLeft + 'px');
    }
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
        if (status !== null) {
          dates.push({ week: index, status });
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
        saveTasks();
      }
    });

    $row.append($taskCell);

    for (let i = 0; i < 24; i++) {
      const $cell = $('<td>')
        .addClass('gantt-cell')
        .attr('id', `week-${i}`);

      const match = safeTask.dates.find((d) => d.week === i);
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




$(document).ready(function () {


  const savedTasks = JSON.parse(localStorage.getItem('ganttTasks')) || [];
  console.log('Yüklenen görevler:', savedTasks);
  savedTasks.forEach(task => addTaskRow(task));
  

 
  $(document).on('click', '.delete-btn', function () {
    $(this).closest('tr').remove();
    setTimeout(function(){
      saveTasks();  
    },100)
    
    console.log('Silindi ve kayıt edildi:', JSON.parse(localStorage.getItem('ganttTasks')));
  });


  $('#addTaskBtn').on('click', function () {
    console.log('Add Task button clicked');
    addTaskRow();
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
    if (currentColor) {
      $(this).css('background-color', currentColor);
    } else if (currentTool === 'fill') {
      $(this).css('background-color', 'grey');
    } else if (currentTool === 'erase') {
      $(this).css('background-color', '');
    }

    var project_id = $(this).parent().attr("data");
    var week_id = $(this).attr("id").substring(5);

    //console.log(week_id);
    //console.log(project_id);


  });

  positionTodayLine();
});
