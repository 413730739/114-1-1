let letters = [];
let images = {};
let modalVisible = false;
let currentImage = null;
let modalWidth, modalHeight, modalX, modalY;
let closeButtonSize = 30;
let closeButtonX, closeButtonY;

function preload() {
  // 預先載入所有字母圖片
  for (let i = 0; i < 26; i++) {
    let char = String.fromCharCode(97 + i);
    images[char] = loadImage(`p/${char}.png`);
  }
}

function setup() { // 初始化設定
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  const cols = 6;
  const rows = 5;
  const colWidth = width / cols;
  const rowHeight = height / rows;
  const fontSize = min(colWidth, rowHeight) / 2;
  textSize(fontSize);

  for (let i = 0; i < 26; i++) {
    let charCode = 65 + i;
    let lowerChar = String.fromCharCode(charCode + 32);
    let upperChar = String.fromCharCode(charCode);

    let col = i % cols;
    let row = floor(i / cols);

    letters.push({
      text: upperChar + lowerChar,
      x: col * colWidth + colWidth / 2,
      y: row * rowHeight + rowHeight / 2,
      color: color((i * 360) / 26, 80, 90),
      img: images[lowerChar],
      width: textWidth(upperChar + lowerChar),
      height: fontSize
    });
  }
}

function draw() {
  background(35, 5, 95); // 米白色

  // 繪製所有字母
  for (let letter of letters) {
    fill(letter.color);
    text(letter.text, letter.x, letter.y);
  }

  // 如果需要，繪製彈出視窗
  if (modalVisible) {
  

    // 彈出視窗
    fill(255);
    modalX = (width - modalWidth) / 2;
    modalY = (height - modalHeight) / 2;
    rect(modalX, modalY, modalWidth, modalHeight, 10);

    // 顯示字卡圖片
    if (currentImage) {
      let imgDisplayWidth = modalWidth - 40;
      let imgDisplayHeight = modalHeight - 40;
      image(currentImage, modalX + 20, modalY + 20, imgDisplayWidth, imgDisplayHeight);
    }

    // 關閉按鈕
    fill(200);
    ellipse(closeButtonX + closeButtonSize / 2, closeButtonY + closeButtonSize / 2, closeButtonSize);
    fill(0);
    stroke(0);
    strokeWeight(2);
    closeButtonX = modalX + modalWidth - closeButtonSize - 10;
    closeButtonY = modalY + 10;
    line(closeButtonX + 5, closeButtonY + 5, closeButtonX + closeButtonSize - 5, closeButtonY + closeButtonSize - 5);
    line(closeButtonX + closeButtonSize - 5, closeButtonY + 5, closeButtonX + 5, closeButtonY + closeButtonSize - 5);
    noStroke();
  }
}

function mousePressed() {
  if (modalVisible) {
    // 檢查是否點擊了關閉按鈕
    if (dist(mouseX, mouseY, closeButtonX + closeButtonSize / 2, closeButtonY + closeButtonSize / 2) < closeButtonSize / 2) {
      modalVisible = false;
      currentImage = null;
    }
  } else {
    // 檢查是否點擊了某個字母
    for (let letter of letters) {
      if (mouseX > letter.x - letter.width / 2 && mouseX < letter.x + letter.width / 2 &&
          mouseY > letter.y - letter.height / 2 && mouseY < letter.y + letter.height / 2) {
        modalVisible = true;
        currentImage = letter.img;

        // --- 動態計算彈出視窗的大小 ---
        const padding = 40;
        let maxModalWidth = windowWidth * 0.9;
        let maxModalHeight = windowHeight * 0.9;
        let imgRatio = currentImage.width / currentImage.height;

        modalWidth = currentImage.width + padding;
        modalHeight = currentImage.height + padding;

        // 確保視窗不會超出螢幕範圍
        if (modalWidth > maxModalWidth) {
          modalWidth = maxModalWidth;
          modalHeight = (modalWidth - padding) / imgRatio + padding;
        }
        if (modalHeight > maxModalHeight) {
          modalHeight = maxModalHeight;
          modalWidth = (modalHeight - padding) * imgRatio + padding;
        }
        // --- 計算結束 ---

        break;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup(); // 重新計算佈局
}
