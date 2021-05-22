const ws = new WebSocket('ws://192.168.0.17:8484/properties/pir');

function openDoorAccess() {
  changeLedState('2', true);

  $('.msg-content').append(`<p>[Action] Door Opened!</p>`);
  $('.status-door').html('Opened');
}

function closeDoorAccess() {
  changeLedState('2', false);

  $('.msg-content').append(`<p>[Action] Door Locked!</p>`);
  $('.status-door').html('Locked');
}

function changeLedState(id, state) {
  $.ajax({
    url: 'http://192.168.0.17:8484/actions/ledState',
    method: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      'ledId': id,
      'state': state
    }),
    processData: false,
    success: (res) => console.log(res),
    error: (err) => {
      console.log(errorThrown);
      $('.msg-content').append(`<p>[ERROR] ${err}</p>`);
    }
  });
}

function getLedState() {
  $.ajax({
    url: 'http://192.168.0.17:8484/properties/leds',
    method: 'GET',
    dataType: 'json',
    processData: false,
    success: (res) => {
      if (res['1']) {
        $('#power-switch').prop('checked', true);
        $('.status__power').html('On');
      } else {
        $('#power-switch').prop('checked', false);
        $('.status__power').html('Off');
      }
    },
    error: (err) => console.log(err)
  });
}

function initial() {
  $('.msg-content').html();

  getLedState();
}

ws.onopen = () => console.log('Connection Opened!');
ws.onmessage = (msg) => {
  let data = JSON.parse(msg.data);

  if ($('#power-switch').prop('checked')) {
    if (data.presence) openDoorAccess();
    else closeDoorAccess();
  }

  Object.keys(data).forEach(
    (key) => console.log(`${key}: ${data[key]}`));
};
ws.onclose = () => console.log('Connection Closed!');

// initial
$(document).ready(initial);

// toggle switch
$(function () {
  $('#power-switch').bootstrapToggle({
    on: 'On',
    off: 'Off'
  });
});

$(function () {
  $('#power-switch').change(function () {
    if ($(this).prop('checked')) $('.status__power').html('On');
    else $('.status__power').html('Off');
  });
});