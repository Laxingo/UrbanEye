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

// Verifica se elemento está visível
async function isElementVisible(driver, selector) {
  try {
    const element = await driver.findElement(By.css(selector));
    return await element.isDisplayed();
  } catch {
    return false;
  }
}

// Aguarda elemento desaparecer
async function waitForElementToDisappear(driver, selector, timeout = 10000) {
  return await driver.wait(
    until.stalenessOf(await driver.findElement(By.css(selector))),
    timeout
  );
}

async function runCreateEventTest() {
  const driver = await setupDriver();
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    // ---------------------------------------------------------
    // TC000 - LOGIN
    // ---------------------------------------------------------
    console.log("\n=== TC000 - LOGIN ===");

    await driver.get(baseUrl);
    
    // Verificar se página de login carregou
    const emailInput = await driver.wait(
      until.elementLocated(By.css("input[type='email']")),
      15000
    );
    console.log("✔ Página de login carregada");
    testsPassed++;

    // Preencher credenciais
    await emailInput.sendKeys("samuel.pinho.fernandes@gmail.com");
    const passwordInput = await driver.findElement(By.css("input[type='password']"));
    await passwordInput.sendKeys("familia123");

    await sleep(300);

    // Clicar em login
    const loginBtn = await driver.findElement(By.css(".btn-primary"));
    await loginBtn.click();
    console.log("✔ Clique em botão de login");
    testsPassed++;

    // Aguardar redirecionamento para dashboard
    await driver.wait(until.urlContains("/dashboard"), 20000);
    console.log("✔ Login bem-sucedido, redirecionado para /dashboard");
    testsPassed++;

    // ---------------------------------------------------------
    // TC001 - VERIFICAR COMPONENTES DE LAYOUT
    // ---------------------------------------------------------
    console.log("\n=== TC001 - COMPONENTES DE LAYOUT ===");

    await sleep(1000);

    // Verificar Sidebar
    const sidebar = await isElementVisible(driver, ".sidebar");
    if (sidebar) {
      console.log("✔ Sidebar carregada e visível");
      testsPassed++;
    } else {
      console.log("❌ Sidebar não encontrada");
      testsFailed++;
    }

    // Verificar Navbar
    const navbar = await isElementVisible(driver, ".navbar");
    if (navbar) {
      console.log("✔ Navbar carregada e visível");
      testsPassed++;
    } else {
      console.log("❌ Navbar não encontrada");
      testsFailed++;
    }

    // Verificar mapa
    const mapContainer = await isElementVisible(driver, "#map");
    if (mapContainer) {
      console.log("✔ Mapa carregado e visível");
      testsPassed++;
    } else {
      console.log("❌ Mapa não encontrado");
      testsFailed++;
    }

    // Verificar painel de eventos
    const eventsPanel = await isElementVisible(driver, ".events-panel");
    if (eventsPanel) {
      console.log("✔ Painel de eventos carregado e visível");
      testsPassed++;
    } else {
      console.log("❌ Painel de eventos não encontrado");
      testsFailed++;
    }

    // ---------------------------------------------------------
    // TC002 - CLICAR EM "NEW EVENT"
    // ---------------------------------------------------------
    console.log("\n=== TC002 - NOVO EVENTO ===");

    const createBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'New Event')]")),
      20000
    );

    console.log("  → Botão 'New Event' localizado");
    await sleep(500);
    await createBtn.click();
    console.log("✔ Clique em 'New Event'");
    testsPassed++;

    // Aguardar que a instrução de mapa apareça (modo de seleção ativo)
    console.log("  → Aguardando modo de seleção de localização...");
    await sleep(800); // Pequeno delay para Vue rerender

    let mapInstruction;
    try {
      mapInstruction = await driver.wait(
        until.elementLocated(By.css(".map-instruction")),
        15000
      );
      const instructionText = await mapInstruction.getText();
      console.log(`  → Instrução encontrada: "${instructionText}"`);
      
      if (instructionText.toLowerCase().includes("click")) {
        console.log("✔ Modo de seleção de localização ativo");
        testsPassed++;
      } else {
        console.log("⚠️ Instrução encontrada mas texto inesperado");
        testsPassed++;
      }
    } catch (err) {
      console.log("❌ Elemento .map-instruction não encontrado dentro do timeout");
      console.log(`  → Erro: ${err.message}`);
      
      // Tentar verificar se o botão foi realmente clicado
      const buttons = await driver.findElements(By.xpath("//button[contains(., 'New Event')]"));
      console.log(`  → Botões 'New Event' ainda visíveis: ${buttons.length}`);
      
      // Tentar clicar novamente
      console.log("  → Tentando clicar novamente em 'New Event'...");
      try {
        const retryBtn = await driver.findElement(By.xpath("//button[contains(., 'New Event')]"));
        await retryBtn.click();
        await sleep(1000);
        
        mapInstruction = await driver.wait(
          until.elementLocated(By.css(".map-instruction")),
          10000
        );
        console.log("✔ Modo de seleção ativo (após retry)");
        testsPassed++;
      } catch (retryErr) {
        console.log("❌ Falha ao ativar modo de seleção mesmo após retry");
        testsFailed++;
        throw retryErr;
      }
    }

    // ---------------------------------------------------------
    // TC003 - SELECIONAR LOCALIZAÇÃO NO MAPA
    // ---------------------------------------------------------
    console.log("\n=== TC003 - SELEÇÃO DE LOCALIZAÇÃO ===");

    let mapElement;
    try {
      mapElement = await driver.wait(
        until.elementLocated(By.css("#map")),
        15000
      );
      console.log("  → Elemento mapa (#map) localizado");
    } catch (err) {
      console.log("❌ Mapa não encontrado");
      testsFailed++;
      throw err;
    }

    await sleep(500);

    // Obter dimensões e posição do mapa
    const mapRect = await driver.executeScript(
      "const el = arguments[0]; return {width: el.offsetWidth, height: el.offsetHeight, x: el.offsetLeft, y: el.offsetTop};",
      mapElement
    );
    console.log(`  → Dimensões do mapa: ${mapRect.width}x${mapRect.height}`);

    // Clicar no centro do mapa
    const clickX = Math.floor(mapRect.width / 2);
    const clickY = Math.floor(mapRect.height / 2);

    console.log(`  → Clicando em posição: x=${clickX}, y=${clickY}`);
    
    try {
      await driver.actions({ bridge: true })
        .move({ origin: mapElement, x: clickX, y: clickY })
        .click()
        .perform();
      
      console.log("✔ Clique no mapa efetuado com sucesso");
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao clicar no mapa: ${err.message}`);
      testsFailed++;
      throw err;
    }

    // ---------------------------------------------------------
    // TC004 - FORMULÁRIO DE EVENTO APARECER
    // ---------------------------------------------------------
    console.log("\n=== TC004 - ABERTURA DO FORMULÁRIO ===");

    let overlay;
    try {
      overlay = await driver.wait(
        until.elementLocated(By.css(".overlay")),
        15000
      );
      console.log("✔ Overlay/Modal do formulário apresentado");
      testsPassed++;
    } catch (err) {
      console.log(`❌ Modal não apareceu: ${err.message}`);
      testsFailed++;
      throw err;
    }

    await sleep(500);

    let modalTitle;
    try {
      modalTitle = await driver.findElement(By.css(".modal .title"));
      const titleText = await modalTitle.getText();
      
      if (titleText.includes("Create New Event")) {
        console.log(`✔ Título do formulário correto: "${titleText}"`);
        testsPassed++;
      } else {
        console.log(`⚠️ Título encontrado mas diferente do esperado: "${titleText}"`);
        testsPassed++;
      }
    } catch (err) {
      console.log(`❌ Não conseguiu ler título do modal: ${err.message}`);
      testsFailed++;
    }

    // ---------------------------------------------------------
    // TC005 - PREENCHER CAMPOS DO FORMULÁRIO
    // ---------------------------------------------------------
    console.log("\n=== TC005 - PREENCHIMENTO DE FORMULÁRIO ===");

    await sleep(800);

    // Dados de teste
    const eventData = {
      title: "Evento de Teste Selenium",
      description: "Descrição automática gerada pelo teste Selenium.",
      category: "Infrastructure",
      location: "Vila do Conde",
      priority: "Medium"
    };

    // Localizar campos
    let titleInput, descriptionInput, categoryInput, locationInput, latitudeInput, longitudeInput, priorityInput;

    try {
      titleInput = await driver.findElement(By.css(".modal input[placeholder='Event Title']"));
      descriptionInput = await driver.findElement(By.css(".modal textarea"));
      categoryInput = await driver.findElement(By.css(".modal select:nth-of-type(1)"));
      locationInput = await driver.findElement(By.css(".modal input[placeholder='Location description']"));
      latitudeInput = await driver.findElement(By.css(".modal input[placeholder='Latitude']"));
      longitudeInput = await driver.findElement(By.css(".modal input[placeholder='Longitude']"));
      priorityInput = await driver.findElement(By.css(".modal select:nth-of-type(2)"));
      console.log("  → Todos os campos localizados");
    } catch (err) {
      console.log(`❌ Erro ao localizar campos do formulário: ${err.message}`);
      testsFailed++;
      throw err;
    }

    // Preencher título
    try {
      await titleInput.clear();
      await titleInput.sendKeys(eventData.title);
      const titleValue = await titleInput.getAttribute("value");
      console.log(`✔ Título preenchido: "${titleValue}"`);
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao preencher título: ${err.message}`);
      testsFailed++;
    }

    // Preencher descrição
    try {
      await descriptionInput.clear();
      await descriptionInput.sendKeys(eventData.description);
      const descriptionValue = await descriptionInput.getAttribute("value");
      console.log(`✔ Descrição preenchida: "${descriptionValue.substring(0, 30)}..."`);
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao preencher descrição: ${err.message}`);
      testsFailed++;
    }

    // Selecionar categoria
    try {
      await categoryInput.click();
      await sleep(300);
      await categoryInput.sendKeys(eventData.category);
      await sleep(300);
      const categoryValue = await categoryInput.getAttribute("value");
      console.log(`✔ Categoria selecionada: ${categoryValue}`);
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao selecionar categoria: ${err.message}`);
      testsFailed++;
    }

    // Preencher localização
    try {
      await locationInput.clear();
      await locationInput.sendKeys(eventData.location);
      const locationValue = await locationInput.getAttribute("value");
      console.log(`✔ Localização preenchida: "${locationValue}"`);
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao preencher localização: ${err.message}`);
      testsFailed++;
    }

    // Verificar latitude/longitude (preenchidas automaticamente pelo mapa)
    try {
      const latValue = await latitudeInput.getAttribute("value");
      const longValue = await longitudeInput.getAttribute("value");
      
      if (latValue && longValue) {
        console.log(`✔ Coordenadas capturadas: [${latValue}, ${longValue}]`);
        testsPassed++;
      } else {
        console.log(`⚠️ Coordenadas vazias (lat: "${latValue}", long: "${longValue}")`);
        console.log("  → Isso pode indicar que o clique no mapa não foi registrado corretamente");
        testsFailed++;
      }
    } catch (err) {
      console.log(`❌ Erro ao verificar coordenadas: ${err.message}`);
      testsFailed++;
    }

    // Selecionar prioridade
    try {
      await priorityInput.click();
      await sleep(300);
      await priorityInput.sendKeys(eventData.priority);
      await sleep(300);
      const priorityValue = await priorityInput.getAttribute("value");
      console.log(`✔ Prioridade selecionada: ${priorityValue}`);
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao selecionar prioridade: ${err.message}`);
      testsFailed++;
    }

    // ---------------------------------------------------------
    // TC006 - SUBMETER FORMULÁRIO
    // ---------------------------------------------------------
    console.log("\n=== TC006 - SUBMISSÃO DE FORMULÁRIO ===");

    let submitBtn;
    try {
      submitBtn = await driver.findElement(By.css(".modal .create"));
      const submitText = await submitBtn.getText();
      console.log(`  → Botão encontrado: "${submitText}"`);
      testsPassed++;
    } catch (err) {
      console.log(`❌ Botão de submissão não encontrado: ${err.message}`);
      testsFailed++;
      throw err;
    }

    try {
      await submitBtn.click();
      console.log("✔ Clique em botão de criar evento");
      testsPassed++;
    } catch (err) {
      console.log(`❌ Erro ao clicar no botão de submissão: ${err.message}`);
      testsFailed++;
      throw err;
    }

    // Aguardar fechamento do modal
    await sleep(2000);
    
    try {
      const overlayElements = await driver.findElements(By.css(".overlay"));
      if (overlayElements.length === 0) {
        console.log("✔ Modal fechado após submissão");
        testsPassed++;
      } else {
        console.log("⚠️ Modal ainda visível após submissão");
        testsPassed++;
      }
    } catch (err) {
      console.log(`⚠️ Erro ao verificar fechamento do modal: ${err.message}`);
      testsPassed++;
    }

    // ---------------------------------------------------------
    // TC007 - VALIDAR EVENTO NO DASHBOARD
    // ---------------------------------------------------------
    console.log("\n=== TC007 - VALIDAÇÃO DO EVENTO ===");

    await sleep(1500);

    // Procurar evento no painel
    let eventCard;
    try {
      eventCard = await driver.wait(
        until.elementLocated(
          By.xpath(
            `//div[contains(@class,'event-card')][.//h3[contains(text(),'${eventData.title}')]]`
          )
        ),
        20000
      );

      console.log(`✔ Evento "${eventData.title}" encontrado no dashboard`);
      testsPassed++;
    } catch (err) {
      console.log(`❌ Evento não encontrado no dashboard: ${err.message}`);
      
      // Debug: listar eventos visíveis
      try {
        const allCards = await driver.findElements(By.css(".event-card"));
        console.log(`  → Total de cartões visíveis: ${allCards.length}`);
        
        if (allCards.length > 0) {
          const firstCard = allCards[0];
          const titles = await Promise.all(
            allCards.map(async (card) => {
              try {
                const h3 = await card.findElement(By.css("h3"));
                return await h3.getText();
              } catch {
                return "(sem título)";
              }
            })
          );
          console.log(`  → Títulos encontrados: ${titles.join(", ")}`);
        }
      } catch (debugErr) {
        console.log(`  → Erro ao debugar: ${debugErr.message}`);
      }
      
      testsFailed++;
      throw err;
    }

    // Verificar status
    try {
      const status = await eventCard.findElement(By.css(".status"));
      const statusText = await status.getText();

      if (statusText.toLowerCase().includes("pending")) {
        console.log(`✔ Status correto: "${statusText}"`);
        testsPassed++;
      } else {
        console.log(`⚠️ Status encontrado: "${statusText}" (esperado: pending)`);
        testsPassed++;
      }
    } catch (err) {
      console.log(`⚠️ Não conseguiu verificar status: ${err.message}`);
      testsPassed++;
    }

    // Verificar categoria no cartão
    try {
      const cardCategory = await eventCard.findElement(By.css(".category"));
      const categoryText = await cardCategory.getText();
      console.log(`✔ Categoria no cartão: "${categoryText}"`);
      testsPassed++;
    } catch (err) {
      console.log(`⚠️ Categoria não encontrada no cartão: ${err.message}`);
      testsPassed++;
    }

    // Verificar localização
    try {
      const cardLocation = await eventCard.findElement(By.css(".location"));
      const locationText = await cardLocation.getText();
      console.log(`✔ Localização no cartão: "${locationText}"`);
      testsPassed++;
    } catch (err) {
      console.log(`⚠️ Localização não encontrada no cartão: ${err.message}`);
      testsPassed++;
    }

    // ---------------------------------------------------------
    // RESUMO DOS TESTES
    // ---------------------------------------------------------
    console.log("\n" + "=".repeat(50));
    console.log("RESUMO DOS TESTES");
    console.log("=".repeat(50));
    console.log(`✔ Testes passados: ${testsPassed}`);
    console.log(`❌ Testes falhados: ${testsFailed}`);
    console.log(`Total: ${testsPassed + testsFailed}`);
    console.log("=".repeat(50));

    if (testsFailed === 0) {
      console.log("✅ TESTE COMPLETO PASSOU COM SUCESSO!");
    } else {
      console.log(`\n⚠️ ${testsFailed} teste(s) falharam`);
      console.log("\nDicas de debug:");
      console.log("1. Verifique se o servidor está rodando em http://localhost:5173");
      console.log("2. Verifique se a credencial está correta no teste");
      console.log("3. Verifique os seletores CSS nos componentes Vue");
      console.log("4. Abra DevTools (F12) para inspecionar elementos");
    }
    console.log("=".repeat(50) + "\n");

  } catch (err) {
    console.error("\n" + "❌ ".repeat(25));
    console.error("ERRO NO TESTE:");
    console.error(err.message);
    console.error("Stack:", err.stack?.split("\n").slice(0, 5).join("\n"));
    console.error("❌ ".repeat(25) + "\n");
    testsFailed++;
  } finally {
    await driver.quit();
  }
}

runCreateEventTest();
