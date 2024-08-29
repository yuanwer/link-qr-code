// Get local IP address
function getLocalIPAddress(callback) {
  // Compatible with different browser implementations of RTCPeerConnection
  const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  const pc = new RTCPeerConnection({ iceServers: [] });
  pc.createDataChannel("");
  pc.createOffer().then(offer => pc.setLocalDescription(offer));
  pc.onicecandidate = (ice) => {
    if (!ice || !ice.candidate || !ice.candidate.candidate) return;
    // Use regular expressions to match IPv4 and IPv6 addresses separately
    const ipv4Regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
    const ipv6Regex = /([a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
    let localIP;
    const ipv4Match = ice.candidate.candidate.match(ipv4Regex);
    const ipv6Match = ice.candidate.candidate.match(ipv6Regex);
    if (ipv4Match) {
      localIP = ipv4Match[1];
    } else if (ipv6Match) {
      localIP = ipv6Match[1];
    }
    if (localIP) {
      pc.onicecandidate = null;
      callback(localIP);
    }
  };
}

// Convert local URL to LAN URL
function convertLocalUrlToLAN(url, localIP) {
  const localUrls = ['127.0.0.1', 'localhost', '[::1]'];
  try {
    const urlObj = new URL(url);
    if (localUrls.includes(urlObj.hostname)) {
      urlObj.hostname = localIP;
      return urlObj.toString();
    }
    return url;
  } catch (error) {
    return url;
  }
}

// Main function: Get current tab URL, convert URL, generate QR code
function generateQRCode() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentUrl = tabs[0].url;

    getLocalIPAddress(function (localIP) {
      currentUrl = convertLocalUrlToLAN(currentUrl, localIP);

      try {
        // Use qrcode library to generate QR code
        let qr = qrcode(0, 'M');
        qr.addData(currentUrl);
        qr.make();

        let qrCodeImg = qr.createImgTag(5);

        // Insert QR code image into the page
        document.getElementById('qrcode').innerHTML = qrCodeImg;
        document.getElementById('url').innerHTML = currentUrl;
      } catch (error) {
        document.getElementById('qrcode').innerHTML = "QR code generation failed, please try again.";
      }
    });
  });
}

// Execute the QR code generation function after the page has finished loading
document.addEventListener('DOMContentLoaded', generateQRCode);