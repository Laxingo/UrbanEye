const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

const baseUrl = "http://localhost:5173";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function setupDriver() {
  const options = new chrome.Options();
  options.addArguments("--start-maximized");
  return await new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function runCreateEventTest() {
  const driver = await setupDriver();

  try {
    // ---------------------------------------------------------
    // LOGIN
    // ---------------------------------------------------------
    console.log("TC000 - Login");

    await driver.get(baseUrl);

    await driver.wait(until.elementLocated(By.css("input[type='email']")), 15000);
    await driver.findElement(By.css("input[type='email']")).sendKeys("samuel.pinho.fernandes@gmail.com");

    await driver.wait(until.elementLocated(By.css("input[type='password']")), 15000);
    await driver.findElement(By.css("input[type='password']")).sendKeys("familia123");

    await sleep(300);
    await driver.findElement(By.css(".btn-primary")).click();

    await driver.wait(until.urlContains("/dashboard"), 20000);
    console.log("Login efetuado com sucesso");

    // ---------------------------------------------------------
    // Step 1 — Clicar em "New Event"
    // ---------------------------------------------------------
    console.log("TC001 - Clicar em 'New Event'");

    await driver.wait(until.elementLocated(By.css(".navbar .new-event")), 20000);
    const createBtn = await driver.findElement(By.css(".navbar .new-event"));
    await sleep(500);
    await createBtn.click();

    console.log("Botão 'New Event' clicado");

    // Esperar modo de seleção de localização
    await driver.wait(until.elementLocated(By.css(".map-instruction")), 20000);
    console.log("Modo de seleção de localização ativo");

    // ---------------------------------------------------------
    // Step 2 — Clicar no mapa (Leaflet)
    // ---------------------------------------------------------
    console.log("TC002 - Selecionar localização no mapa");

    await driver.wait(until.elementLocated(By.css("#map")), 20000);
    const map = await driver.findElement(By.css("#map"));
    const rect = await map.getRect();

    // Clique real com coordenadas absolutas
    await driver.actions()
      .move({ x: rect.x + rect.width * 0.5, y: rect.y + rect.height * 0.5 })
      .click()
      .pause(200)
      .click()
      .perform();

    console.log("Clique no mapa efetuado");

    // ---------------------------------------------------------
    // Step 3 — Esperar formulário abrir
    // ---------------------------------------------------------
    await driver.wait(until.elementLocated(By.css(".overlay")), 20000);
    console.log("Formulário apresentado");

    // ---------------------------------------------------------
    // Step 4 — Preencher formulário
    // ---------------------------------------------------------
    console.log("TC003 - Preencher campos obrigatórios");

    const titleInput = await driver.findElement(By.css(".modal input[placeholder='Event Title']"));
    const descriptionInput = await driver.findElement(By.css(".modal textarea"));
    const categoryInput = await driver.findElement(By.css(".modal select:nth-of-type(1)"));
    const locationInput = await driver.findElement(By.css(".modal input[placeholder='Location description']"));
    const priorityInput = await driver.findElement(By.css(".modal select:nth-of-type(2)"));

    await titleInput.sendKeys("Evento de Teste Selenium");
    await descriptionInput.sendKeys("Descrição automática gerada pelo teste Selenium.");
    await categoryInput.sendKeys("Infrastructure");
    await locationInput.sendKeys("Vila do Conde");
    await priorityInput.sendKeys("Medium");

    console.log("Campos preenchidos");

    // ---------------------------------------------------------
    // Step 5 — Submeter e validar evento
    // ---------------------------------------------------------
    console.log("TC004 - Submeter formulário");

    const submitBtn = await driver.findElement(By.css(".modal .create"));
    await submitBtn.click();

    await sleep(2500);

    const eventCard = await driver.wait(
      until.elementLocated(
        By.xpath("//div[contains(@class,'event-card')][.//h3[contains(text(),'Evento de Teste Selenium')]]")
      ),
      20000
    );

    console.log("Evento encontrado no dashboard");

    const status = await eventCard.findElement(By.css(".status")).getText();

    if (status.toLowerCase().includes("pending")) {
      console.log("✔ Evento criado com estado 'pending'");
    } else {
      console.log("❌ Estado incorreto:", status);
    }

  } catch (err) {
    console.error("Erro no teste:", err);
  } finally {
    await driver.quit();
  }
}

runCreateEventTest();
