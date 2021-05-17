let params = {
  key: '',
  thngId: ''
};


function getSearchParams(url) {
  for (let pair of url.searchParams.entries()) {
    params[pair[0]] = pair[1];
  }
}

function sendAction(type, value) {
  $.ajax({
    url: `https://api.evrythng.com/thngs/${params.thngId}/actions/${type}?access_token=${params.key}`,
    method: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      'type': type,
      'thng': params.thngId,
      'customFields': value
    }),
    processData: false,
    success: (data, textStatus, jqXhr) => $('response pre').html(JSON.stringify(data)),
    error: (jqXhr, textStatus, errorThrown) => console.log(errorThrown)
  });
}

function startWebSocket() {
  const url = `wss://ws.evrythng.com:443/thngs/${params.thngId}/properties?access_token=${params.key}`;
  const socket = new WebSocket(url);

  socket.onopen = () => console.log(`WebSocket Connected!`);

  socket.onmessage = (message) => {
    const content = JSON.parse(message.data);

    console.log(`Property Update: ${content[0]}`);
    $(`#value-${content[0].key}`).html(content[0].value);
  }

  socket.onerror = (error) => {
    console.log('An error occurred while trying to connect to a WebSocket!');
    console.log(error);
  };

}

getSearchParams(new URL(location.href));
startWebSocket();



// toggle switch
$(function () {
  $('#toggle-status').bootstrapToggle({
    on: 'On',
    off: 'Off'
  });
});

$(function () {
  $('#toggle-status').change(function () {
    sendAction("_setStatus", {
      "status": $(this).prop('checked')
    });
  });
});