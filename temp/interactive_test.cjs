const { chromium } = require('playwright');

(async () => {
  console.log('Starting interactive chatbot test on http://localhost:5173/ ...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Log browser console messages
  page.on('console', (msg) => {
    console.log(`[BROWSER ${msg.type().toUpperCase()}]:`, msg.text());
  });

  // Log browser uncaught page errors
  page.on('pageerror', (err) => {
    console.error('BROWSER CRITICAL EXCEPTION:', err.stack || err.message);
  });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 20000 });
    console.log('Page loaded. Waiting for 3 seconds for React initialization...');
    await page.waitForTimeout(3000);

    // Check if the chat is open (by checking if the "Đóng chat" button exists)
    const isChatOpen = await page.locator('button[title="Đóng chat"]').count() > 0;
    console.log('Is chatbot window open?', isChatOpen);

    if (!isChatOpen) {
      console.log('Chatbot is closed. Looking for floating bubble...');
      const bubble = page.locator('button:has(.lucide-message-circle), .fixed.bottom-6 button');
      if (await bubble.count() > 0) {
        await bubble.first().click();
        await page.waitForTimeout(1000);
        console.log('Clicked bubble. Chatbot window open now?', await page.locator('button[title="Đóng chat"]').count() > 0);
      }
    }

    // 2. Test expand/minimize button
    console.log('Testing Expand Chatbot feature...');
    const expandBtn = page.locator('button[title="Mở rộng"]');
    if (await expandBtn.count() > 0) {
      await expandBtn.click();
      console.log('Clicked Expand. Waiting 1 second...');
      await page.waitForTimeout(1000);
      
      const minimizeBtn = page.locator('button[title="Thu nhỏ"]');
      console.log('Minimize button visible?', await minimizeBtn.count() > 0);
      await minimizeBtn.click();
      console.log('Clicked Minimize. Waiting 1 second...');
      await page.waitForTimeout(1000);
    }

    // 3. Try to type a message and send it
    console.log('Sending a message to Hà Trần Carpets...');
    const textarea = page.locator('textarea[placeholder*="Nhắn tin"]');
    await textarea.fill('Chào bạn, bạn có thể tư vấn cho tôi thảm sàn văn phòng chất lượng cao được không? Vui lòng trình bày rõ ràng có outline và bảng tóm tắt nhé.');
    await page.waitForTimeout(500);
    
    // Select the button right after the textarea inside the input container
    const sendButton = page.locator('textarea[placeholder*="Nhắn tin"] + button');
    await sendButton.click();
    console.log('Message sent! Waiting for AI response (this calls Gemini API)...');

    // Wait up to 15 seconds for response to arrive
    let responseFound = false;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(1000);
      const isTyping = await page.isVisible('text=Đang trả lời...');
      
      // Print message bubble contents safely
      const messages = await page.evaluate(() => {
        // Query elements with class .markdown-content or the message bubbles
        const bubbles = Array.from(document.querySelectorAll('.markdown-content, div.rounded-2xl'));
        return bubbles.map(m => m.textContent.trim()).filter(text => text.length > 0);
      });
      console.log(`Step ${i}: isTyping=${isTyping}, messageCount=${messages.length}`);
      
      if (!isTyping && messages.length > 1) {
        console.log('\n--- CHAT RESPONSES ---');
        messages.forEach((m, idx) => {
          console.log(`[Message ${idx + 1}]:\n${m}\n-------------------`);
        });
        responseFound = true;
        break;
      }
    }

    if (responseFound) {
      console.log('SUCCESS: Gemini returned a response and chatbot rendered it successfully!');
    } else {
      console.log('TIMEOUT or ERROR: No response from Gemini.');
    }

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
