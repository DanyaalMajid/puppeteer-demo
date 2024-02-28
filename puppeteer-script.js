const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // Launch browser in non-headless mode for visibility
    args: [
        '--window-size=800,600',
        '-maximize'
      ]
  });
  const page = await browser.newPage();

  try {
    // Navigate to Google
    await page.goto('https://www.google.com');

    // Find the element using XPath
    const searchInputHandle = await page.evaluateHandle(() => document.evaluate("//textarea[@class='gLFyf' and @name='q']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);

    if (searchInputHandle) {
    
      await new Promise(resolve => setTimeout(resolve, 2500));
    
      // Click on the element
      await searchInputHandle.click();
      console.log('Clicked on the search input box.');

      await new Promise(resolve => setTimeout(resolve, 2500));
      let text = "nice pics"
      // Type keys one by one into the element with a delay
      for(let i = 0; i < text.length; i++)
      {
        await page.keyboard.type(text[i], { delay: 250 });
      }

      // Press the Enter key to submit the search
      await page.keyboard.press('Enter', { delay: 250 });
      console.log('Search submitted.');

      // Wait for navigation to complete
      await page.waitForNavigation();
      console.log('Navigated to the search results page.');

    
        const imageButtonSelectors = [
        'div.GKS7s > span.FMKtTb', // Selector for the "Images" button
        // Add more selectors if needed
        ];
    
        let imagesButton = null;
        
        for (const selector of imageButtonSelectors) {
            imagesButton = await page.$(selector);
            if (imagesButton) {
                const buttonText = await page.evaluate(element => element.textContent, imagesButton);
                if (buttonText.trim() === "Images") {
                    break; // Stop the loop if the button with correct text is found
                }
            }
        }
        
        if (imagesButton) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            await imagesButton.click();
            console.log('Clicked on the "Images" button.');
        } else {
            console.error('Images button not found or text inside the element is not "Images".');
        }

      await new Promise(resolve => setTimeout(resolve, 2500));


      // Smooth scroll to the bottom of the page
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          let totalHeight = 0;
          let distance = 100;
          let timer = setInterval(() => {
            let scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
      console.log('Smooth scroll to the bottom of the page completed.');
    } else {
      console.error('Search input box not found.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Don't close the browser window
    // await browser.close();
  }
})();
