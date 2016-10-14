$(function() {
  var socket = io();
  socket.on('create', function(msg) {
    var e = $(msg.element);
    e.attr('id', msg.id);
    e.draggable( {
	  drag: function(event, ui) {
	  socket.emit('drag', {id: event.target.id, left: ui.position.left, top: ui.position.top})}
	  // replaced stop trigger with drag trigger, updates new coordinates with ever move 
     
      });
    e.click(function() {
      socket.emit('transform', {
        id: this.id,
	transform: $("input[name=transform]:checked").val(),
	fill: $("input[name=fill]:checked").val()
      });
    });
    $("#board").append(e);
  });
  socket.on('drag-stop', function(msg) {
     $("#" + msg.id).css({ left: msg.left, top: msg.top });
  });
  socket.on('drag', function(msg) {
     $("#" + msg.id).css({ left: msg.left, top: msg.top });
  });
  socket.on('transform', function(msg) {
    $("#" + msg.id)
      .css("transform", msg.transform)
      .css("fill", msg.fill);
  });
  $("#templates").children("svg").wrap("<span>");
  $("#templates")
    .children()
    .click(function() {
      socket.emit('create', $(this).html());
    });
});
