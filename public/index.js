// const token = 'AFTP03jkUXBqvpOrhnnEkMhSSGZxK9Eo'

function openDoorAccess() {
  changeLedState('2', true);

  $('.msg-content').append(`<p>[Action] Door Opened!</p>`);
  $('.status__access').html('On');
  $('.status__door').html('Opened');
}

function closeDoorAccess() {
  changeLedState('2', false);

  $('.msg-content').append(`<p>[Action] Door Closed!</p>`);
  $('.status__access').html('Off');
  $('.status__door').html('Closed');
}

function changeLedState(id, state) {
  $.ajax({
    url: `http://192.168.43.129:8484/actions/ledState`,
    method: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      'ledId': id,
      'state': state
    }),
    processData: false,
    success: () => console.log('Led State Changed!'),
    error: (err) => {
      console.log(errorThrown);
      $('.msg-content').append(`<p>[ERROR] ${err}</p>`);
    }
  });
}

function getLedState() {
  $.ajax({
    url: `http://192.168.43.129:8484/properties/leds`,
    method: 'GET',
    dataType: 'json',
    processData: false,
    success: (res) => {
      if (res[0]['1']) {
        changeLedState('1', true);
        $('#power-switch').prop('checked', true);
        $('.status__power').html('On');
      } else {
        changeLedState('1', false);
        $('#power-switch').prop('checked', false);
        $('.status__power').html('Off');
      }

      changeLedState('2', false);
      $('.status-access').html('Off');
    },
    error: (err) => console.log(err)
  });
}

function startSocket() {
  const ws = new WebSocket(`ws://192.168.43.129:8484/properties/pir`);

  ws.onopen = () => console.log('Connection Opened!');
  ws.onmessage = (msg) => {
    let data = JSON.parse(msg.data);

    if (!$('#power-switch').prop('checked')) {
      console.log('test')
      if (data.presence) openDoorAccess();
      else closeDoorAccess();
    } else {
      if (data.presence) $('.msg-content').append(`<p>[ERROR] You Can't Get In.</p>`);
    }
  };
  ws.onclose = () => console.log('Connection Closed!');
}

// initial
$(document).ready(async () => {
  $('.msg-content').html();

  // await getLedState();
  if ($('#power-switch').prop('checked')) {
    $('.status__power').html('On');
  } else {
    $('.status__power').html('Off');
  }

  startSocket();
});

// toggle switch
$(function () {
  $('#power-switch').bootstrapToggle({
    on: 'On',
    off: 'Off'
  });
});

$(function () {
  $('#power-switch').change(function () {
    if ($(this).prop('checked')) {
      changeLedState('1', true);
      $('.status__power').html('On');
    } else {
      changeLedState('1', false);
      $('.status__power').html('Off');
    }
  });
});