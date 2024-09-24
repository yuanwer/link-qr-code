// 获取本地 IP 地址
function getLocalIPAddress(callback) {
  // 兼容不同浏览器对 RTCPeerConnection 的实现
  const RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  const pc = new RTCPeerConnection({ iceServers: [] });
  pc.createDataChannel("");
  pc.createOffer().then(offer => pc.setLocalDescription(offer));
  pc.onicecandidate = (ice) => {
    if (!ice || !ice.candidate || !ice.candidate.candidate) return;
    // 使用正则表达式分别匹配 IPv4 和 IPv6 地址
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

// 将本地 URL 转换为局域网 URL
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

// 主函数：获取当前标签页 URL，转换 URL，生成二维码
function generateQRCode() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let currentUrl = tabs[0].url;

    getLocalIPAddress(function (localIP) {
      currentUrl = convertLocalUrlToLAN(currentUrl, localIP);

      try {
        // 使用 qrcode 库生成二维码
        let qr = qrcode(0, 'M');
        qr.addData(currentUrl);
        qr.make();

        let qrCodeImg = qr.createImgTag(5);

        // 将二维码图片插入页面
        document.getElementById('qrcode').innerHTML = qrCodeImg;
        document.getElementById('url').innerHTML = currentUrl;
      } catch (error) {
        document.getElementById('qrcode').innerHTML = "二维码生成失败，请重试。";
      }
    });
  });
}

// 页面加载完成后执行二维码生成函数
document.addEventListener('DOMContentLoaded', generateQRCode);