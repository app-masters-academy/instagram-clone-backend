function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.error('Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard() {
  const token = document.getElementById('token').innerText;
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(token);
    return;
  }
  navigator.clipboard.writeText(token).then(
    function () {
      console.log('Copying to clipboard was successful!');
    },
    function (err) {
      console.error('Could not copy text: ', err);
    },
  );
}
