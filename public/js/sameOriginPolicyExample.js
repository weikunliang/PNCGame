$(function() { // do once original document loaded and ready
  $('#local').click(doLoadLocal);
  $('#elsewhere').click(doLoadElsewhere);
});

function doLoadLocal() {
  $("#responseArea").html("");
  $.getJSON("data.json", function(data, status) {
    if (status === "success") processResponse(data);
  })
}

function doLoadElsewhere() {
  $("#responseArea").html("");
  $.getJSON("http://www.andrew.cmu.edu/course/67-328/examples/data.json", function(data, status) {
    if (status === "success") processResponse(data);
    });
}

function processResponse(responseObject) {
  var displayText = "There are " + responseObject.employees.length + " employees:<ol>";
  for (var i = 0; i < responseObject.employees.length; i++) {
    var employee = responseObject.employees[i];
    displayText += "<li>" + employee.firstName + " " + employee.lastName + "<\/li>";
  }
  displayText += "<\/ol>";
  $("#responseArea").html(displayText);
}
