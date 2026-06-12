const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

const baseUrl = "http://localhost:5173";

// Função simples para esperar X ms
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Carregamento robusto (3 tentativas)
async function safeGet(driver, url) {
  for (let i = 0; i < 3; i++) {
    try {
      await driver.get(url);
      return;
    } catch {
      console.log(`Falha ao carregar página (tentativa ${i + 1}), retry...`);
      await sleep(1500);
    }
  }
  throw new Error("Não foi possível carregar a página após 3 tentativas");
}

async function setupDriver() {
  const options = new chrome.Options();
  options.addArguments("--start-maximized");
  return await new Builder().forBrowser("chrome").setChromeOptions(options).build();
}

async function runBasicLoginTest() {
  const driver = await setupDriver();

  try {
    // ---------------------------------------------------------
    // TC001 — Aceder à página de login
    // ---------------------------------------------------------
    console.log("TC001 - Aceder à página de login");

    await safeGet(driver, baseUrl);
    await sleep(800); // espera extra

    await driver.wait(until.elementLocated(By.css(".subtitle")), 15000);
    console.log("Página de login apresentada");

    // ---------------------------------------------------------
    // TC002 — Inserir email válido
    // ---------------------------------------------------------
    console.log("TC002 - Inserir email válido");

    await driver.wait(until.elementLocated(By.css("input[type='email']")), 15000);
    const emailInput = await driver.findElement(By.css("input[type='email']"));
    await sleep(300);
    await emailInput.sendKeys("samuel.pinho.fernandes@gmail.com");
    console.log("Email aceite");

    // ---------------------------------------------------------
    // TC003 — Inserir password válida
    // ---------------------------------------------------------
    console.log("TC003 - Inserir password válida");

    await driver.wait(until.elementLocated(By.css("input[type='password']")), 15000);
    const passInput = await driver.findElement(By.css("input[type='password']"));
    await sleep(300);
    await passInput.sendKeys("familia123");
    console.log("Password aceite");

    // ---------------------------------------------------------
    // TC004 — Clicar em Sign In e validar dashboard
    // ---------------------------------------------------------
    console.log("TC004 - Clicar em 'Sign In' e validar redirecionamento");

    const button = await driver.findElement(By.css(".btn-primary"));
    await sleep(300);
    await button.click();

    await driver.wait(until.urlContains("/dashboard"), 15000);
    console.log("Utilizador redirecionado para o dashboard");

    // ---------------------------------------------------------
    // PAUSA NO DASHBOARD
    // ---------------------------------------------------------
    console.log("Aguardar 5 segundos no dashboard...");
    await sleep(5000);

  } catch (err) {
    console.error("Erro no teste:", err);
  } finally {
    await driver.quit();
  }
}

runBasicLoginTest();
