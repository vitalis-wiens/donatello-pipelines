export const validIRI = str => {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(str);
};

export const get = url => {
  return new Promise((fulfil, reject) => {
    const mimeType = "application/json";
    const xhr = new XMLHttpRequest();

    xhr.overrideMimeType(mimeType);

    xhr.onerror = reject;
    xhr.onload = () => fulfil(xhr.responseText);
    xhr.open("GET", url);

    xhr.send();
  });
};
