function sendAction(type, val) {
  $.ajax({
    url: `https://api.evrythng.com/actions/${type}?access_token=${key}`,
    dataType: 'json',
    method: 'post',
    contentType: 'application/json',
    data: JSON.stringify({
      'type': type,
      'thng': thngId,
      'customFields': val
    }),
    processData: false,
    success: (data, textStatus, jqXhr) => $('#response pre').html(JSON.stringify(data)),
    error: (jqXhr, textStatus, errorThrown) => console.log(errorThrown)
  });
}

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