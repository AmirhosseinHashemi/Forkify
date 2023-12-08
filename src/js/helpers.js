import { TIMEOUT_SEC } from './config.js';

// promisifying setTimeout
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    // send and receive request with limit time
    const fetchPromise = fetch(url);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    // handle errors that returns fulfiled promise
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    // rethrow error for another async function to handle it there
    throw err;
  }
};

export const sendJSON = async function (url, uploadedData) {
  try {
    // send data for server
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadedData),
    });
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    // handle errors that returns fulfiled promise
    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    return data;
  } catch (err) {
    // rethrow error for another async function to handle it there
    throw err;
  }
};
