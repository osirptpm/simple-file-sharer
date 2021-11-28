export function copyToClipboard(value) {
  const input = document.createElement('input');
  input.value = value;
  input.select();
  input.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(input.value);
}