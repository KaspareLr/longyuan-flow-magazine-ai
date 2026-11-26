(() => {
 const base = new URL('.', document.currentScript.src);
 const brand=`<img class="qikan-auth-brand" src="${new URL('assets/longyuan-home/longyuan-logo-v2.png',base)}" alt="龙源期刊网" width="98" height="32">`;
 // Encodes the mobile entry point for the WeChat sign-in demo.
 const wechatQr = '<svg class="qikan-auth-qr" viewBox="0 0 45 45" role="img" aria-label="微信登录二维码" shape-rendering="crispEdges"><path fill="white" d="M0 0h45v45H0z"/><path fill="black" d="M4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1zM10 4h1v1h-1zM13 4h1v1h-1zM15 4h1v1h-1zM16 4h1v1h-1zM17 4h1v1h-1zM19 4h1v1h-1zM20 4h1v1h-1zM22 4h1v1h-1zM23 4h1v1h-1zM24 4h1v1h-1zM27 4h1v1h-1zM29 4h1v1h-1zM32 4h1v1h-1zM34 4h1v1h-1zM35 4h1v1h-1zM36 4h1v1h-1zM37 4h1v1h-1zM38 4h1v1h-1zM39 4h1v1h-1zM40 4h1v1h-1zM4 5h1v1h-1zM10 5h1v1h-1zM14 5h1v1h-1zM16 5h1v1h-1zM18 5h1v1h-1zM24 5h1v1h-1zM26 5h1v1h-1zM30 5h1v1h-1zM31 5h1v1h-1zM34 5h1v1h-1zM40 5h1v1h-1zM4 6h1v1h-1zM6 6h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM15 6h1v1h-1zM16 6h1v1h-1zM17 6h1v1h-1zM18 6h1v1h-1zM19 6h1v1h-1zM20 6h1v1h-1zM23 6h1v1h-1zM24 6h1v1h-1zM25 6h1v1h-1zM27 6h1v1h-1zM31 6h1v1h-1zM32 6h1v1h-1zM34 6h1v1h-1zM36 6h1v1h-1zM37 6h1v1h-1zM38 6h1v1h-1zM40 6h1v1h-1zM4 7h1v1h-1zM6 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM10 7h1v1h-1zM12 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM21 7h1v1h-1zM24 7h1v1h-1zM26 7h1v1h-1zM28 7h1v1h-1zM29 7h1v1h-1zM30 7h1v1h-1zM31 7h1v1h-1zM34 7h1v1h-1zM36 7h1v1h-1zM37 7h1v1h-1zM38 7h1v1h-1zM40 7h1v1h-1zM4 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1zM8 8h1v1h-1zM10 8h1v1h-1zM12 8h1v1h-1zM14 8h1v1h-1zM16 8h1v1h-1zM21 8h1v1h-1zM22 8h1v1h-1zM23 8h1v1h-1zM24 8h1v1h-1zM25 8h1v1h-1zM27 8h1v1h-1zM28 8h1v1h-1zM30 8h1v1h-1zM32 8h1v1h-1zM34 8h1v1h-1zM36 8h1v1h-1zM37 8h1v1h-1zM38 8h1v1h-1zM40 8h1v1h-1zM4 9h1v1h-1zM10 9h1v1h-1zM12 9h1v1h-1zM16 9h1v1h-1zM17 9h1v1h-1zM19 9h1v1h-1zM20 9h1v1h-1zM22 9h1v1h-1zM24 9h1v1h-1zM25 9h1v1h-1zM26 9h1v1h-1zM28 9h1v1h-1zM31 9h1v1h-1zM32 9h1v1h-1zM34 9h1v1h-1zM40 9h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM8 10h1v1h-1zM9 10h1v1h-1zM10 10h1v1h-1zM12 10h1v1h-1zM14 10h1v1h-1zM16 10h1v1h-1zM18 10h1v1h-1zM20 10h1v1h-1zM22 10h1v1h-1zM24 10h1v1h-1zM26 10h1v1h-1zM28 10h1v1h-1zM30 10h1v1h-1zM32 10h1v1h-1zM34 10h1v1h-1zM35 10h1v1h-1zM36 10h1v1h-1zM37 10h1v1h-1zM38 10h1v1h-1zM39 10h1v1h-1zM40 10h1v1h-1zM12 11h1v1h-1zM16 11h1v1h-1zM19 11h1v1h-1zM25 11h1v1h-1zM26 11h1v1h-1zM27 11h1v1h-1zM28 11h1v1h-1zM30 11h1v1h-1zM31 11h1v1h-1zM32 11h1v1h-1zM4 12h1v1h-1zM6 12h1v1h-1zM7 12h1v1h-1zM8 12h1v1h-1zM9 12h1v1h-1zM10 12h1v1h-1zM13 12h1v1h-1zM14 12h1v1h-1zM15 12h1v1h-1zM18 12h1v1h-1zM19 12h1v1h-1zM20 12h1v1h-1zM21 12h1v1h-1zM23 12h1v1h-1zM26 12h1v1h-1zM29 12h1v1h-1zM30 12h1v1h-1zM31 12h1v1h-1zM32 12h1v1h-1zM34 12h1v1h-1zM35 12h1v1h-1zM36 12h1v1h-1zM37 12h1v1h-1zM38 12h1v1h-1zM6 13h1v1h-1zM8 13h1v1h-1zM11 13h1v1h-1zM13 13h1v1h-1zM14 13h1v1h-1zM19 13h1v1h-1zM22 13h1v1h-1zM23 13h1v1h-1zM24 13h1v1h-1zM27 13h1v1h-1zM32 13h1v1h-1zM35 13h1v1h-1zM39 13h1v1h-1zM4 14h1v1h-1zM5 14h1v1h-1zM6 14h1v1h-1zM7 14h1v1h-1zM9 14h1v1h-1zM10 14h1v1h-1zM14 14h1v1h-1zM15 14h1v1h-1zM19 14h1v1h-1zM20 14h1v1h-1zM22 14h1v1h-1zM24 14h1v1h-1zM25 14h1v1h-1zM29 14h1v1h-1zM31 14h1v1h-1zM35 14h1v1h-1zM38 14h1v1h-1zM39 14h1v1h-1zM40 14h1v1h-1zM4 15h1v1h-1zM8 15h1v1h-1zM9 15h1v1h-1zM11 15h1v1h-1zM15 15h1v1h-1zM16 15h1v1h-1zM18 15h1v1h-1zM19 15h1v1h-1zM23 15h1v1h-1zM24 15h1v1h-1zM25 15h1v1h-1zM26 15h1v1h-1zM27 15h1v1h-1zM33 15h1v1h-1zM35 15h1v1h-1zM36 15h1v1h-1zM40 15h1v1h-1zM6 16h1v1h-1zM8 16h1v1h-1zM10 16h1v1h-1zM11 16h1v1h-1zM14 16h1v1h-1zM15 16h1v1h-1zM16 16h1v1h-1zM17 16h1v1h-1zM19 16h1v1h-1zM21 16h1v1h-1zM23 16h1v1h-1zM24 16h1v1h-1zM26 16h1v1h-1zM27 16h1v1h-1zM28 16h1v1h-1zM29 16h1v1h-1zM31 16h1v1h-1zM33 16h1v1h-1zM34 16h1v1h-1zM36 16h1v1h-1zM37 16h1v1h-1zM38 16h1v1h-1zM39 16h1v1h-1zM40 16h1v1h-1zM9 17h1v1h-1zM12 17h1v1h-1zM15 17h1v1h-1zM18 17h1v1h-1zM21 17h1v1h-1zM22 17h1v1h-1zM23 17h1v1h-1zM24 17h1v1h-1zM25 17h1v1h-1zM27 17h1v1h-1zM29 17h1v1h-1zM32 17h1v1h-1zM35 17h1v1h-1zM4 18h1v1h-1zM5 18h1v1h-1zM7 18h1v1h-1zM8 18h1v1h-1zM9 18h1v1h-1zM10 18h1v1h-1zM12 18h1v1h-1zM13 18h1v1h-1zM14 18h1v1h-1zM15 18h1v1h-1zM16 18h1v1h-1zM19 18h1v1h-1zM20 18h1v1h-1zM21 18h1v1h-1zM24 18h1v1h-1zM30 18h1v1h-1zM31 18h1v1h-1zM34 18h1v1h-1zM35 18h1v1h-1zM36 18h1v1h-1zM37 18h1v1h-1zM39 18h1v1h-1zM40 18h1v1h-1zM4 19h1v1h-1zM6 19h1v1h-1zM8 19h1v1h-1zM9 19h1v1h-1zM15 19h1v1h-1zM17 19h1v1h-1zM18 19h1v1h-1zM20 19h1v1h-1zM22 19h1v1h-1zM23 19h1v1h-1zM24 19h1v1h-1zM25 19h1v1h-1zM26 19h1v1h-1zM33 19h1v1h-1zM34 19h1v1h-1zM35 19h1v1h-1zM36 19h1v1h-1zM39 19h1v1h-1zM40 19h1v1h-1zM7 20h1v1h-1zM9 20h1v1h-1zM10 20h1v1h-1zM14 20h1v1h-1zM17 20h1v1h-1zM18 20h1v1h-1zM19 20h1v1h-1zM21 20h1v1h-1zM22 20h1v1h-1zM26 20h1v1h-1zM29 20h1v1h-1zM31 20h1v1h-1zM32 20h1v1h-1zM33 20h1v1h-1zM34 20h1v1h-1zM36 20h1v1h-1zM38 20h1v1h-1zM40 20h1v1h-1zM5 21h1v1h-1zM6 21h1v1h-1zM7 21h1v1h-1zM8 21h1v1h-1zM11 21h1v1h-1zM16 21h1v1h-1zM17 21h1v1h-1zM18 21h1v1h-1zM19 21h1v1h-1zM20 21h1v1h-1zM21 21h1v1h-1zM23 21h1v1h-1zM24 21h1v1h-1zM27 21h1v1h-1zM28 21h1v1h-1zM29 21h1v1h-1zM32 21h1v1h-1zM37 21h1v1h-1zM39 21h1v1h-1zM4 22h1v1h-1zM6 22h1v1h-1zM10 22h1v1h-1zM11 22h1v1h-1zM12 22h1v1h-1zM17 22h1v1h-1zM21 22h1v1h-1zM26 22h1v1h-1zM28 22h1v1h-1zM29 22h1v1h-1zM30 22h1v1h-1zM31 22h1v1h-1zM32 22h1v1h-1zM34 22h1v1h-1zM35 22h1v1h-1zM39 22h1v1h-1zM40 22h1v1h-1zM5 23h1v1h-1zM7 23h1v1h-1zM11 23h1v1h-1zM12 23h1v1h-1zM14 23h1v1h-1zM16 23h1v1h-1zM17 23h1v1h-1zM20 23h1v1h-1zM22 23h1v1h-1zM24 23h1v1h-1zM25 23h1v1h-1zM26 23h1v1h-1zM32 23h1v1h-1zM33 23h1v1h-1zM34 23h1v1h-1zM35 23h1v1h-1zM40 23h1v1h-1zM5 24h1v1h-1zM6 24h1v1h-1zM8 24h1v1h-1zM9 24h1v1h-1zM10 24h1v1h-1zM11 24h1v1h-1zM12 24h1v1h-1zM13 24h1v1h-1zM15 24h1v1h-1zM17 24h1v1h-1zM20 24h1v1h-1zM21 24h1v1h-1zM22 24h1v1h-1zM23 24h1v1h-1zM27 24h1v1h-1zM29 24h1v1h-1zM30 24h1v1h-1zM32 24h1v1h-1zM33 24h1v1h-1zM34 24h1v1h-1zM36 24h1v1h-1zM38 24h1v1h-1zM5 25h1v1h-1zM6 25h1v1h-1zM8 25h1v1h-1zM15 25h1v1h-1zM17 25h1v1h-1zM18 25h1v1h-1zM20 25h1v1h-1zM21 25h1v1h-1zM22 25h1v1h-1zM23 25h1v1h-1zM24 25h1v1h-1zM27 25h1v1h-1zM29 25h1v1h-1zM32 25h1v1h-1zM33 25h1v1h-1zM37 25h1v1h-1zM5 26h1v1h-1zM6 26h1v1h-1zM7 26h1v1h-1zM10 26h1v1h-1zM12 26h1v1h-1zM13 26h1v1h-1zM14 26h1v1h-1zM15 26h1v1h-1zM17 26h1v1h-1zM18 26h1v1h-1zM19 26h1v1h-1zM20 26h1v1h-1zM25 26h1v1h-1zM28 26h1v1h-1zM29 26h1v1h-1zM30 26h1v1h-1zM31 26h1v1h-1zM32 26h1v1h-1zM35 26h1v1h-1zM36 26h1v1h-1zM37 26h1v1h-1zM39 26h1v1h-1zM40 26h1v1h-1zM5 27h1v1h-1zM6 27h1v1h-1zM7 27h1v1h-1zM9 27h1v1h-1zM11 27h1v1h-1zM13 27h1v1h-1zM17 27h1v1h-1zM20 27h1v1h-1zM23 27h1v1h-1zM24 27h1v1h-1zM25 27h1v1h-1zM28 27h1v1h-1zM31 27h1v1h-1zM33 27h1v1h-1zM34 27h1v1h-1zM35 27h1v1h-1zM36 27h1v1h-1zM39 27h1v1h-1zM40 27h1v1h-1zM4 28h1v1h-1zM5 28h1v1h-1zM6 28h1v1h-1zM7 28h1v1h-1zM8 28h1v1h-1zM9 28h1v1h-1zM10 28h1v1h-1zM12 28h1v1h-1zM15 28h1v1h-1zM16 28h1v1h-1zM20 28h1v1h-1zM21 28h1v1h-1zM22 28h1v1h-1zM23 28h1v1h-1zM26 28h1v1h-1zM27 28h1v1h-1zM28 28h1v1h-1zM29 28h1v1h-1zM30 28h1v1h-1zM31 28h1v1h-1zM34 28h1v1h-1zM36 28h1v1h-1zM38 28h1v1h-1zM39 28h1v1h-1zM4 29h1v1h-1zM6 29h1v1h-1zM12 29h1v1h-1zM14 29h1v1h-1zM15 29h1v1h-1zM16 29h1v1h-1zM17 29h1v1h-1zM19 29h1v1h-1zM21 29h1v1h-1zM23 29h1v1h-1zM24 29h1v1h-1zM27 29h1v1h-1zM32 29h1v1h-1zM35 29h1v1h-1zM37 29h1v1h-1zM38 29h1v1h-1zM4 30h1v1h-1zM10 30h1v1h-1zM12 30h1v1h-1zM14 30h1v1h-1zM15 30h1v1h-1zM16 30h1v1h-1zM17 30h1v1h-1zM19 30h1v1h-1zM20 30h1v1h-1zM24 30h1v1h-1zM26 30h1v1h-1zM29 30h1v1h-1zM30 30h1v1h-1zM31 30h1v1h-1zM34 30h1v1h-1zM36 30h1v1h-1zM37 30h1v1h-1zM38 30h1v1h-1zM39 30h1v1h-1zM40 30h1v1h-1zM4 31h1v1h-1zM8 31h1v1h-1zM9 31h1v1h-1zM15 31h1v1h-1zM16 31h1v1h-1zM17 31h1v1h-1zM19 31h1v1h-1zM24 31h1v1h-1zM25 31h1v1h-1zM26 31h1v1h-1zM30 31h1v1h-1zM31 31h1v1h-1zM33 31h1v1h-1zM35 31h1v1h-1zM36 31h1v1h-1zM40 31h1v1h-1zM4 32h1v1h-1zM7 32h1v1h-1zM10 32h1v1h-1zM12 32h1v1h-1zM13 32h1v1h-1zM14 32h1v1h-1zM15 32h1v1h-1zM18 32h1v1h-1zM19 32h1v1h-1zM21 32h1v1h-1zM23 32h1v1h-1zM26 32h1v1h-1zM27 32h1v1h-1zM28 32h1v1h-1zM29 32h1v1h-1zM30 32h1v1h-1zM31 32h1v1h-1zM32 32h1v1h-1zM33 32h1v1h-1zM34 32h1v1h-1zM35 32h1v1h-1zM36 32h1v1h-1zM37 32h1v1h-1zM38 32h1v1h-1zM40 32h1v1h-1zM12 33h1v1h-1zM13 33h1v1h-1zM14 33h1v1h-1zM18 33h1v1h-1zM20 33h1v1h-1zM22 33h1v1h-1zM23 33h1v1h-1zM24 33h1v1h-1zM25 33h1v1h-1zM27 33h1v1h-1zM29 33h1v1h-1zM31 33h1v1h-1zM32 33h1v1h-1zM36 33h1v1h-1zM37 33h1v1h-1zM4 34h1v1h-1zM5 34h1v1h-1zM6 34h1v1h-1zM7 34h1v1h-1zM8 34h1v1h-1zM9 34h1v1h-1zM10 34h1v1h-1zM14 34h1v1h-1zM15 34h1v1h-1zM19 34h1v1h-1zM22 34h1v1h-1zM24 34h1v1h-1zM25 34h1v1h-1zM28 34h1v1h-1zM32 34h1v1h-1zM34 34h1v1h-1zM36 34h1v1h-1zM38 34h1v1h-1zM39 34h1v1h-1zM40 34h1v1h-1zM4 35h1v1h-1zM10 35h1v1h-1zM12 35h1v1h-1zM13 35h1v1h-1zM17 35h1v1h-1zM18 35h1v1h-1zM19 35h1v1h-1zM20 35h1v1h-1zM23 35h1v1h-1zM24 35h1v1h-1zM25 35h1v1h-1zM26 35h1v1h-1zM32 35h1v1h-1zM36 35h1v1h-1zM37 35h1v1h-1zM39 35h1v1h-1zM40 35h1v1h-1zM4 36h1v1h-1zM6 36h1v1h-1zM7 36h1v1h-1zM8 36h1v1h-1zM10 36h1v1h-1zM12 36h1v1h-1zM13 36h1v1h-1zM14 36h1v1h-1zM16 36h1v1h-1zM17 36h1v1h-1zM22 36h1v1h-1zM23 36h1v1h-1zM26 36h1v1h-1zM28 36h1v1h-1zM29 36h1v1h-1zM30 36h1v1h-1zM31 36h1v1h-1zM32 36h1v1h-1zM33 36h1v1h-1zM34 36h1v1h-1zM35 36h1v1h-1zM36 36h1v1h-1zM38 36h1v1h-1zM39 36h1v1h-1zM4 37h1v1h-1zM6 37h1v1h-1zM7 37h1v1h-1zM8 37h1v1h-1zM10 37h1v1h-1zM12 37h1v1h-1zM15 37h1v1h-1zM16 37h1v1h-1zM18 37h1v1h-1zM19 37h1v1h-1zM20 37h1v1h-1zM22 37h1v1h-1zM23 37h1v1h-1zM26 37h1v1h-1zM27 37h1v1h-1zM29 37h1v1h-1zM30 37h1v1h-1zM31 37h1v1h-1zM33 37h1v1h-1zM34 37h1v1h-1zM36 37h1v1h-1zM37 37h1v1h-1zM38 37h1v1h-1zM39 37h1v1h-1zM40 37h1v1h-1zM4 38h1v1h-1zM6 38h1v1h-1zM7 38h1v1h-1zM8 38h1v1h-1zM10 38h1v1h-1zM12 38h1v1h-1zM14 38h1v1h-1zM15 38h1v1h-1zM16 38h1v1h-1zM21 38h1v1h-1zM25 38h1v1h-1zM26 38h1v1h-1zM28 38h1v1h-1zM31 38h1v1h-1zM33 38h1v1h-1zM39 38h1v1h-1zM40 38h1v1h-1zM4 39h1v1h-1zM10 39h1v1h-1zM13 39h1v1h-1zM18 39h1v1h-1zM20 39h1v1h-1zM22 39h1v1h-1zM24 39h1v1h-1zM25 39h1v1h-1zM30 39h1v1h-1zM32 39h1v1h-1zM33 39h1v1h-1zM36 39h1v1h-1zM40 39h1v1h-1zM4 40h1v1h-1zM5 40h1v1h-1zM6 40h1v1h-1zM7 40h1v1h-1zM8 40h1v1h-1zM9 40h1v1h-1zM10 40h1v1h-1zM12 40h1v1h-1zM14 40h1v1h-1zM18 40h1v1h-1zM21 40h1v1h-1zM26 40h1v1h-1zM29 40h1v1h-1zM30 40h1v1h-1zM33 40h1v1h-1zM36 40h1v1h-1zM37 40h1v1h-1zM38 40h1v1h-1zM39 40h1v1h-1zM40 40h1v1h-1z"/></svg>';
 const storageKey = 'qikan-auth-accounts:v1';
 const copy = {
  login: {title:'登录期刊网', description:'继续你的阅读。', submit:'登录'},
  register: {title:'注册期刊网账号', description:'开始使用你的阅读空间。', submit:'立即注册'},
  reset: {title:'重设密码', description:'设置新的登录密码。', submit:'保存新密码'}
 };
 const passwordField = (name, label, autocomplete) => `<label>${label}
   <span class="qikan-auth-password"><input name="${name}" type="password" autocomplete="${autocomplete}" maxlength="128">
   <button type="button" data-auth-password aria-label="显示${label}" aria-pressed="false">显示</button></span></label>`;
 const dialog = document.createElement('dialog');
 dialog.className = 'club-account-dialog qikan-auth-dialog';
 dialog.setAttribute('aria-labelledby','qikan-auth-title');
 dialog.innerHTML = '<button type="button" class="qikan-auth-close" aria-label="关闭账号弹窗">×</button><div data-auth-content></div>';
 document.body.append(dialog);
 const content = dialog.querySelector('[data-auth-content]');
 const close = dialog.querySelector('.qikan-auth-close');
 let session, mode, email, phone;

 function findProfile(identity){
  try{
   const accounts=JSON.parse(localStorage.getItem(storageKey)||'[]');
   return accounts.find(item=>item.email===identity)?.profile;
  }catch{return undefined;}
 }
 function rememberProfile(profile){
  try{
   const accounts=JSON.parse(localStorage.getItem(storageKey)||'[]');
   const identity=profile.dsuId;
   localStorage.setItem(storageKey,JSON.stringify([...accounts.filter(item=>item.email!==identity),{email:identity,profile}]));
  }catch{}
 }
 function render(){
  if(mode==='wechat'){
   content.innerHTML=`<div class="qikan-auth-scan">
    <p><i class="iconfont icon-Wechat" aria-hidden="true"></i> 使用微信扫一扫登录</p>
    <h2 id="qikan-auth-title">龙源期刊网</h2>
    ${wechatQr}
    <button class="qikan-auth-submit" type="button" data-auth-provider="continue">继续登录</button>
    <button class="qikan-auth-text-action" type="button" data-auth-mode="login">返回登录</button>
   </div>`;
   content.querySelector('[data-auth-provider]').focus();
   return;
  }
  const text=copy[mode];
  const registering=mode==='register',resetting=mode==='reset';
  content.innerHTML=`${brand}<h2 id="qikan-auth-title">${text.title}</h2><p class="qikan-auth-description">${text.description}</p>
   ${resetting?'':`<div class="qikan-auth-tabs" role="group" aria-label="账号操作">
    <button type="button" data-auth-mode="login" aria-pressed="${mode==='login'}">登录</button>
    <button type="button" data-auth-mode="register" aria-pressed="${registering}">注册</button></div>`}
   <form class="qikan-auth-form" novalidate>
    ${registering?`<label>手机号<input name="phone" type="tel" autocomplete="tel" placeholder="请输入手机号"></label>
     <div class="qikan-auth-code-row">
      <label>图形验证码<input name="captcha" autocomplete="off" placeholder="请输入图形验证码"></label>
      <button type="button" class="qikan-auth-captcha" data-auth-captcha aria-label="刷新图形验证码，当前为 7103">7103</button>
     </div>
     <div class="qikan-auth-code-row">
      <label>验证码<input name="sms" inputmode="numeric" autocomplete="one-time-code" placeholder="请输入验证码"></label>
      <button type="button" class="qikan-auth-send" data-auth-sms>发送验证码</button>
     </div>
     <label>用户名<input name="nickname" autocomplete="nickname" maxlength="20" placeholder="请输入用户名"></label>`:
     `<label>${resetting?'邮箱':'手机号或邮箱'}<input name="email" type="${resetting?'email':'text'}" autocomplete="username" maxlength="254" placeholder="${resetting?'请输入邮箱':'请输入手机号或邮箱'}"></label>`}
    <div class="qikan-auth-password-group">
     ${passwordField('password',resetting?'新密码':'密码',mode==='login'?'current-password':'new-password')}
     ${mode==='login'?'<button class="qikan-auth-text-action" type="button" data-auth-mode="reset">忘记密码？</button>':''}
    </div>
    ${mode!=='login'?passwordField('confirm',registering?'重复密码':'确认密码','new-password'):''}
    ${registering?`<p class="qikan-auth-terms">点击“注册”即表示您同意并愿意遵守 <a href="https://www.qikan.com.cn/userrelative/serviceterms.html" target="_blank" rel="noopener">龙源期刊网注册协议</a> 和 隐私政策。</p>`:''}
    <button class="qikan-auth-submit" type="submit">${text.submit}</button>
   </form>
   ${mode==='login'?`<div class="qikan-auth-other"><p>其他方式登录</p><div class="qikan-auth-providers">
    <button type="button" data-auth-mode="wechat" aria-label="微信登录"><i class="iconfont icon-Wechat" aria-hidden="true"></i></button>
    <button type="button" data-auth-provider="qq" aria-label="QQ 登录"><i class="iconfont icon-QQ" aria-hidden="true"></i></button>
   </div></div>`:''}
   ${resetting?'<button class="qikan-auth-text-action qikan-auth-return" type="button" data-auth-mode="login">返回登录</button>':''}`;
  const form=content.querySelector('form');
  const accountInput=form.elements.phone||form.elements.email;
  accountInput.value=registering?phone:email;
  form.addEventListener('submit',submit);
  accountInput.focus();
 }
 function submit(event){
  event.preventDefault();
  const form=event.currentTarget;
  const account=form.elements.email?.value.trim().toLowerCase()||form.elements.phone?.value.trim()||'';
  if(form.elements.email)email=account;
  if(mode==='reset'){
   mode='login';render();return;
  }
  finishSignIn(account, form.elements.nickname?.value.trim());
 }
 function finishSignIn(account='', username=''){
  const identity=account||'林间读者';
  const previous=findProfile(identity);
  const nickname=username||previous?.nickname||account.split('@')[0].slice(0,20)||'林间读者';
  const contact=mode==='register'||/^\+?[\d -]+$/.test(account)?{phone:account}:{email:account};
  session.update({...previous,...contact,nickname,dsuId:identity,role:'reader'});
  dialog.close();
 }
 content.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(button?.hasAttribute('data-auth-password')){
   const input=button.previousElementSibling,show=input.type==='password';
   input.type=show?'text':'password';button.textContent=show?'隐藏':'显示';
   button.setAttribute('aria-pressed',String(show));
   button.setAttribute('aria-label',(show?'隐藏':'显示')+input.closest('label').firstChild.textContent.trim());
  }
  if(button?.hasAttribute('data-auth-captcha')){
   const code=1000+(Number(button.textContent)-1000+1+Math.floor(Math.random()*8999))%9000;
   button.textContent=code;
   button.setAttribute('aria-label',`刷新图形验证码，当前为 ${code}`);
  }
  if(button?.hasAttribute('data-auth-sms'))button.textContent='重新发送';
  if(button?.dataset.authProvider)finishSignIn();
  if(button?.dataset.authMode){
   phone=content.querySelector('[name=phone]')?.value??phone;
   email=content.querySelector('[name=email]')?.value||email;
   mode=button.dataset.authMode;render();
  }
 });
 close.addEventListener('click',()=>dialog.close());
 window.addEventListener('club-session-change',()=>{
  const profile=window.clubSession?.profile;
  if(profile?.dsuId)rememberProfile(profile);
 });
 window.qikanAuth={
  open(accountSession, initialMode='login'){
   if(dialog.open)return;
   session=accountSession;mode=initialMode;email='';phone='';
   dialog.showModal();render();
  }
 };
 if(new URLSearchParams(location.search).has('wechat-login')){
  window.addEventListener('DOMContentLoaded',()=>{
   if(!window.clubSession||window.clubSession.profile)return;
   window.qikanAuth.open(window.clubSession,'wechat');
   content.querySelector('.qikan-auth-qr').hidden=true;
   content.querySelector('.qikan-auth-scan > p').textContent='微信登录';
  },{once:true});
 }
})();
